const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    unique: true,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    unique: true,
    required: true
  },
  description: String,
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  department: {
    type: String,
    required: true
  },
  instructor: {
    name: String,
    email: String
  },
  capacity: {
    type: Number,
    required: true
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  schedule: {
    days: [String],
    startTime: String,
    endTime: String,
    location: String
  },
  semester: {
    type: Number,
    required: true
  },
  prerequisite: String,
  status: {
    type: String,
    enum: ['active', 'archived', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

courseSchema.index({ courseCode: 1 });
courseSchema.index({ department: 1 });
courseSchema.index({ semester: 1 });

module.exports = mongoose.model('Course', courseSchema);
