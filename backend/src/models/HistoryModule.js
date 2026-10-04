const mongoose = require('mongoose');
// One numbered card in Profile -> History: a saved Skin Quiz result.
const HistoryModuleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  moduleNumber: { type: Number, required: true },
  type: { type: String, enum: ['quiz'], required: true },
  quiz: {
    resultSkinType: String, resultSensitivity: String, resultConcerns: [String], completedAt: Date,
  },
  recommendations: [String],
}, { timestamps: true });
HistoryModuleSchema.index({ userId: 1, moduleNumber: 1 }, { unique: true });
module.exports = mongoose.models.HistoryModule || mongoose.model('HistoryModule', HistoryModuleSchema);
