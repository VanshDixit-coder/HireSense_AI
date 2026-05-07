const Resume = require('../models/Resume');
const User = require('../models/User');
const { parseResume } = require('../services/resumeParserService');

async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error('Resume file is required');
      error.statusCode = 400;
      throw error;
    }

    const parsedData = await parseResume(req.file);
    const resume = await Resume.create({
      userId: req.user._id,
      originalFileName: req.file.originalname,
      parsedData
    });

    const mergedSkills = [...new Set([...(req.user.skills || []), ...(parsedData.skills || [])])];
    await User.findByIdAndUpdate(req.user._id, { skills: mergedSkills });

    res.status(201).json({ success: true, data: { resume } });
  } catch (err) {
    next(err);
  }
}

async function getLatestResume(req, res, next) {
  try {
    const resume = await Resume.findOne({ userId: req.user._id }).sort({ uploadedAt: -1 });
    res.json({ success: true, data: { resume } });
  } catch (err) {
    next(err);
  }
}

async function deleteResume(req, res, next) {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      const error = new Error('Resume not found');
      error.statusCode = 404;
      throw error;
    }
    res.json({ success: true, data: { deletedId: req.params.id } });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadResume, getLatestResume, deleteResume };
