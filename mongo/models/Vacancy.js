const mongoose = require('mongoose');
const SKILLS = require('../../src/shared/constants/skills');
const VacancySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ 
    type: String, 
    enum: SKILLS,  // 👈 только из списка
  }],
  company: String,
  salary: {
    min: Number,
    max: Number,
  },
  commentsStats: {
    total: { type: Number, default: 0 },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    },
    lastUpdated: { type: Date, default: Date.now }
  },
  department: String,
  level: { type: String, enum: ['junior', 'middle', 'senior'] },
  // ИСПРАВЛЕНИЕ ТУТ: меняем min: 1 на min: 0 или убираем min совсем
  rating: { type: Number, min: 0, max: 5, default: 0 }, 
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
  createdAt: { type: Date, default: Date.now },
});

// Улучшенный метод для обновления рейтинга И статистики
VacancySchema.methods.updateRating = async function () {
  // Важно: проверяй путь до файла Comment. Если он в той же папке, то './Comment'
  const Comment = require('./Comment');
  
  const stats = await Comment.aggregate([
    { $match: { vacancy: this._id } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
        rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
        rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
        rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } }
      }
    }
  ]);

  if (stats.length > 0) {
    const data = stats[0];
    this.rating = Math.round(data.averageRating * 10) / 10;
    
    this.commentsStats = {
      total: data.total,
      distribution: {
        1: data.rating1,
        2: data.rating2,
        3: data.rating3,
        4: data.rating4,
        5: data.rating5
      },
      lastUpdated: new Date()
    };
  } else {
    // Теперь это значение (0) пройдет валидацию, так как мы изменили min в схеме
    this.rating = 0; 
    this.commentsStats = {
      total: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      lastUpdated: new Date()
    };
  }
  
  // markModified нужен для вложенных объектов, чтобы Mongoose точно увидел изменения
  this.markModified('commentsStats');
  
  await this.save();
  return this.commentsStats;
};

// Хук pre-save
VacancySchema.pre('save', function () {
  if (this.isModified('comments')) {
    this.markModified('commentsStats');
  }
});

module.exports = mongoose.models.Vacancy || mongoose.model('Vacancy', VacancySchema);