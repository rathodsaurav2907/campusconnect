const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { validateStudent } = require('../middleware/validation');

router.post('/', async (req, res) => {
  const { error, value } = validateStudent(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const studentId = `STU-${Date.now()}`;
  const student = new Student({
    ...value,
    studentId
  });

  await student.save();
  res.status(201).json(student);
});

router.get('/', async (req, res) => {
  const { department, status, semester, limit = 20, offset = 0 } = req.query;
  
  const filter = {};
  if (department) filter.department = department;
  if (status) filter.status = status;
  if (semester) filter.semester = parseInt(semester);

  const students = await Student.find(filter)
    .limit(parseInt(limit))
    .skip(parseInt(offset))
    .sort({ createdAt: -1 });

  const total = await Student.countDocuments(filter);

  res.json({
    students,
    pagination: {
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
});

router.get('/:id', async (req, res) => {
  const student = await Student.findById(req.params.id).populate('enrolledCourses');
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(student);
});

router.put('/:id', async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json(student);
});

router.delete('/:id', async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json({ message: 'Student deleted successfully' });
});

module.exports = router;
