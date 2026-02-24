const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  vacancy: { type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
