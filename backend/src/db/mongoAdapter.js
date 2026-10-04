/* =====================================================================
   MongoDB ADAPTER — READY BUT NOT ACTIVE
   Same interface as memoryDb.js, implemented with the Mongoose models in
   ../models. It is only loaded when USE_MONGODB = true in db/index.js.
   (Written against the models but NOT executed yet, because no database is
   connected — test it once you add your MONGODB_URI.)
   ===================================================================== */
const User = require('../models/User');
const Profile = require('../models/Profile');
const HistoryModule = require('../models/HistoryModule');
const RoutineEntry = require('../models/RoutineEntry');
const JournalEntry = require('../models/JournalEntry');
const Favorite = require('../models/Favorite');

const idOf = (doc) => String(doc._id);
const lean = (q) => q.lean();

module.exports = {
  name: 'mongodb',
  users: {
    async create({ name, email, passwordHash }) {
      const u = await User.create({ name, email, passwordHash });
      return { _id: idOf(u), name: u.name, email: u.email, passwordHash, createdAt: u.createdAt };
    },
    async findByEmail(email) {
      const u = await lean(User.findOne({ email }).select('+passwordHash'));
      return u ? { ...u, _id: idOf(u) } : null;
    },
    async findById(id) {
      const u = await lean(User.findById(id).select('+passwordHash'));
      return u ? { ...u, _id: idOf(u) } : null;
    },
  },
  profiles: {
    async get(userId) {
      const p = await lean(Profile.findOne({ userId }));
      if (!p) return null;
      const { _id, userId: _u, __v, createdAt, updatedAt, ...rest } = p;
      return rest;
    },
    async save(userId, profile) {
      await Profile.findOneAndUpdate({ userId }, { $set: { ...profile, userId } }, { upsert: true, new: true, runValidators: true });
      return profile;
    },
  },
  history: {
    async list(userId) {
      const rows = await lean(HistoryModule.find({ userId, type: 'quiz' }).sort({ moduleNumber: 1 }));
      return rows.map((r) => ({ ...r, id: idOf(r) }));
    },
    async add(userId, partial) {
      // Highest existing number + 1 (not a count), so numbering can never collide with older records.
      const last = await lean(HistoryModule.findOne({ userId }).sort({ moduleNumber: -1 }).select('moduleNumber'));
      const doc = await HistoryModule.create({ ...partial, userId, moduleNumber: (last ? last.moduleNumber : 0) + 1 });
      return { ...doc.toObject(), id: idOf(doc) };
    },
  },
  journal: {
    async list(userId) {
      const rows = await lean(JournalEntry.find({ userId }).sort({ createdAt: -1 }));
      return rows.map((r) => ({ id: r.clientId, title: r.title, content: r.content, mood: r.mood, tags: r.tags, createdAt: r.createdAt }));
    },
    async replace(userId, entries) {
      await JournalEntry.deleteMany({ userId });
      if (entries.length) await JournalEntry.insertMany(entries.map((e) => ({ userId, clientId: e.id, title: e.title, content: e.content, mood: e.mood, tags: e.tags, createdAt: e.createdAt })));
      return entries;
    },
  },
  favorites: {
    async list(userId) { return lean(Favorite.find({ userId }).select('-_id -userId -__v')); },
    // Atomic upsert on the unique (userId, itemType, itemId) index: two quick clicks can never create a duplicate.
    async add(userId, item) {
      try {
        const r = await Favorite.updateOne({ userId, itemType: item.itemType, itemId: item.itemId }, { $setOnInsert: { ...item, userId } }, { upsert: true });
        return r.upsertedCount > 0;
      } catch (e) { if (e && e.code === 11000) return false; throw e; }
    },
    async remove(userId, itemType, itemId) { await Favorite.deleteOne({ userId, itemType, itemId }); },
  },
  routine: {
    async get(userId) {
      const rows = await lean(RoutineEntry.find({ userId }));
      return Object.fromEntries(rows.map((r) => [r.date, { morning: r.morning, night: r.night }]));
    },
    async replace(userId, map) {
      await RoutineEntry.deleteMany({ userId });
      const docs = Object.entries(map).map(([date, v]) => ({ userId, date, morning: v.morning, night: v.night }));
      if (docs.length) await RoutineEntry.insertMany(docs);
      return map;
    },
  },
  async wipeUser(userId) {
    await Promise.all([
      User.deleteOne({ _id: userId }), Profile.deleteMany({ userId }), HistoryModule.deleteMany({ userId }),
      JournalEntry.deleteMany({ userId }), Favorite.deleteMany({ userId }), RoutineEntry.deleteMany({ userId }),
    ]);
  },
};
