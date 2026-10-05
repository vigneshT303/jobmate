const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseHandler');


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg
    }));
    return errorResponse(res, 400, 'Validation failed. Please check input fields.', formattedErrors);
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('candidateType').optional().isIn(['fresher', 'experienced']).withMessage('Candidate type must be fresher or experienced'),
  validate
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('category').trim().notEmpty().withMessage('Job category is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('experience').trim().notEmpty().withMessage('Experience requirement is required'),
  body('education').trim().notEmpty().withMessage('Education requirement is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType').isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']).withMessage('Invalid job type'),
  body('workMode').isIn(['Remote', 'On-site', 'Hybrid']).withMessage('Invalid work mode'),
  validate
];

const applicationValidation = [
  body('jobId').trim().notEmpty().withMessage('Job ID is required'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  validate
];

const companyValidation = [
  body('name').trim().notEmpty().withMessage('Company name is required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('location').trim().notEmpty().withMessage('Headquarters location is required'),
  body('description').trim().notEmpty().withMessage('Company description is required'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  jobValidation,
  applicationValidation,
  companyValidation
};
