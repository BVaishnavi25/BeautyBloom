const mongoose = require('mongoose');
const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  itemType: { type: String, enum: ['Ingredient', 'Tip', 'Look'], required: true },
  itemId: { type: String, required: true },
  title: { type: String, maxlength: 120 },
  description: { type: String, maxlength: 400 },
  addedAt: { type: Date, default: Date.now },
});
FavoriteSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });
module.exports = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
