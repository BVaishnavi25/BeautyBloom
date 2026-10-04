const mongoose = require('mongoose');
const Part = { completedSteps: [String], skippedSteps: [String], mood: { type: String, default: null } };
const RoutineEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  morning: Part,
  night: Part,
}, { timestamps: true });
RoutineEntrySchema.index({ userId: 1, date: 1 }, { unique: true });
module.exports = mongoose.models.RoutineEntry || mongoose.model('RoutineEntry', RoutineEntrySchema);
