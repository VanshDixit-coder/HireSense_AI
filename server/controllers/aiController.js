const Application = require('../models/Application');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const User = require('../models/User');
const geminiService = require('../services/geminiService');
const { quickMatchScore } = require('../services/matchScoreService');

async function getResumeOrFail(userId) {
  const resume = await Resume.findOne({ userId }).sort({ uploadedAt: -1 });
  if (!resume) {
    const error = new Error('Upload a resume before using AI features');
    error.statusCode = 400;
    throw error;
  }
  return resume;
}

async function getJobOrFail(jobId) {
  const job = await Job.findById(jobId);
  if (!job || !job.isActive) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }
  return job;
}

async function upsertApplication(userId, jobId, update) {
  const application = await Application.findOneAndUpdate(
    { userId, jobId },
    { $set: update },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate('jobId');
  await User.findByIdAndUpdate(userId, { $addToSet: { appliedJobs: application._id } });
  return application;
}

async function matchScore(req, res, next) {
  try {
    const { jobId, deep = true } = req.body;
    if (!jobId) {
      const error = new Error('jobId is required');
      error.statusCode = 400;
      throw error;
    }

    const [resume, job] = await Promise.all([getResumeOrFail(req.user._id), getJobOrFail(jobId)]);
    const quick = quickMatchScore(resume.parsedData.skills || req.user.skills, job.requiredSkills);
    let analysis = {
      matchScore: quick.score,
      matchingSkills: quick.matching,
      missingSkills: quick.missing,
      summary: 'Local skill overlap analysis completed.'
    };

    if (deep) {
      const jobDescription = `${job.title} at ${job.company}\n${job.description}\nRequired skills: ${job.requiredSkills.join(', ')}`;
      analysis = await geminiService.computeMatchScore(resume.parsedData, jobDescription);
    }

    const application = await upsertApplication(req.user._id, job._id, {
      matchScore: analysis.matchScore,
      matchingSkills: analysis.matchingSkills,
      missingSkills: analysis.missingSkills
    });

    res.json({ success: true, data: { ...analysis, application } });
  } catch (err) {
    next(err);
  }
}

async function generateResume(req, res, next) {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      const error = new Error('jobId is required');
      error.statusCode = 400;
      throw error;
    }
    const [resume, job] = await Promise.all([getResumeOrFail(req.user._id), getJobOrFail(jobId)]);
    const text = await geminiService.generateOptimizedResume(resume.parsedData, job.description, req.user.name);
    const application = await upsertApplication(req.user._id, job._id, { generatedResume: text });
    res.json({ success: true, data: { generatedResume: text, application } });
  } catch (err) {
    next(err);
  }
}

async function generateCoverLetter(req, res, next) {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      const error = new Error('jobId is required');
      error.statusCode = 400;
      throw error;
    }
    const [resume, job] = await Promise.all([getResumeOrFail(req.user._id), getJobOrFail(jobId)]);
    const text = await geminiService.generateCoverLetter(resume.parsedData, job.title, job.company, req.user.name);
    const application = await upsertApplication(req.user._id, job._id, { generatedCoverLetter: text });
    res.json({ success: true, data: { generatedCoverLetter: text, application } });
  } catch (err) {
    next(err);
  }
}

async function skillGap(req, res, next) {
  try {
    let missingSkills = Array.isArray(req.body.missingSkills) ? req.body.missingSkills : [];
    if (!missingSkills.length && req.body.jobId) {
      const [resume, job] = await Promise.all([getResumeOrFail(req.user._id), getJobOrFail(req.body.jobId)]);
      missingSkills = quickMatchScore(resume.parsedData.skills || req.user.skills, job.requiredSkills).missing;
    }
    if (!missingSkills.length) {
      const error = new Error('missingSkills or jobId is required');
      error.statusCode = 400;
      throw error;
    }
    const resources = await geminiService.getSkillGapAnalysis(missingSkills);
    res.json({ success: true, data: { resources } });
  } catch (err) {
    next(err);
  }
}

async function recommendations(req, res, next) {
  try {
    const resume = await Resume.findOne({ userId: req.user._id }).sort({ uploadedAt: -1 });
    const userSkills = [...new Set([...(req.user.skills || []), ...((resume && resume.parsedData.skills) || [])])];
    const jobs = await Job.find({ isActive: true }).sort({ postedAt: -1 }).limit(200);
    const recommendations = geminiService.getJobRecommendations(userSkills, jobs);
    res.json({ success: true, data: { recommendations } });
  } catch (err) {
    next(err);
  }
}

async function applications(req, res, next) {
  try {
    const items = await Application.find({ userId: req.user._id }).populate('jobId').sort({ appliedAt: -1 }).limit(20);
    res.json({ success: true, data: { applications: items } });
  } catch (err) {
    next(err);
  }
}

module.exports = { matchScore, generateResume, generateCoverLetter, skillGap, recommendations, applications };
