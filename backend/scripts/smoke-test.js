/* End-to-end smoke test (no database or API key needed): npm test */
process.env.NODE_ENV = 'test';
const app = require('../src/app');

let pass = 0, fail = 0;
const ok = (cond, name) => { cond ? pass++ : fail++; console.log(`${cond ? '  ✓' : '  ✗ FAIL'} ${name}`); };

(async () => {
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}/api`;
  let cookie = '';
  const call = async (method, path, body, extra = {}) => {
    const headers = { 'X-BB-Client': 'web', ...(cookie ? { cookie } : {}), ...extra };
    let payload = body;
    if (body && !(body instanceof FormData)) { headers['content-type'] = 'application/json'; payload = JSON.stringify(body); }
    const res = await fetch(base + path, { method, headers, body: payload });
    const set = res.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0];
    let json = null; try { json = await res.json(); } catch { /* none */ }
    return { status: res.status, json, headers: res.headers };
  };

  console.log('Public');
  ok((await call('GET', '/health')).status === 200, 'health');
  const content = await call('GET', '/content');
  ok(content.json.INGREDIENTS.length === 10 && content.json.QUIZ_QUESTIONS[0].options[0].type === undefined, 'content served; quiz scoring keys not exposed');

  console.log('Auth & access control');
  ok((await call('GET', '/state')).status === 401, 'state requires sign-in');
  ok((await call('POST', '/auth/signup', { email: 'bad', password: 'longenough1' })).status === 400, 'rejects bad email');
  ok((await call('POST', '/auth/signup', { email: 'a@b.co', password: 'short' })).status === 400, 'rejects short password');
  ok((await call('POST', '/auth/signup', { email: 'x@y.co', password: 'longenough1' }, { 'X-BB-Client': 'evil' })).status === 403, 'rejects requests without client header (CSRF)');
  ok((await call('POST', '/auth/signup', { email: 'a@b.c', password: 'longenough1' })).status === 400, 'rejects malformed email');
  const su = await call('POST', '/auth/signup', { name: 'Test', email: 'Test@Example.com', password: 'password123' });
  ok(su.status === 201 && su.json.user.email === 'test@example.com', 'signup signs the user in');
  ok(/HttpOnly/i.test(su.headers.get('set-cookie')), 'session cookie is HttpOnly');
  ok(su.json.user.passwordHash === undefined, 'password hash never returned');
  ok((await call('POST', '/auth/signup', { email: 'test@example.com', password: 'password123' })).status === 409, 'duplicate email rejected');
  ok((await call('POST', '/auth/login', { email: 'test@example.com', password: 'wrongpass' })).status === 401, 'wrong password rejected');
  const me = await call('GET', '/auth/me');
  ok(me.status === 200 && me.json.user.name === 'Test', 'me');

  console.log('Quiz → profile → personalization');
  ok((await call('GET', '/personalization')).json.hasData === false, 'no personalization before the quiz is taken');
  ok((await call('POST', '/quiz', { answers: { q1: 1 } })).status === 400, 'incomplete quiz rejected');
  const quiz = await call('POST', '/quiz', { answers: { q1: 1, q2: 0, q3: 1, q4: 0, q5: 0, q6: 2, q7: 0 } });
  ok(quiz.status === 201 && quiz.json.quizResult.resultSkinType === 'oily', 'quiz scored server-side (oily)');
  ok(quiz.json.profile.skinType === 'oily' && quiz.json.profile.skinConcerns.includes('Acne'), 'quiz result saved to profile automatically');
  const pers = await call('GET', '/personalization');
  ok(pers.json.hasData && pers.json.effective.skinType === 'oily' && pers.json.effective.source === 'quiz', 'effective profile comes from the quiz');
  ok(pers.json.aiGuide.weeklyPlan.length === 7 && pers.json.ingredientIds.length > 0 && pers.json.lookIds.length > 0 && pers.json.notes.makeup.length > 0, 'guide, ingredients, looks and notes generated from quiz');
  ok((await call('PUT', '/profile', { skinType: 'dry', sensitivity: 'low', skinConcerns: ['Acne', '<script>'], beautyGoals: ['Clear Skin'] })).json.profile.skinType === 'oily', 'profile edits cannot override quiz skin type');
  const ap = await call('POST', '/profile/apply-quiz');
  ok(ap.status === 200 && ap.json.profile.skinType === 'oily', 'apply quiz to profile');
  const retake = await call('POST', '/quiz', { answers: { q1: 0, q2: 1, q3: 0, q4: 1, q5: 1, q6: 0, q7: 3 } });
  ok(retake.json.quizResult.resultSkinType === 'dry' && (await call('GET', '/personalization')).json.effective.skinType === 'dry', 'retaking the quiz updates all personalization');

  console.log('Tutorial videos');
  const contentRes = await call('GET', '/content');
  const V = contentRes.json.VIDEOS;
  ok(V && Object.keys(V.routine).length === 5 && Object.values(V.routine).every((r) => r.morning && r.night), 'a morning and night video for every skin type');
  ok(Object.keys(V.makeup).length === 5 && Object.keys(V.looks).length === 6, 'a video for every skin type\'s makeup technique and every makeup look');
  const ids = [...Object.values(V.routine).flatMap((r) => [r.morning.id, r.night.id]), ...Object.values(V.makeup).map((m) => m.id), ...Object.values(V.looks).map((l) => l.id), ...Object.values(V.ingredients).map((i) => i.id)];
  ok(ids.length === new Set(ids).size && ids.every((id) => /^[A-Za-z0-9_-]{11}$/.test(id)), 'no duplicated or malformed video ids');

  console.log('Removed image-analysis feature');
  ok((await call('POST', '/analysis', {})).status === 404, 'analysis endpoint no longer exists');
  const st = await call('GET', '/state');
  ok(st.json.historyModules.length === 2 && st.json.historyModules.every((m) => m.type === 'quiz') && st.json.analysis === undefined, 'state contains only quiz modules');
  ok(st.headers.get('cache-control') === 'no-store', 'personal data responses are no-store');

  console.log('User data validation');
  const j = await call('PUT', '/journal', { journal: [{ id: 'j1', title: 'Hi', content: 'x'.repeat(9000), mood: '😊', tags: ['glow-up', 'bogus'] }, { title: '', content: '' }] });
  ok(j.json.journal.length === 1 && j.json.journal[0].content.length === 4000 && j.json.journal[0].tags.length === 1, 'journal validated/truncated');
  console.log('Favorites');
  ok((await call('GET', '/favorites')).json.favorites.length === 0, 'no favorites before anything is saved');
  const a1 = await call('POST', '/favorites', { itemType: 'Tip', itemId: 't1' });
  ok(a1.status === 201 && a1.json.added === true && a1.json.favorites.length === 1, 'saving a tip adds it');
  ok(a1.json.favorites[0].title && a1.json.favorites[0].description, 'title/description come from the site content, not the browser');
  const a2 = await call('POST', '/favorites', { itemType: 'Tip', itemId: 't1', title: 'Forged' });
  ok(a2.status === 200 && a2.json.added === false && a2.json.favorites.length === 1 && a2.json.favorites[0].title !== 'Forged', 'saving the same item twice never creates a duplicate');
  const contentJson = (await call('GET', '/content')).json;
  const ing = contentJson.INGREDIENTS[0].id, look = contentJson.LOOKS[0].id;
  await call('POST', '/favorites', { itemType: 'Ingredient', itemId: ing });
  await call('POST', '/favorites', { itemType: 'Look', itemId: look });
  ok((await call('GET', '/state')).json.favorites.length === 3, 'all three categories (ingredient, tip, look) can be saved and appear in state (persisted)');
  ok((await call('POST', '/favorites', { itemType: 'Product', itemId: 'p1' })).status === 400 && (await call('POST', '/favorites', { itemType: 'Routine', itemId: 'oily' })).status === 400, 'the removed Product and Routine categories are rejected');
  ok((await call('POST', '/favorites', { itemType: 'Tip', itemId: 'not-a-real-tip' })).status === 400, 'unknown item ids are rejected');
  ok((await call('PUT', '/favorites', { favorites: [] })).status === 404, 'whole-list overwrite endpoint is gone');
  const rm = await call('DELETE', '/favorites/Tip/t1');
  ok(rm.json.favorites.length === 2 && !rm.json.favorites.some((x) => x.itemId === 't1'), 'saving again/clicking the heart again removes it');
  ok((await call('DELETE', '/favorites/Tip/t1')).json.favorites.length === 2, 'removing an item that is not saved is harmless');

  const r = await call('PUT', '/routine', { routineEntries: { '2026-01-05': { morning: { completedSteps: ['a'], skippedSteps: [], mood: '😍' } }, 'not-a-date': {} } });
  ok(Object.keys(r.json.routineEntries).length === 1, 'routine validated');

  console.log('Privacy controls');
  ok((await call('GET', '/account/export')).json.historyModules.length === 2, 'data export');
  const other = await call('POST', '/auth/logout'); cookie = '';
  ok((await call('GET', '/state')).status === 401, 'logout ends session');
  await call('POST', '/auth/login', { email: 'test@example.com', password: 'password123' });
  ok((await call('GET', '/auth/me')).status === 200, 'login works');
  ok((await call('POST', '/auth/login', { email: 'test@example.com', password: 'wrongpass1' })).status === 401, 'wrong password rejected');
  ok((await call('DELETE', '/account')).status === 200, 'account deletion');
  ok((await call('POST', '/auth/login', { email: 'test@example.com', password: 'password123' })).status === 401, 'deleted account cannot sign in');

  server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
