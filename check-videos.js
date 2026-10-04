/* Checks every tutorial video in src/data/videos.js.
     node scripts/check-videos.js            offline: id format, no duplicates, full coverage
     node scripts/check-videos.js --online   also asks YouTube (oEmbed) whether each video still exists and can be embedded
   Run the --online check from a machine with internet access before deploying, and any time a video is replaced. */
const { VIDEOS } = require('../src/data/videos');
const { SKIN_TYPES, INGREDIENTS, LOOKS } = require('../src/data/content');

const entries = [];
const add = (key, v) => entries.push({ key, ...v });
SKIN_TYPES.forEach((s) => {
  ['morning', 'night'].forEach((w) => (VIDEOS.routine[s.id] && VIDEOS.routine[s.id][w] ? add(`routine/${s.id}/${w}`, VIDEOS.routine[s.id][w]) : null));
  if (VIDEOS.makeup[s.id]) add(`makeup/${s.id}`, VIDEOS.makeup[s.id]);
});
LOOKS.forEach((l) => VIDEOS.looks[l.id] && add(`looks/${l.id}`, VIDEOS.looks[l.id]));
INGREDIENTS.forEach((i) => VIDEOS.ingredients[i.id] && add(`ingredients/${i.id}`, VIDEOS.ingredients[i.id]));

let problems = 0;
const bad = (m) => { problems++; console.log('✗', m); };
SKIN_TYPES.forEach((s) => ['morning', 'night'].forEach((w) => { if (!(VIDEOS.routine[s.id] && VIDEOS.routine[s.id][w])) bad(`missing routine video: ${s.id}/${w}`); }));
SKIN_TYPES.forEach((s) => { if (!VIDEOS.makeup[s.id]) bad(`missing makeup video: ${s.id}`); });
LOOKS.forEach((l) => { if (!VIDEOS.looks[l.id]) bad(`missing look video: ${l.id}`); });
INGREDIENTS.forEach((i) => { if (!VIDEOS.ingredients[i.id]) console.log(`! no video yet for ingredient tutorial: ${i.id}`); });
const seen = new Map();
entries.forEach((e) => {
  if (!/^[A-Za-z0-9_-]{11}$/.test(e.id)) bad(`${e.key}: "${e.id}" is not a valid YouTube id`);
  if (seen.has(e.id)) bad(`${e.key} reuses the video of ${seen.get(e.id)}`);
  seen.set(e.id, e.key);
});
console.log(`${entries.length} videos, ${problems} problem(s) found offline.`);

(async () => {
  if (process.argv.includes('--online')) {
    for (const e of entries) {
      try {
        const r = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent('https://www.youtube.com/watch?v=' + e.id)}&format=json`);
        if (r.ok) console.log('✓', e.key, '-', e.id);
        else bad(`${e.key} (${e.id}): YouTube answered ${r.status} — removed, private, or embedding disabled`);
      } catch (err) { bad(`${e.key} (${e.id}): could not reach YouTube (${err.message})`); }
    }
    console.log(`Online check finished: ${problems} problem(s) in total.`);
  }
  process.exit(problems ? 1 : 0);
})();
