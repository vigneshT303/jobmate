const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    candidateType: {
      type: String,
      enum: ['fresher', 'experienced'],
      default: 'fresher'
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    preferredLocation: {
      type: [String],
      default: []
    },
    skills: {
      type: [String],
      default: []
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    experience: [
      {
        title: { type: String, trim: true },
        company: { type: String, trim: true },
        location: { type: String, trim: true },
        startDate: { type: String },
        endDate: { type: String },
        current: { type: Boolean, default: false },
        description: { type: String }
      }
    ],
    education: [
      {
        degree: { type: String, trim: true },
        institution: { type: String, trim: true },
        fieldOfStudy: { type: String, trim: true },
        startYear: { type: String },
        endYear: { type: String },
        grade: { type: String }
      }
    ],
    projects: [
      {
        title: { type: String, trim: true },
        description: { type: String },
        link: { type: String },
        technologies: { type: [String], default: [] }
      }
    ],
    certifications: [
      {
        name: { type: String, trim: true },
        issuingOrganization: { type: String, trim: true },
        issueDate: { type: String },
        credentialUrl: { type: String }
      }
    ],
    resumeUrl: {
      type: String,
      default: ''
    },
    resumeFileName: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    github: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
