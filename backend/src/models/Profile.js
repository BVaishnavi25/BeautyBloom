const mongoose = require('mongoose');
// Personalized Beauty Profile: skin type, concerns, sensitivity, makeup preferences, goals.
const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  skinType: { type: String, enum: ['oily', 'dry', 'combination', 'normal', 'sensitive', null], default: null },
  sensitivity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  skinConcerns: [{ type: String, maxlength: 40 }],
  makeupPreferences: [{ type: String, maxlength: 40 }],
  beautyGoals: [{ type: String, maxlength: 40 }],
  ageRange: { type: String, maxlength: 10, default: '' },
  completedOnboarding: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
