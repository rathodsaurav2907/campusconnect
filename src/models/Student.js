const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: Date,
  department: {
    type: String,
    required: true,
    enum: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical']
  },
  gpa: {
    type: Number,
    default: 0,
    min: 0,
    max: 4
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'suspended'],
    default: 'active'
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

studentSchema.index({ email: 1 });
studentSchema.index({ department: 1 });
studentSchema.index({ status: 1 });

module.exports = mongoose.model('Student', studentSchema);
