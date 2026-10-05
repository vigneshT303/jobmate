const express = require('express');
const router = express.Router();
const {
  saveJob,
  removeSavedJob,
  getSavedJobs,
  checkIsSaved
} = require('../controllers/savedJobController');
const { protect } = require('../middleware/auth');

router.post('/:jobId', protect, saveJob);
router.delete('/:jobId', protect, removeSavedJob);
router.get('/', protect, getSavedJobs);
router.get('/check/:jobId', protect, checkIsSaved);

module.exports = router;
