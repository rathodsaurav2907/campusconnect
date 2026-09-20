const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const Student = require('../src/models/Student');
const Course = require('../src/models/Course');
const Enrollment = require('../src/models/Enrollment');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusconnect-test');
  }
});

afterAll(async () => {
  await Student.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
  await mongoose.connection.close();
});

describe('Health Check', () => {
  test('GET /health should return 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('CampusConnect');
  });
});

describe('Student Endpoints', () => {
  let studentId;

  test('POST /api/students - Create student', async () => {
    const res = await request(app)
      .post('/api/students')
      .send({
        firstName: 'Raj',
        lastName: 'Kumar',
        email: 'raj@campus.edu',
        phone: '+91-9999999999',
        department: 'Computer Science',
        semester: 3
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.firstName).toBe('Raj');
    studentId = res.body._id;
  });

  test('GET /api/students - List students', async () => {
    const res = await request(app).get('/api/students');
    expect(res.statusCode).toBe(200);
    expect(res.body.students).toBeInstanceOf(Array);
  });

  test('GET /api/students/:id - Get student details', async () => {
    const res = await request(app).get(`/api/students/${studentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(studentId);
  });

  test('PUT /api/students/:id - Update student', async () => {
    const res = await request(app)
      .put(`/api/students/${studentId}`)
      .send({
        gpa: 3.8,
        semester: 4
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.gpa).toBe(3.8);
  });

  test('DELETE /api/students/:id - Delete student', async () => {
    const res = await request(app).delete(`/api/students/${studentId}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Course Endpoints', () => {
  let courseId;

  test('POST /api/courses - Create course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .send({
        courseName: 'Data Structures',
        courseCode: 'CS201',
        description: 'Learn DS concepts',
        credits: 3,
        department: 'Computer Science',
        capacity: 50,
        semester: 2
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.courseName).toBe('Data Structures');
    courseId = res.body._id;
  });

  test('GET /api/courses - List courses', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(200);
    expect(res.body.courses).toBeInstanceOf(Array);
  });

  test('GET /api/courses/:id - Get course', async () => {
    const res = await request(app).get(`/api/courses/${courseId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(courseId);
  });

  test('PUT /api/courses/:id - Update course', async () => {
    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .send({ capacity: 60 });

    expect(res.statusCode).toBe(200);
    expect(res.body.capacity).toBe(60);
  });

  test('DELETE /api/courses/:id - Delete course', async () => {
    const res = await request(app).delete(`/api/courses/${courseId}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Enrollment Endpoints', () => {
  let studentId, courseId, enrollmentId;

  beforeEach(async () => {
    const student = new Student({
      studentId: `STU-${Date.now()}`,
      firstName: 'Test',
      lastName: 'Student',
      email: `test${Date.now()}@campus.edu`,
      phone: '+91-8888888888',
      department: 'Computer Science',
      semester: 2
    });
    await student.save();
    studentId = student._id;

    const course = new Course({
      courseId: `COURSE-${Date.now()}`,
      courseName: 'Test Course',
      courseCode: `CS999-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      credits: 3,
      department: 'Computer Science',
      capacity: 50,
      semester: 2
    });
    await course.save();
    courseId = course._id;
  });

  test('POST /api/enrollments - Create enrollment', async () => {
    const res = await request(app)
      .post('/api/enrollments')
      .send({
        studentId: studentId.toString(),
        courseId: courseId.toString(),
        semester: 2
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('enrolled');
    enrollmentId = res.body._id;
  });

  test('GET /api/enrollments - List enrollments', async () => {
    const res = await request(app).get('/api/enrollments');
    expect(res.statusCode).toBe(200);
    expect(res.body.enrollments).toBeInstanceOf(Array);
  });

  test('GET /api/enrollments/:studentId - Get student enrollments', async () => {
    await request(app)
      .post('/api/enrollments')
      .send({
        studentId: studentId.toString(),
        courseId: courseId.toString(),
        semester: 2
      });

    const res = await request(app).get(`/api/enrollments/${studentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('PATCH /api/enrollments/:id - Update enrollment', async () => {
    const res = await request(app)
      .patch(`/api/enrollments/${enrollmentId}`)
      .send({
        grade: 'A',
        status: 'completed'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.grade).toBe('A');
  });
});
