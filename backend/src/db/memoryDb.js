/* In-memory data store (development placeholder).
   Implements the SAME interface as db/mongoAdapter.js, so switching to MongoDB
   later does not require touching any controller. Data is lost on restart. */
const crypto = require('crypto');

const users = new Map();       // id -> user
const emailIndex = new Map();  // email -> id
const profiles = new Map();    // userId -> profile
const history = new Map();     // userId -> [modules]
const journal = new Map();     // userId -> [entries]
const favorites = new Map();   // userId -> [items]
const routine = new Map();     // userId -> { 'YYYY-MM-DD': {morning, night} }

const newId = () => crypto.randomBytes(12).toString('hex');
const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

module.exports = {
  name: 'memory',
  users: {
    async create({ name, email, passwordHash }) {
      const id = newId();
      const user = { _id: id, name, email, passwordHash, createdAt: new Date().toISOString() };
      users.set(id, user); emailIndex.set(email, id);
      return clone(user);
    },
    async findByEmail(email) { const id = emailIndex.get(email); return id ? clone(users.get(id)) : null; },
    async findById(id) { return users.has(id) ? clone(users.get(id)) : null; },
  },
  profiles: {
    async get(userId) { return clone(profiles.get(userId) || null); },
    async save(userId, profile) { profiles.set(userId, clone(profile)); return clone(profile); },
  },
  history: {
    async list(userId) { return clone(history.get(userId) || []); },
    async add(userId, partial) {
      const list = history.get(userId) || [];
      const mod = { id: `mod-${newId()}`, moduleNumber: list.length + 1, createdAt: new Date().toISOString(), ...partial };
      list.push(mod); history.set(userId, list);
      return clone(mod);
    },
  },
  journal: {
    async list(userId) { return clone(journal.get(userId) || []); },
    async replace(userId, entries) { journal.set(userId, clone(entries)); return clone(entries); },
  },
  favorites: {
    async list(userId) { return clone(favorites.get(userId) || []); },
    // Idempotent: saving an item that is already saved changes nothing.
    async add(userId, item) {
      const list = favorites.get(userId) || [];
      if (list.some((f) => f.itemType === item.itemType && f.itemId === item.itemId)) return false;
      favorites.set(userId, [...list, clone(item)]);
      return true;
    },
    async remove(userId, itemType, itemId) {
      const list = favorites.get(userId) || [];
      favorites.set(userId, list.filter((f) => !(f.itemType === itemType && f.itemId === itemId)));
    },
  },
  routine: {
    async get(userId) { return clone(routine.get(userId) || {}); },
    async replace(userId, map) { routine.set(userId, clone(map)); return clone(map); },
  },
  /** Delete everything we hold about a user (account deletion / privacy). */
  async wipeUser(userId) {
    const u = users.get(userId);
    if (u) emailIndex.delete(u.email);
    users.delete(userId);
    [profiles, history, journal, favorites, routine].forEach((m) => m.delete(userId));
  },
};
