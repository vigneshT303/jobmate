const Job = require('../models/Job');
const Company = require('../models/Company');
const { successResponse, errorResponse } = require('../utils/responseHandler');


const getAllJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      title,
      skills,
      location,
      experience,
      minSalary,
      maxSalary,
      jobType,
      workMode,
      category,
      education,
      companyId,
      sort = 'latest',
      page = 1,
      limit = 10
    } = req.query;

    const query = { status: 'active' };

    if (keyword && keyword.trim() !== '') {
      const sanitized = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(sanitized, 'i');

      const matchedCompanies = await Company.find({ name: regex }, '_id');
      const companyIds = matchedCompanies.map((c) => c._id);

      query.$or = [
        { title: regex },
        { description: regex },
        { requiredSkills: { $in: [regex] } },
        { category: regex },
        { location: regex },
        ...(companyIds.length > 0 ? [{ company: { $in: companyIds } }] : [])
      ];
    }

    if (title && title.trim() !== '') {
      const sanitized = title.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.title = new RegExp(sanitized, 'i');
    }

    if (skills && skills.trim() !== '') {
      const skillList = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      if (skillList.length > 0) {
        query.requiredSkills = { $in: skillList };
      }
    }

    if (location && location.trim() !== '') {
      const sanitized = location.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.location = new RegExp(sanitized, 'i');
    }

    if (experience && experience.trim() !== '') {
      const exp = experience.trim().toLowerCase();
      if (exp === 'fresher' || exp === '0-1') {
        query.experience = new RegExp('fresher|entry|0-|0 -|intern', 'i');
      } else if (exp === '1-3') {
        query.experience = new RegExp('1-2|2-3|1-3|1 - 2|2 - 3|1 year|2 year|3 year', 'i');
      } else if (exp === '3-5') {
        query.experience = new RegExp('3-5|3 - 5|3-4|4-5|4 year|5 year', 'i');
      } else if (exp === '5+' || exp === '5') {
        query.experience = new RegExp('5\\+|5 plus|senior|lead|5-10|5 - 10', 'i');
      } else {
        query.experience = new RegExp(exp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      }
    }

    if (jobType && jobType.trim() !== '') {
      query.jobType = new RegExp(`^${jobType.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    }

    if (workMode && workMode.trim() !== '') {
      query.workMode = new RegExp(`^${workMode.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    }

    if (category && category.trim() !== '') {
      query.category = new RegExp(category.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    }

    if (education && education.trim() !== '') {
      query.education = new RegExp(education.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    }

    if (companyId) {
      query.company = companyId;
    }

    if (minSalary || maxSalary) {
      query['salary.max'] = {};
      if (minSalary) query['salary.max'].$gte = Number(minSalary);
      if (maxSalary) query['salary.min'] = { $lte: Number(maxSalary) };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'salary-high') sortOptions = { 'salary.max': -1 };
    if (sort === 'salary-low') sortOptions = { 'salary.min': 1 };
    if (sort === 'popular') sortOptions = { viewsCount: -1, applicationsCount: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [jobs, totalJobs] = await Promise.all([
      Job.find(query)
        .populate('company', 'name logo location industry employeeCount website')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalJobs / limitNum);

    return successResponse(res, 200, 'Jobs retrieved successfully', { jobs }, {
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalJobs,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    next(error);
  }
};


const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('company');

    if (!job) {
      return errorResponse(res, 404, 'Job posting not found');
    }

    job.viewsCount += 1;
    await job.save({ validateBeforeSave: false });

    return successResponse(res, 200, 'Job details retrieved successfully', { job });
  } catch (error) {
    next(error);
  }
};


const getFeaturedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'active', featured: true })
      .populate('company', 'name logo location industry')
      .limit(6)
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Featured jobs retrieved', { jobs });
  } catch (error) {
    next(error);
  }
};


const getLatestJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'active' })
      .populate('company', 'name logo location industry')
      .limit(8)
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Latest jobs retrieved', { jobs });
  } catch (error) {
    next(error);
  }
};


const getCategories = async (req, res, next) => {
  try {
    const categories = await Job.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const formatted = categories.map((c) => ({
      name: c._id,
      jobCount: c.count
    }));

    return successResponse(res, 200, 'Job categories retrieved', { categories: formatted });
  } catch (error) {
    next(error);
  }
};


const getRecommendedJobs = async (req, res, next) => {
  try {
    const user = req.user;
    const query = { status: 'active' };

    const conditions = [];

    if (user.skills && user.skills.length > 0) {
      const skillRegexes = user.skills.map((s) => new RegExp(s, 'i'));
      conditions.push({ requiredSkills: { $in: skillRegexes } });
    }

    if (user.candidateType === 'fresher') {
      conditions.push({ experience: /fresher|0-1|0-2/i });
    }

    if (user.preferredLocation && user.preferredLocation.length > 0) {
      const locRegexes = user.preferredLocation.map((loc) => new RegExp(loc, 'i'));
      conditions.push({ location: { $in: locRegexes } });
    } else if (user.location) {
      conditions.push({ location: new RegExp(user.location, 'i') });
    }

    if (conditions.length > 0) {
      query.$or = conditions;
    }

    let recommended = await Job.find(query)
      .populate('company', 'name logo location industry')
      .limit(8)
      .sort({ createdAt: -1 });

    if (recommended.length < 4) {
      const existingIds = recommended.map((j) => j._id);
      const fallbackJobs = await Job.find({ status: 'active', _id: { $nin: existingIds } })
        .populate('company', 'name logo location industry')
        .limit(8 - recommended.length)
        .sort({ viewsCount: -1, createdAt: -1 });
      recommended = [...recommended, ...fallbackJobs];
    }

    return successResponse(res, 200, 'Recommended jobs retrieved', { jobs: recommended });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  getFeaturedJobs,
  getLatestJobs,
  getCategories,
  getRecommendedJobs
};
