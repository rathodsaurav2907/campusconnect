const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');
const { validateEnrollment } = require('../middleware/validation');

router.post('/', async (req, res) => {
  const { error, value } = validateEnrollment(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const student = await Student.findById(value.studentId);
  const course = await Course.findById(value.courseId);

  if (!student || !course) {
    return res.status(404).json({ error: 'Student or Course not found' });
  }

  if (course.enrolledStudents >= course.capacity) {
    return res.status(400).json({ error: 'Course is full' });
  }

  const enrollmentId = `ENR-${Date.now()}`;
  const enrollment = new Enrollment({
    ...value,
    enrollmentId
  });

  await enrollment.save();

  // Update student and course
  student.enrolledCourses.push(course._id);
  await student.save();

  course.enrolledStudents += 1;
  await course.save();

  res.status(201).json(enrollment);
});

router.get('/', async (req, res) => {
  const { status, semester, limit = 20, offset = 0 } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (semester) filter.semester = parseInt(semester);

  const enrollments = await Enrollment.find(filter)
    .populate('studentId')
    .populate('courseId')
    .limit(parseInt(limit))
    .skip(parseInt(offset))
    .sort({ enrollmentDate: -1 });

  const total = await Enrollment.countDocuments(filter);

  res.json({
    enrollments,
    pagination: {
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
});

router.get('/:studentId', async (req, res) => {
  const enrollments = await Enrollment.find({ studentId: req.params.studentId })
    .populate('courseId')
    .sort({ enrollmentDate: -1 });

  if (!enrollments || enrollments.length === 0) {
    return res.status(404).json({ error: 'No enrollments found for this student' });
  }

  res.json(enrollments);
});

router.patch('/:id', async (req, res) => {
  const allowedFields = ['grade', 'gradePoints', 'status', 'attendance'];
  const updates = {};
  
  allowedFields.forEach(field => {
    if (field in req.body) {
      updates[field] = req.body[field];
    }
  });

  updates.updatedAt = new Date();

  const enrollment = await Enrollment.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate('studentId courseId');

  if (!enrollment) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }

  res.json(enrollment);
});

module.exports = router;
