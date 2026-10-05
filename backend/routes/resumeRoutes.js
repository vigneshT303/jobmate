const express = require('express');
const router = express.Router();
const {
  uploadResumeFile,
  analyzeResume,
  jobMatchWithAI,
  getMyResumes
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');

router.post('/upload', protect, uploadResume.single('resume'), uploadResumeFile);
router.post('/analyze', protect, uploadResume.single('resume'), analyzeResume);
router.post('/job-match', protect, jobMatchWithAI);
router.get('/my', protect, getMyResumes);

module.exports = router;
