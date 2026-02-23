const mongoose = require('mongoose');

const VacancySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  company: String,
  salary: {
    min: Number,
    max: Number,
  },

  department: String,
  level: { type: String, enum: ['junior', 'middle', 'senior'] },
  rating: { type: Number, min: 1, max: 5, default: null },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
  createdAt: { type: Date, default: Date.now },
});

// Метод для обновления рейтинга
VacancySchema.methods.updateRating = async function () {
  const Comment = require('./Comment');
  const comments = await Comment.find({ vacancy: this._id });
  if (comments.length) {
    const sum = comments.reduce((acc, c) => acc + c.rating, 0);
    this.rating = Math.round((sum / comments.length) * 10) / 10;
  } else {
    this.rating = 0;
  }
  await this.save();
};

module.exports = mongoose.models.Vacancy || mongoose.model('Vacancy', VacancySchema);
