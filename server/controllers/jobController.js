const Job = require('../models/Job');
const User = require('../models/User');
const seedJobs = require('../utils/seedJobs');

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : String(value).split(',');
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function listJobs(req, res, next) {
  try {
    const {
      role = '',
      location = '',
      type = '',
      experience = '',
      skills = '',
      page = 1,
      limit = 10
    } = req.query;

    const query = { isActive: true };
    if (role.trim()) query.$text = { $search: role.trim() };
    if (location.trim()) query.location = { $regex: location.trim(), $options: 'i' };
    if (type) query.type = { $in: toArray(type).map((item) => item.trim()).filter(Boolean) };
    if (experience) query.experienceLevel = experience;
    const skillList = toArray(skills).map((item) => item.trim()).filter(Boolean);
    if (skillList.length) query.requiredSkills = { $in: skillList.map((skill) => new RegExp(`^${escapeRegex(skill)}$`, 'i')) };

    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const skip = (safePage - 1) * safeLimit;
    const sort = role.trim() ? { score: { $meta: 'textScore' }, postedAt: -1 } : { postedAt: -1 };
    const projection = role.trim() ? { score: { $meta: 'textScore' } } : {};

    const [jobs, total] = await Promise.all([
      Job.find(query, projection).sort(sort).skip(skip).limit(safeLimit),
      Job.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          pages: Math.ceil(total / safeLimit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive) {
      const error = new Error('Job not found');
      error.statusCode = 404;
      throw error;
    }
    res.json({ success: true, data: { job } });
  } catch (err) {
    next(err);
  }
}

async function toggleSaveJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      const error = new Error('Job not found');
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(req.user._id);
    const exists = user.savedJobs.some((id) => id.toString() === job._id.toString());
    user.savedJobs = exists
      ? user.savedJobs.filter((id) => id.toString() !== job._id.toString())
      : [...user.savedJobs, job._id];
    await user.save();

    res.json({ success: true, data: { saved: !exists, savedJobs: user.savedJobs } });
  } catch (err) {
    next(err);
  }
}

async function getSavedJobs(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json({ success: true, data: { jobs: user.savedJobs.filter((job) => job && job.isActive) } });
  } catch (err) {
    next(err);
  }
}

async function seed(req, res, next) {
  try {
    const jobs = await seedJobs();
    res.status(201).json({ success: true, data: { count: jobs.length, jobs } });
  } catch (err) {
    next(err);
  }
}

module.exports = { listJobs, getJob, toggleSaveJob, getSavedJobs, seed };
