const env = require('./config/env');
const app = require('./app');

const { connectDB } = require('./config/db');

connectDB()
  .then(start)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

function start() {
  app.listen(env.port, '0.0.0.0', () => {
    const db = require('./db');
    console.log(`BeautyBloom API running on port ${env.port} (data store: ${db.name}${db.name === 'memory' ? ' — resets on restart' : ''})`);
  });
}
