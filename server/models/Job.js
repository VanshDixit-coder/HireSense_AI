const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  salaryRange: { type: String, trim: true },
  description: { type: String, required: true },
  requiredSkills: [{ type: String, trim: true }],
  experienceLevel: { type: String, enum: ['Entry', 'Mid', 'Senior'], default: 'Mid' },
  postedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ requiredSkills: 1 });

module.exports = mongoose.model('Job', jobSchema);
