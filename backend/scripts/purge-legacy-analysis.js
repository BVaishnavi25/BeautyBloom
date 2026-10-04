/* One-time cleanup for databases created before the image-analysis feature was removed.
   Deletes old 'analysis' history modules (including their stored face thumbnails) and renumbers each
   user's remaining Skin Quiz modules 1..N.   Usage:  node scripts/purge-legacy-analysis.js
   Requires MONGODB_URI in backend/.env. Safe to run more than once. */
require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI is not set in backend/.env'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  const col = mongoose.connection.collection('historymodules');
  const del = await col.deleteMany({ type: 'analysis' });
  await col.updateMany({}, { $unset: { imageThumb: '', analysis: '' } });
  const users = await col.distinct('userId');
  for (const userId of users) {
    const rows = await col.find({ userId }).sort({ moduleNumber: 1 }).toArray();
    for (let i = 0; i < rows.length; i++) if (rows[i].moduleNumber !== i + 1) await col.updateOne({ _id: rows[i]._id }, { $set: { moduleNumber: i + 1 } });
  }
  console.log(`Removed ${del.deletedCount} analysis module(s); renumbered quiz history for ${users.length} user(s).`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
