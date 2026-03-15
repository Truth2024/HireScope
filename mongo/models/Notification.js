import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['new_candidate', 'candidate-accepted', 'candidate-rejected']
  },
  data: {
    candidateId: String,
    vacancyId: String,
    firstName: String,
    secondName: String,
    matchScore: Number,
    avatar: String,
    title: String,
    company: String,
    message: String
  },
  read: { 
    type: Boolean, 
    default: false,
    index: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
});

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);