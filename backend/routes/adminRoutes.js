const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllJobsAdmin,
  createJobAdmin,
  updateJobAdmin,
  deleteJobAdmin,
  updateJobStatusAdmin,
  bulkUploadJobsJson,
  getAllUsersAdmin,
  updateUserStatusAdmin,
  deleteUserAdmin,
  getAllApplicationsAdmin,
  updateApplicationStatusAdmin
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');
const { jobValidation } = require('../middleware/validator');
const { uploadResume, uploadJson } = require('../middleware/upload');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);

router.get('/jobs', getAllJobsAdmin);
router.post('/jobs', jobValidation, createJobAdmin);
router.put('/jobs/:id', updateJobAdmin);
router.delete('/jobs/:id', deleteJobAdmin);
router.patch('/jobs/:id/status', updateJobStatusAdmin);

router.post('/jobs/bulk-upload-json', uploadJson.single('file'), bulkUploadJobsJson);

router.get('/users', getAllUsersAdmin);
router.patch('/users/:id', updateUserStatusAdmin);
router.delete('/users/:id', deleteUserAdmin);

router.get('/applications', getAllApplicationsAdmin);
router.patch('/applications/:id/status', updateApplicationStatusAdmin);

module.exports = router;
