const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide job title'],
      trim: true,
      maxlength: [150, 'Job title cannot exceed 150 characters']
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Please associate a company']
    },
    category: {
      type: String,
      required: [true, 'Please select a job category'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide detailed job description']
    },
    responsibilities: {
      type: [String],
      required: [true, 'Please provide key responsibilities'],
      default: []
    },
    requirements: {
      type: [String],
      default: []
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Please provide required skills'],
      default: []
    },
    experience: {
      type: String,
      required: [true, 'Please specify required experience (e.g., Fresher, 1-3 years)'],
      trim: true
    },
    education: {
      type: String,
      required: [true, 'Please specify education requirements'],
      trim: true
    },
    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
      period: { type: String, default: 'per year' },
      display: { type: String, default: 'Negotiable' },
      isNegotiable: { type: Boolean, default: false }
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
      trim: true
    },
    jobType: {
      type: String,
      required: [true, 'Please select job type'],
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
      default: 'Full-time'
    },
    workMode: {
      type: String,
      required: [true, 'Please select work mode'],
      enum: ['Remote', 'On-site', 'Hybrid'],
      default: 'On-site'
    },
    vacancies: {
      type: Number,
      default: 1,
      min: [1, 'Vacancies must be at least 1']
    },
    applicationDeadline: {
      type: Date
    },
    companyLogo: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'closed'],
      default: 'active'
    },
    benefits: {
      type: [String],
      default: []
    },
    featured: {
      type: Boolean,
      default: false
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    applicationsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

jobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text', category: 'text' });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ category: 1, workMode: 1, jobType: 1 });

module.exports = mongoose.model('Job', jobSchema);
