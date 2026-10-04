const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 80, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
}, { timestamps: true });
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
