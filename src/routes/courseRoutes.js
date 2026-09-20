const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { validateCourse } = require('../middleware/validation');

router.post('/', async (req, res) => {
  const { error, value } = validateCourse(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const courseId = `COURSE-${Date.now()}`;
  const course = new Course({
    ...value,
    courseId
  });

  await course.save();
  res.status(201).json(course);
});

router.get('/', async (req, res) => {
  const { department, semester, status, limit = 20, offset = 0 } = req.query;
  
  const filter = {};
  if (department) filter.department = department;
  if (semester) filter.semester = parseInt(semester);
  if (status) filter.status = status;

  const courses = await Course.find(filter)
    .limit(parseInt(limit))
    .skip(parseInt(offset))
    .sort({ createdAt: -1 });

  const total = await Course.countDocuments(filter);

  res.json({
    courses,
    pagination: {
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(course);
});

router.put('/:id', async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  res.json(course);
});

router.delete('/:id', async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json({ message: 'Course deleted successfully' });
});

module.exports = router;
