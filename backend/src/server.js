const env = require('./config/env');
const app = require('./app');

/* ---------------------------------------------------------------------
   👉 MONGODB — WHERE TO CONNECT (currently disabled on purpose)
   1. Add MONGODB_URI to backend/.env
   2. Set USE_MONGODB = true in src/db/index.js
   3. Uncomment the block below.
   ---------------------------------------------------------------------
   const { connectDB } = require('./config/db');
   connectDB().then(start).catch((e) => { console.error(e); process.exit(1); });
   --------------------------------------------------------------------- */
const { connectDB } = require('./config/db');
connectDB().then(start).catch((e) => { console.error(e); process.exit(1); });

function start() {
  app.listen(env.port, () => {
    const db = require('./db');
    console.log(`BeautyBloom API on http://localhost:${env.port}  (data store: ${db.name}${db.name === 'memory' ? ' — resets on restart' : ''})`);
  });
}
