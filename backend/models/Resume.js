const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      default: 0
    },
    mimeType: {
      type: String,
      default: ''
    },
    extractedText: {
      type: String,
      default: ''
    },
    analysisResult: {
      score: { type: Number, default: 0 },
      summary: { type: String, default: '' },
      detectedSkills: { type: [String], default: [] },
      education: { type: [String], default: [] },
      experience: { type: [String], default: [] },
      projects: { type: [String], default: [] },
      certifications: { type: [String], default: [] },
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
      atsKeywords: { type: [String], default: [] },
      improvementSuggestions: { type: [String], default: [] }
    }
  },
  {
    timestamps: true
  }
);

resumeSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
