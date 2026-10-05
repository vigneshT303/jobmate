const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jobmate_jwt_secret_key_super_secure_2026_production_ready', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};


const register = async (req, res, next) => {
  try {
    const { name, email, password, role, candidateType, phone, location, skills } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 409, 'An account with this email address already exists.');
    }

    const assignedRole = role === 'admin' && process.env.NODE_ENV === 'development' ? 'admin' : 'user';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      candidateType: candidateType || 'fresher',
      phone: phone || '',
      location: location || '',
      skills: Array.isArray(skills) ? skills : []
    });

    const token = generateToken(user._id);

    return successResponse(
      res,
      201,
      'Account registered successfully',
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          candidateType: user.candidateType,
          phone: user.phone,
          location: user.location,
          skills: user.skills,
          resumeUrl: user.resumeUrl,
          avatar: user.avatar
        }
      }
    );
  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    if (!user.isActive) {
      return errorResponse(res, 403, 'Account is deactivated. Please contact support.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const token = generateToken(user._id);

    return successResponse(
      res,
      200,
      'Login successful',
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          candidateType: user.candidateType,
          phone: user.phone,
          location: user.location,
          preferredLocation: user.preferredLocation,
          skills: user.skills,
          bio: user.bio,
          resumeUrl: user.resumeUrl,
          resumeFileName: user.resumeFileName,
          linkedin: user.linkedin,
          github: user.github,
          avatar: user.avatar,
          experience: user.experience,
          education: user.education,
          projects: user.projects,
          certifications: user.certifications
        }
      }
    );
  } catch (error) {
    next(error);
  }
};


const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, 'Profile retrieved', { user });
  } catch (error) {
    next(error);
  }
};


const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name', 'phone', 'location', 'preferredLocation', 'skills', 'bio',
      'candidateType', 'linkedin', 'github', 'experience', 'education',
      'projects', 'certifications', 'avatar', 'resumeUrl', 'resumeFileName'
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    return successResponse(res, 200, 'Profile updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
