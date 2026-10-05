const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');
const { successResponse, errorResponse } = require('../utils/responseHandler');


const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    const existing = await SavedJob.findOne({ user: req.user._id, job: jobId });
    if (existing) {
      return successResponse(res, 200, 'Job is already in your saved jobs', { savedJob: existing });
    }

    const savedJob = await SavedJob.create({
      user: req.user._id,
      job: jobId
    });

    return successResponse(res, 201, 'Job saved successfully', { savedJob });
  } catch (error) {
    next(error);
  }
};


const removeSavedJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const result = await SavedJob.findOneAndDelete({ user: req.user._id, job: jobId });
    if (!result) {
      return errorResponse(res, 404, 'Job not found in your saved list');
    }

    return successResponse(res, 200, 'Job removed from saved list');
  } catch (error) {
    next(error);
  }
};


const getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id })
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'name logo location industry'
        }
      })
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Saved jobs retrieved successfully', { savedJobs });
  } catch (error) {
    next(error);
  }
};


const checkIsSaved = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const exists = await SavedJob.exists({ user: req.user._id, job: jobId });
    return successResponse(res, 200, 'Saved status checked', { isSaved: !!exists });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveJob,
  removeSavedJob,
  getSavedJobs,
  checkIsSaved
};
