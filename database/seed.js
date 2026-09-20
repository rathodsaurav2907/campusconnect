const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('../src/models/Student');
const Course = require('../src/models/Course');
const Enrollment = require('../src/models/Enrollment');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');

    await Student.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});

    const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
    const firstNames = ['Akshay', 'Priya', 'Rohan', 'Sneha', 'Arjun', 'Divya', 'Nikhil', 'Ananya', 'Rahul', 'Isha'];
    const lastNames = ['Kumar', 'Singh', 'Patel', 'Sharma', 'Verma', 'Gupta', 'Rao', 'Nair', 'Desai', 'Bhat'];

    const students = [];
    for (let i = 0; i < 50; i++) {
      const student = new Student({
        studentId: `STU-${1000 + i}`,
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        email: `student${i}@campus.edu`,
        phone: `+91-${9000000000 + i}`,
        department: departments[Math.floor(Math.random() * departments.length)],
        semester: Math.floor(Math.random() * 8) + 1,
        gpa: (Math.random() * 4).toFixed(2),
        status: Math.random() > 0.1 ? 'active' : 'inactive'
      });
      students.push(student);
    }

    await Student.insertMany(students);
    console.log('50 students seeded');

    const courseCodes = ['CS101', 'CS201', 'ELEC101', 'MECH101', 'CIVIL101', 'CS301', 'ELEC201', 'MECH201'];
    const courses = [];
    for (let i = 0; i < 15; i++) {
      const code = courseCodes[i % courseCodes.length];
      const course = new Course({
        courseId: `COURSE-${1000 + i}`,
        courseName: `Course ${i + 1}`,
        courseCode: `${code}${Math.floor(i / courseCodes.length)}`,
        description: `Description for course ${i + 1}`,
        credits: Math.floor(Math.random() * 3) + 1,
        department: departments[i % departments.length],
        capacity: Math.floor(Math.random() * 30) + 20,
        semester: (i % 8) + 1,
        instructor: {
          name: `Prof. ${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
          email: `prof${i}@campus.edu`
        },
        schedule: {
          days: ['Monday', 'Wednesday'],
          startTime: `${9 + (i % 6)}:00`,
          endTime: `${10 + (i % 6)}:00`,
          location: `Room ${100 + i}`
        },
        status: 'active'
      });
      courses.push(course);
    }

    await Course.insertMany(courses);
    console.log('15 courses seeded');

    const enrollments = [];
    for (let i = 0; i < 100; i++) {
      const student = students[Math.floor(Math.random() * students.length)];
      const course = courses[Math.floor(Math.random() * courses.length)];

      const enrollment = new Enrollment({
        enrollmentId: `ENR-${1000 + i}`,
        studentId: student._id,
        courseId: course._id,
        semester: student.semester,
        grade: ['A', 'B', 'C', 'D', 'Pending'][Math.floor(Math.random() * 5)],
        gradePoints: Math.random() * 4,
        status: ['enrolled', 'completed', 'dropped'][Math.floor(Math.random() * 3)],
        attendance: Math.floor(Math.random() * 100)
      });
      enrollments.push(enrollment);
    }

    await Enrollment.insertMany(enrollments).catch(() => {
      // Ignore duplicate enrollment errors
    });
    console.log('100 enrollments seeded');

    // Update student enrolled courses
    for (const student of students) {
      const studentEnrollments = await Enrollment.find({ studentId: student._id });
      const courseIds = studentEnrollments.map(e => e.courseId);
      student.enrolledCourses = courseIds;
      await student.save();
    }

    // Update course enrolled students count
    for (const course of courses) {
      const courseEnrollments = await Enrollment.countDocuments({ courseId: course._id });
      course.enrolledStudents = courseEnrollments;
      await course.save();
    }

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
