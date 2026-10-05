const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required']
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant user reference is required']
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true
    },
    education: {
      type: String,
      default: ''
    },
    experience: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume document is required']
    },
    resumeOriginalName: {
      type: String,
      default: 'resume.pdf'
    },
    coverLetter: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied'
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        comment: { type: String, default: '' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }
    ],
    adminNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

applicationSchema.index({ job: 1, user: 1 }, { unique: true });
applicationSchema.index({ company: 1, user: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Application', applicationSchema);
