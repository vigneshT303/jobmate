const Application = require('../models/Application');
const Job = require('../models/Job');
const { sendApplicationReceivedEmail } = require('../services/emailService');
const { successResponse, errorResponse } = require('../utils/responseHandler');


const applyForJob = async (req, res, next) => {
  try {
    const { jobId, fullName, email, phone, education, experience, skills, resumeUrl, resumeOriginalName, coverLetter } = req.body;

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    if (job.status !== 'active') {
      return errorResponse(res, 400, 'This job posting is no longer accepting applications.');
    }

    if (job.applicationDeadline && new Date() > new Date(job.applicationDeadline)) {
      return errorResponse(res, 400, 'The application deadline for this job has expired.');
    }

    const companyId = job.company?._id || job.company;

    // Check if user has already applied to this specific job OR to this company
    let existing = await Application.findOne({
      user: req.user._id,
      $or: [
        { job: jobId },
        ...(companyId ? [{ company: companyId }] : [])
      ]
    });

    if (!existing && companyId) {
      // Check past applications where company field wasn't populated yet
      const userApps = await Application.find({ user: req.user._id }).populate('job', 'company');
      existing = userApps.find((app) => {
        const appComp = app.company?.toString() || app.job?.company?.toString() || app.job?.company?._id?.toString();
        return appComp && appComp === companyId.toString();
      });
    }

    if (existing) {
      const companyName = job.company?.name || 'this company';
      return errorResponse(res, 409, `You have already applied to ${companyName}. You can only apply to a company once.`);
    }

    const applicationResumeUrl = resumeUrl || req.user.resumeUrl;
    if (!applicationResumeUrl) {
      return errorResponse(res, 400, 'Please upload or provide a resume document to submit your application.');
    }

    const application = await Application.create({
      job: jobId,
      company: companyId,
      user: req.user._id,
      fullName: fullName || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone || '',
      education: education || '',
      experience: experience || '',
      skills: Array.isArray(skills) ? skills : (req.user.skills || []),
      resumeUrl: applicationResumeUrl,
      resumeOriginalName: resumeOriginalName || req.user.resumeFileName || 'Resume.pdf',
      coverLetter: coverLetter || '',
      status: 'Applied',
      statusHistory: [
        {
          status: 'Applied',
          changedAt: new Date(),
          comment: 'Application submitted by candidate'
        }
      ]
    });

    job.applicationsCount += 1;
    await job.save({ validateBeforeSave: false });

    sendApplicationReceivedEmail(
      { fullName: application.fullName, email: application.email },
      job
    ).catch((err) => console.error('[Email Notification Error]', err.message));

    return successResponse(res, 201, 'You have successfully applied for this job.', { application });
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 409, 'You have already applied to this company.');
    }
    next(error);
  }
};


const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate({
        path: 'job',
        select: 'title location salary jobType workMode company status',
        populate: {
          path: 'company',
          select: 'name logo location'
        }
      })
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'My applications retrieved successfully', { applications });
  } catch (error) {
    next(error);
  }
};


const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'job',
        populate: { path: 'company' }
      })
      .populate('user', 'name email phone location candidateType skills avatar');

    if (!application) {
      return errorResponse(res, 404, 'Application not found');
    }

    if (application.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'You are not authorized to view this application');
    }

    return successResponse(res, 200, 'Application details retrieved', { application });
  } catch (error) {
    next(error);
  }
};


const checkApplicationStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate('company', 'name logo');
    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    const companyId = job.company?._id || job.company;

    // Check direct match on job or company
    let existing = await Application.findOne({
      user: req.user._id,
      $or: [
        { job: jobId },
        ...(companyId ? [{ company: companyId }] : [])
      ]
    });

    // Check historical applications where company wasn't populated in application document
    if (!existing && companyId) {
      const userApps = await Application.find({ user: req.user._id }).populate('job', 'company');
      existing = userApps.find((app) => {
        const appComp = app.company?.toString() || app.job?.company?.toString() || app.job?.company?._id?.toString();
        return appComp && appComp === companyId.toString();
      });
    }

    if (existing) {
      const isSameJob = (existing.job?.toString() === jobId.toString()) || (existing.job?._id?.toString() === jobId.toString());
      return successResponse(res, 200, 'Application status checked', {
        hasApplied: true,
        isSameJob,
        isSameCompany: true,
        status: existing.status,
        appliedAt: existing.createdAt,
        companyName: job.company?.name || 'this company'
      });
    }

    return successResponse(res, 200, 'Application status checked', {
      hasApplied: false,
      isSameJob: false,
      isSameCompany: false
    });
  } catch (error) {
    next(error);
  }
};


const getMyAppliedIds = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user._id }).populate('job', 'company');
    const appliedJobIds = [];
    const appliedCompanyIds = [];

    applications.forEach((app) => {
      const jId = app.job?._id?.toString() || (app.job ? app.job.toString() : null);
      if (jId && !appliedJobIds.includes(jId)) {
        appliedJobIds.push(jId);
      }

      const compId = app.company
        ? app.company.toString()
        : (app.job?.company?._id?.toString() || (app.job?.company ? app.job.company.toString() : null));

      if (compId && !appliedCompanyIds.includes(compId)) {
        appliedCompanyIds.push(compId);
      }
    });

    return successResponse(res, 200, 'My applied IDs retrieved', {
      appliedJobIds,
      appliedCompanyIds
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getApplicationById,
  checkApplicationStatus,
  getMyAppliedIds
};
