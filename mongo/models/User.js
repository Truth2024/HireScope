const mongoose = require('mongoose');
const SKILLS = require('../../src/shared/constants/skills');
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  secondName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['hr', 'candidate'], default: 'candidate' },
  avatar: { type: String },
  avatarBlur: { type: String },
  skills: [{ 
    type: String, 
    enum: SKILLS,  // 👈 только из списка
  }],
  experience: [
    {
      company: String,
      position: String,
      years: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
