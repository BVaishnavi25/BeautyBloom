/* =====================================================================
   DATA LAYER SWITCH
   ---------------------------------------------------------------------
   👉 TO ENABLE MONGODB LATER: set USE_MONGODB = true (and follow README).
   Every controller talks to `db.*` only, so nothing else needs to change.
   ===================================================================== */
const USE_MONGODB = true; // <-- flip to true after adding MONGODB_URI and calling connectDB() in server.js

module.exports = USE_MONGODB ? require('./mongoAdapter') : require('./memoryDb');
