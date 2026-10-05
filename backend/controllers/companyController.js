const Company = require('../models/Company');
const Job = require('../models/Job');
const { successResponse, errorResponse } = require('../utils/responseHandler');


const getAllCompanies = async (req, res, next) => {
  try {
    const { search, industry, location, page = 1, limit = 12 } = req.query;

    const query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { industry: regex }, { description: regex }];
    }

    if (industry && industry.trim() !== '') {
      query.industry = new RegExp(industry.trim(), 'i');
    }

    if (location && location.trim() !== '') {
      query.location = new RegExp(location.trim(), 'i');
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [companies, total] = await Promise.all([
      Company.find(query).sort({ name: 1 }).skip(skip).limit(limitNum),
      Company.countDocuments(query)
    ]);

    const companyIds = companies.map((c) => c._id);
    const jobCounts = await Job.aggregate([
      { $match: { company: { $in: companyIds }, status: 'active' } },
      { $group: { _id: '$company', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    jobCounts.forEach((jc) => {
      countMap[jc._id.toString()] = jc.count;
    });

    const enrichedCompanies = companies.map((comp) => ({
      ...comp.toObject(),
      activeJobsCount: countMap[comp._id.toString()] || 0
    }));

    return successResponse(res, 200, 'Companies retrieved', { companies: enrichedCompanies }, {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};


const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return errorResponse(res, 404, 'Company not found');
    }

    const jobs = await Job.find({ company: company._id, status: 'active' }).sort({ createdAt: -1 });

    return successResponse(res, 200, 'Company details retrieved', {
      company,
      jobs,
      activeJobsCount: jobs.length
    });
  } catch (error) {
    next(error);
  }
};


const createCompany = async (req, res, next) => {
  try {
    const { name, logo, industry, location, website, employeeCount, description, about, foundedYear, email } = req.body;

    const existing = await Company.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
    if (existing) {
      return errorResponse(res, 409, 'A company with this name already exists.');
    }

    const company = await Company.create({
      name,
      logo: logo || (req.file ? `/uploads/logos/${req.file.filename}` : ''),
      industry,
      location,
      website,
      employeeCount,
      description,
      about,
      foundedYear,
      email,
      createdBy: req.user._id
    });

    return successResponse(res, 201, 'Company created successfully', { company });
  } catch (error) {
    next(error);
  }
};


const updateCompany = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.logo = `/uploads/logos/${req.file.filename}`;
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!company) {
      return errorResponse(res, 404, 'Company not found');
    }

    return successResponse(res, 200, 'Company updated successfully', { company });
  } catch (error) {
    next(error);
  }
};


const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return errorResponse(res, 404, 'Company not found');
    }

    await Job.updateMany({ company: company._id }, { status: 'inactive' });
    await company.deleteOne();

    return successResponse(res, 200, 'Company and associated jobs updated/removed successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};
