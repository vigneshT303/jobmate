const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  getFeaturedJobs,
  getLatestJobs,
  getCategories,
  getRecommendedJobs
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.get('/', getAllJobs);
router.get('/featured', getFeaturedJobs);
router.get('/latest', getLatestJobs);
router.get('/categories', getCategories);
router.get('/recommended', protect, getRecommendedJobs);
router.get('/:id', getJobById);

module.exports = router;
