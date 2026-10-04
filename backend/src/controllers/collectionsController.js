const db = require('../db');
const { cleanJournal, cleanRoutine } = require('../utils/validators');
const fav = require('../services/favoritesService');

// The UI keeps each collection as one list/map and saves it as a whole; the server validates every field.
exports.getJournal = async (req, res) => res.json({ journal: await db.journal.list(req.user.id) });
exports.putJournal = async (req, res) => res.json({ journal: await db.journal.replace(req.user.id, cleanJournal(req.body.journal)) });

// Favorites are saved one item at a time (atomic and idempotent), never as a whole-list overwrite.
const favoritesFor = async (userId) => fav.resolveList(await db.favorites.list(userId));
exports.getFavorites = async (req, res) => res.json({ favorites: await favoritesFor(req.user.id) });
exports.addFavorite = async (req, res) => {
  const item = fav.canonical(req.body && req.body.itemType, req.body && req.body.itemId);
  if (!item) return res.status(400).json({ error: 'That item can’t be saved to favorites.' });
  const added = await db.favorites.add(req.user.id, { ...item, addedAt: new Date().toISOString() });
  res.status(added ? 201 : 200).json({ added, favorites: await favoritesFor(req.user.id) });
};
exports.removeFavorite = async (req, res) => {
  await db.favorites.remove(req.user.id, String(req.params.itemType), String(req.params.itemId));
  res.json({ favorites: await favoritesFor(req.user.id) });
};
exports.getRoutine = async (req, res) => res.json({ routineEntries: await db.routine.get(req.user.id) });
exports.putRoutine = async (req, res) => res.json({ routineEntries: await db.routine.replace(req.user.id, cleanRoutine(req.body.routineEntries)) });
