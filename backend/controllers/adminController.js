const fs = require('fs');
const Job = require('../models/Job');
const User = require('../models/User');
const Company = require('../models/Company');
const Application = require('../models/Application');
const { sendStatusUpdateEmail } = require('../services/emailService');
const { successResponse, errorResponse } = require('../utils/responseHandler');


const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalJobs,
      activeJobs,
      totalApplications,
      totalCompanies,
      recentJobs,
      recentUsers,
      recentApplications
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Application.countDocuments(),
      Company.countDocuments(),
      Job.find().populate('company', 'name logo').sort({ createdAt: -1 }).limit(5),
      User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 }).limit(5),
      Application.find()
        .populate('job', 'title company')
        .populate('user', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const applicationStatusCounts = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusBreakdown = {
      Applied: 0,
      'Under Review': 0,
      Shortlisted: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0
    };

    applicationStatusCounts.forEach((s) => {
      if (statusBreakdown[s._id] !== undefined) {
        statusBreakdown[s._id] = s.count;
      }
    });

    return successResponse(res, 200, 'Dashboard statistics loaded successfully', {
      totalUsers,
      totalJobs,
      activeJobs,
      totalApplications,
      totalCompanies,
      statusBreakdown,
      recentJobs,
      recentUsers,
      recentApplications
    });
  } catch (error) {
    next(error);
  }
};


const getAllJobsAdmin = async (req, res, next) => {
  try {
    const { search, status, category, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { category: regex }, { location: regex }];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [jobs, totalJobs] = await Promise.all([
      Job.find(query)
        .populate('company', 'name logo location industry')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(query)
    ]);

    return successResponse(res, 200, 'Admin jobs retrieved', { jobs }, {
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalJobs,
        totalPages: Math.ceil(totalJobs / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};


const createJobAdmin = async (req, res, next) => {
  try {
    let {
      title,
      company,
      companyName,
      category,
      description,
      responsibilities,
      requirements,
      requiredSkills,
      experience,
      education,
      salary,
      location,
      jobType,
      workMode,
      vacancies,
      applicationDeadline,
      companyLogo,
      status = 'active',
      benefits,
      featured = false
    } = req.body;

    let companyId = company;
    if (!companyId && companyName) {
      let existingCompany = await Company.findOne({ name: new RegExp(`^${companyName.trim()}$`, 'i') });
      if (!existingCompany) {
        existingCompany = await Company.create({
          name: companyName.trim(),
          logo: companyLogo || '',
          industry: category || 'Technology',
          location: location || 'Remote',
          description: `${companyName} is hiring on JobMate.`,
          createdBy: req.user._id
        });
      }
      companyId = existingCompany._id;
    }

    if (!companyId) {
      return errorResponse(res, 400, 'Company reference or companyName is required.');
    }

    const formatArray = (input) => {
      if (Array.isArray(input)) return input.filter((i) => i && i.trim());
      if (typeof input === 'string') {
        return input.split(/[\n,]/).map((i) => i.trim()).filter(Boolean);
      }
      return [];
    };

    const parsedSalary = typeof salary === 'object' && salary !== null ? salary : {
      min: 0,
      max: 0,
      currency: 'INR',
      display: typeof salary === 'string' && salary ? salary : 'Negotiable'
    };

    const newJob = await Job.create({
      title,
      company: companyId,
      category,
      description,
      responsibilities: formatArray(responsibilities),
      requirements: formatArray(requirements),
      requiredSkills: formatArray(requiredSkills),
      experience,
      education,
      salary: parsedSalary,
      location,
      jobType: jobType || 'Full-time',
      workMode: workMode || 'On-site',
      vacancies: Number(vacancies) || 1,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
      companyLogo: companyLogo || '',
      status: status || 'active',
      benefits: formatArray(benefits),
      featured: Boolean(featured),
      postedBy: req.user._id
    });

    const populatedJob = await Job.findById(newJob._id).populate('company');

    return successResponse(res, 201, 'Job created successfully and published', { job: populatedJob });
  } catch (error) {
    next(error);
  }
};


const updateJobAdmin = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    const updates = { ...req.body };

    const formatArray = (input) => {
      if (Array.isArray(input)) return input.filter((i) => i && i.trim());
      if (typeof input === 'string') {
        return input.split(/[\n,]/).map((i) => i.trim()).filter(Boolean);
      }
      return undefined;
    };

    if (updates.responsibilities) updates.responsibilities = formatArray(updates.responsibilities);
    if (updates.requirements) updates.requirements = formatArray(updates.requirements);
    if (updates.requiredSkills) updates.requiredSkills = formatArray(updates.requiredSkills);
    if (updates.benefits) updates.benefits = formatArray(updates.benefits);

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('company');

    return successResponse(res, 200, 'Job updated successfully', { job: updatedJob });
  } catch (error) {
    next(error);
  }
};


const deleteJobAdmin = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    await Promise.all([
      job.deleteOne(),
      Application.deleteMany({ job: job._id })
    ]);

    return successResponse(res, 200, 'Job and associated applications deleted successfully');
  } catch (error) {
    next(error);
  }
};


const updateJobStatusAdmin = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive', 'closed'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status. Must be active, inactive, or closed.');
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('company');

    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    return successResponse(res, 200, `Job status updated to ${status}`, { job });
  } catch (error) {
    next(error);
  }
};


const bulkUploadJobsJson = async (req, res, next) => {
  try {
    let jobsData = [];

    if (req.file) {
      const fileContent = fs.readFileSync(req.file.path, 'utf8');
      try {
        const parsed = JSON.parse(fileContent);
        if (Array.isArray(parsed)) {
          jobsData = parsed;
        } else if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.jobs)) {
            jobsData = parsed.jobs;
          } else {
            const arrayKey = Object.keys(parsed).find(k => Array.isArray(parsed[k]));
            if (arrayKey) {
              jobsData = parsed[arrayKey];
            } else {
              jobsData = [parsed];
            }
          }
        }
      } catch (parseErr) {
        return errorResponse(res, 400, 'Invalid JSON format in uploaded file. Please check the syntax.');
      }
    } else if (Array.isArray(req.body)) {
      jobsData = req.body;
    } else if (req.body && Array.isArray(req.body.jobs)) {
      jobsData = req.body.jobs;
    } else if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
      const arrayKey = Object.keys(req.body).find(k => Array.isArray(req.body[k]));
      if (arrayKey) {
        jobsData = req.body[arrayKey];
      } else {
        jobsData = [req.body];
      }
    } else {
      return errorResponse(res, 400, 'Please provide an array of jobs either in a JSON file upload or as a JSON body.');
    }

    if (!Array.isArray(jobsData) || jobsData.length === 0) {
      return errorResponse(res, 400, 'JSON content must contain a non-empty array of jobs.');
    }

    let insertedCount = 0;
    const errors = [];
    const companyCache = new Map();

    for (let i = 0; i < jobsData.length; i++) {
      const item = jobsData[i];
      try {
        const title = item.title || item.jobTitle;
        const rawComp = item.companyName || item.company;

        if (!title || !rawComp) {
          errors.push(`Item #${i + 1} (${title || 'Untitled'}): Missing title or company name`);
          continue;
        }

        let companyId = null;
        const isObjectId = typeof rawComp === 'string' && mongoose.Types.ObjectId.isValid(rawComp) && rawComp.length === 24;

        if (isObjectId) {
          companyId = rawComp;
        } else {
          const compName = String(rawComp).trim();
          const cacheKey = compName.toLowerCase();

          if (companyCache.has(cacheKey)) {
            companyId = companyCache.get(cacheKey);
          } else {
            let company = await Company.findOne({ name: new RegExp(`^${compName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
            if (!company) {
              company = await Company.create({
                name: compName,
                logo: item.companyLogoUrl || item.companyLogo || '',
                industry: item.jobCategory || item.category || 'Information Technology',
                location: item.location || 'India',
                website: item.companyWebsite || `https://${compName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
                employeeCount: item.companySize || '100-500 employees',
                description: item.companyDescription || `${compName} is a leading organization creating innovative technology solutions and empowering talent.`,
                about: `${compName} specializes in cutting-edge products, modern engineering practices, and rewarding career opportunities.`,
                foundedYear: item.foundedYear || 2018,
                createdBy: req.user?._id
              });
            } else if (!company.logo && (item.companyLogoUrl || item.companyLogo)) {
              company.logo = item.companyLogoUrl || item.companyLogo;
              await company.save();
            }
            companyId = company._id;
            companyCache.set(cacheKey, companyId);
          }
        }

        const formatArray = (arr) => {
          if (Array.isArray(arr)) return arr;
          if (typeof arr === 'string') return arr.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
          return [];
        };

        const salaryDisplay = item.salaryDisplay || (typeof item.salary === 'string' ? item.salary : item.salary?.display) || 'Negotiable';
        const salaryObj = typeof item.salary === 'object' && item.salary !== null
          ? { display: salaryDisplay, ...item.salary }
          : { display: salaryDisplay, min: 0, max: 0, currency: 'INR', period: 'per year' };

        const statusRaw = (item.jobStatus || item.status || 'active').toLowerCase();
        const validStatuses = ['active', 'inactive', 'closed'];
        const status = validStatuses.includes(statusRaw) ? statusRaw : 'active';

        await Job.create({
          title: title.trim(),
          company: companyId,
          category: item.jobCategory || item.category || 'Software Engineering',
          description: item.description || `Exciting career opportunity for ${title}.`,
          responsibilities: formatArray(item.keyResponsibilities || item.responsibilities || ['Design and deliver high-quality solutions']),
          requirements: formatArray(item.candidateRequirements || item.requirements || ['Degree in relevant field']),
          requiredSkills: formatArray(item.requiredSkills || item.skills || ['Problem Solving', 'Communication']),
          experience: item.experienceLevel || item.experience || 'Fresher',
          education: item.educationRequirement || item.education || "Bachelor's Degree",
          salary: salaryObj,
          location: item.location || 'Bangalore, India',
          jobType: item.jobType || 'Full-time',
          workMode: item.workMode || 'On-site',
          vacancies: Number(item.numberOfVacancies || item.vacancies) || 1,
          applicationDeadline: item.applicationDeadline ? new Date(item.applicationDeadline) : undefined,
          companyLogo: item.companyLogoUrl || item.companyLogo || '',
          status,
          benefits: formatArray(item.perksAndBenefits || item.benefits || []),
          featured: Boolean(item.featured),
          postedBy: req.user?._id
        });

        insertedCount++;
      } catch (err) {
        errors.push(`Item #${i + 1} (${item.title || item.jobTitle}): ${err.message}`);
      }
    }

    return successResponse(res, 201, `Successfully imported ${insertedCount} jobs into MongoDB.`, {
      totalReceived: jobsData.length,
      insertedCount,
      errors
    });
  } catch (error) {
    next(error);
  }
};


const getAllUsersAdmin = async (req, res, next) => {
  try {
    const { search, role, candidateType, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { location: regex }];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (candidateType && candidateType !== 'all') {
      query.candidateType = candidateType;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query)
    ]);

    return successResponse(res, 200, 'Users retrieved successfully', { users }, {
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


const updateUserStatusAdmin = async (req, res, next) => {
  try {
    const { isActive, role } = req.body;

    const updates = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (role !== undefined) updates.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, 'User updated successfully', { user });
  } catch (error) {
    next(error);
  }
};


const deleteUserAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    if (user._id.toString() === req.user._id.toString()) {
      return errorResponse(res, 400, 'You cannot delete your own admin account.');
    }

    await Promise.all([
      user.deleteOne(),
      Application.deleteMany({ user: user._id })
    ]);

    return successResponse(res, 200, 'User and associated data removed successfully');
  } catch (error) {
    next(error);
  }
};


const getAllApplicationsAdmin = async (req, res, next) => {
  try {
    const { status, jobId, page = 1, limit = 15 } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (jobId) {
      query.job = jobId;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate({
          path: 'job',
          populate: { path: 'company', select: 'name logo' }
        })
        .populate('user', 'name email phone location candidateType skills avatar resumeUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Application.countDocuments(query)
    ]);

    return successResponse(res, 200, 'Applications retrieved', { applications }, {
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


const updateApplicationStatusAdmin = async (req, res, next) => {
  try {
    const { status, comment, adminNotes } = req.body;

    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('user');

    if (!application) {
      return errorResponse(res, 404, 'Application not found');
    }

    application.status = status;
    if (adminNotes !== undefined) {
      application.adminNotes = adminNotes;
    }

    application.statusHistory.push({
      status,
      changedAt: new Date(),
      comment: comment || `Status updated to ${status} by admin`,
      updatedBy: req.user._id
    });

    await application.save();

    sendStatusUpdateEmail(
      { fullName: application.fullName, email: application.email },
      application.job,
      status,
      comment
    ).catch((err) => console.error('[Status Email Error]', err.message));

    return successResponse(res, 200, `Application status updated to ${status}`, { application });
  } catch (error) {
    next(error);
  }
};


module.exports = {
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
};
