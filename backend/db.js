/* =====================================================================
   MONGODB CONNECTION — INTENTIONALLY NOT CALLED YET
   ---------------------------------------------------------------------
   👉 WHERE TO ADD MONGODB LATER:
      1. Put your connection string in backend/.env  ->  MONGODB_URI=...
      2. In backend/src/db/index.js set  USE_MONGODB = true
      3. (Optional) call connectDB() from backend/src/server.js — that
         file already contains a commented-out line showing where.
   Until then the API runs on the in-memory store (src/db/memoryDb.js),
   so all data disappears when the server restarts.
   ===================================================================== */
const { mongoUri } = require('./env');

async function connectDB() {
  if (!mongoUri) throw new Error('MONGODB_URI is not set in backend/.env');
  const mongoose = require('mongoose'); // required lazily so the app runs without a DB
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
  console.log('[db] MongoDB connected');
  return mongoose.connection;
}

module.exports = { connectDB };
