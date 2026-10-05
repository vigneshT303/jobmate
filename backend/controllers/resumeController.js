const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const User = require('../models/User');
const Job = require('../models/Job');
const { extractTextFromFile, analyzeResume: runGeminiResumeAnalysis, matchResumeWithJob } = require('../services/geminiService');
const { successResponse, errorResponse } = require('../utils/responseHandler');


const uploadResumeFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'Please select a resume file (PDF, DOC, or DOCX).');
    }

    const filePath = req.file.path;
    const fileUrl = `/uploads/resumes/${req.file.filename}`;
    const extractedText = await extractTextFromFile(filePath, req.file.mimetype);

    await User.findByIdAndUpdate(req.user._id, {
      resumeUrl: fileUrl,
      resumeFileName: req.file.originalname
    });

    return successResponse(res, 200, 'Resume uploaded successfully', {
      fileName: req.file.originalname,
      fileUrl,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      textLength: extractedText.length,
      extractedTextPreview: extractedText.slice(0, 300)
    });
  } catch (error) {
    next(error);
  }
};


const analyzeResume = async (req, res, next) => {
  try {
    let resumeText = '';
    let fileName = 'Uploaded Resume';
    let fileUrl = '';
    let fileSize = 0;
    let mimeType = 'text/plain';

    if (req.file) {
      fileName = req.file.originalname;
      fileUrl = `/uploads/resumes/${req.file.filename}`;
      fileSize = req.file.size;
      mimeType = req.file.mimetype;
      resumeText = await extractTextFromFile(req.file.path, req.file.mimetype);

      await User.findByIdAndUpdate(req.user._id, {
        resumeUrl: fileUrl,
        resumeFileName: fileName
      });
    } else if (req.body.resumeText && req.body.resumeText.trim().length > 20) {
      resumeText = req.body.resumeText.trim();
      fileUrl = req.user.resumeUrl || '';
      fileName = req.user.resumeFileName || 'Pasted Resume Text';
    } else if (req.user.resumeUrl) {
      const localRelPath = req.user.resumeUrl.replace(/^\//, '');
      const fullPath = path.join(__dirname, '..', localRelPath);
      if (fs.existsSync(fullPath)) {
        resumeText = await extractTextFromFile(fullPath, 'application/pdf');
        fileName = req.user.resumeFileName || 'Stored Resume';
        fileUrl = req.user.resumeUrl;
      }
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return errorResponse(
        res,
        400,
        'No readable resume content found. Please upload a valid PDF/DOCX or paste resume text.'
      );
    }

    const analysis = await runGeminiResumeAnalysis(resumeText);

    const savedResume = await Resume.create({
      user: req.user._id,
      fileName,
      fileUrl,
      fileSize,
      mimeType,
      extractedText: resumeText.slice(0, 15000),
      analysisResult: analysis
    });

    if (analysis.detectedSkills && analysis.detectedSkills.length > 0 && (!req.user.skills || req.user.skills.length === 0)) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { skills: { $each: analysis.detectedSkills.slice(0, 10) } }
      });
    }

    return successResponse(res, 200, 'Resume analysis completed successfully', {
      analysisId: savedResume._id,
      analysisResult: analysis,
      fileName,
      fileUrl
    });
  } catch (error) {
    next(error);
  }
};


const jobMatchWithAI = async (req, res, next) => {
  try {
    const { jobId, resumeText: rawText } = req.body;

    if (!jobId) {
      return errorResponse(res, 400, 'Job ID is required for matching.');
    }

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    let textToAnalyze = rawText;

    if (!textToAnalyze || textToAnalyze.trim().length < 20) {
      const latestResume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
      if (latestResume && latestResume.extractedText) {
        textToAnalyze = latestResume.extractedText;
      } else if (req.user.resumeUrl) {
        const localRelPath = req.user.resumeUrl.replace(/^\//, '');
        const fullPath = path.join(__dirname, '..', localRelPath);
        if (fs.existsSync(fullPath)) {
          textToAnalyze = await extractTextFromFile(fullPath, 'application/pdf');
        }
      }
    }

    if (!textToAnalyze || textToAnalyze.trim().length < 20) {
      const user = req.user;
      textToAnalyze = `
Candidate Name: ${user.name}
Candidate Type: ${user.candidateType}
Skills: ${(user.skills || []).join(', ')}
Location: ${user.location || ''}
Bio: ${user.bio || ''}
Education: ${(user.education || []).map((e) => `${e.degree} at ${e.institution}`).join('; ')}
Experience: ${(user.experience || []).map((e) => `${e.title} at ${e.company}`).join('; ')}
`;
    }

    const matchResult = await matchResumeWithJob(textToAnalyze, job);

    return successResponse(res, 200, 'AI Job Match analysis generated successfully', {
      job: {
        id: job._id,
        title: job.title,
        companyName: job.company?.name || 'Company',
        requiredSkills: job.requiredSkills
      },
      matchResult
    });
  } catch (error) {
    next(error);
  }
};


const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    return successResponse(res, 200, 'Resumes retrieved successfully', { resumes });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResumeFile,
  analyzeResume,
  jobMatchWithAI,
  getMyResumes
};
