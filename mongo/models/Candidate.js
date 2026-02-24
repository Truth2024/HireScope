const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vacancyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy' },
  status: {
    type: String,
    enum: ['new', 'viewed', 'interview', 'offer', 'rejected'],
    default: 'new',
  },
  matchScore: { type: Number }, // % совпадения (AI)
  notes: String,
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);
