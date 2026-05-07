const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  matchScore: { type: Number, min: 0, max: 100, default: 0 },
  matchingSkills: [{ type: String, trim: true }],
  missingSkills: [{ type: String, trim: true }],
  generatedResume: { type: String, default: '' },
  generatedCoverLetter: { type: String, default: '' },
  appliedAt: { type: Date, default: Date.now }
});

applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
