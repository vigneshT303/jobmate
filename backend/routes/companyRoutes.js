const express = require('express');
const router = express.Router();
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
} = require('../controllers/companyController');
const { protect, adminOnly } = require('../middleware/auth');
const { companyValidation } = require('../middleware/validator');
const { uploadImage } = require('../middleware/upload');

router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);

router.post('/', protect, adminOnly, uploadImage.single('logo'), companyValidation, createCompany);
router.put('/:id', protect, adminOnly, uploadImage.single('logo'), updateCompany);
router.delete('/:id', protect, adminOnly, deleteCompany);

module.exports = router;
