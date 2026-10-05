const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      unique: true,
      trim: true
    },
    logo: {
      type: String,
      default: ''
    },
    industry: {
      type: String,
      required: [true, 'Please provide company industry'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please provide company headquarters/location'],
      trim: true
    },
    website: {
      type: String,
      default: ''
    },
    employeeCount: {
      type: String,
      default: '50-200 employees'
    },
    description: {
      type: String,
      required: [true, 'Please provide company description']
    },
    about: {
      type: String,
      default: ''
    },
    foundedYear: {
      type: Number,
      default: new Date().getFullYear()
    },
    email: {
      type: String,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Company', companySchema);
