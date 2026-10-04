function notFound(req, res) { res.status(404).json({ error: 'Not found.' }); }
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err && err.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large.' });
  if (err && err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON.' });
  const status = err.status || 500;
  if (status >= 500) console.error('[error]', err); // never leak internals to clients
  res.status(status).json({ error: status >= 500 ? 'Something went wrong. Please try again.' : err.message });
}
module.exports = { notFound, errorHandler };
