const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  enrollmentId: {
    type: String,
    unique: true,
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'F', 'Pending'],
    default: 'Pending'
  },
  gradePoints: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['enrolled', 'completed', 'dropped', 'failed'],
    default: 'enrolled'
  },
  attendance: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  testScores: [
    {
      testName: String,
      score: Number,
      maxScore: Number,
      date: Date
    }
  ],
  assignmentScores: [
    {
      assignmentName: String,
      score: Number,
      maxScore: Number,
      submittedDate: Date
    }
  ],
  semester: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ semester: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
