const Joi = require('joi');

const validateStudent = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    dateOfBirth: Joi.date(),
    department: Joi.string().valid('Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical').required(),
    semester: Joi.number().min(1).max(8).required()
  });

  return schema.validate(data);
};

const validateCourse = (data) => {
  const schema = Joi.object({
    courseName: Joi.string().required(),
    courseCode: Joi.string().required(),
    description: Joi.string(),
    credits: Joi.number().min(1).max(4).required(),
    department: Joi.string().required(),
    capacity: Joi.number().required(),
    semester: Joi.number().required(),
    instructor: Joi.object({
      name: Joi.string(),
      email: Joi.string().email()
    })
  });

  return schema.validate(data);
};

const validateEnrollment = (data) => {
  const schema = Joi.object({
    studentId: Joi.string().required(),
    courseId: Joi.string().required(),
    semester: Joi.number().required()
  });

  return schema.validate(data);
};

module.exports = {
  validateStudent,
  validateCourse,
  validateEnrollment
};
