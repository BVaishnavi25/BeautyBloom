const mongoose = require('mongoose');
const JournalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  clientId: { type: String, required: true },
  title: { type: String, required: true, maxlength: 120 },
  content: { type: String, required: true, maxlength: 4000 },
  mood: { type: String, default: null },
  tags: [{ type: String, maxlength: 30 }],
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.models.JournalEntry || mongoose.model('JournalEntry', JournalEntrySchema);
