const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getApplicationById,
  checkApplicationStatus,
  getMyAppliedIds
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { applicationValidation } = require('../middleware/validator');

router.post('/', protect, applicationValidation, applyForJob);
router.get('/my', protect, getMyApplications);
router.get('/my-applied-ids', protect, getMyAppliedIds);
router.get('/check/:jobId', protect, checkApplicationStatus);
router.get('/:id', protect, getApplicationById);

module.exports = router;
