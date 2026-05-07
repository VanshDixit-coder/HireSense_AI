const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  originalFileName: { type: String, required: true },
  parsedData: {
    rawText: { type: String, default: '' },
    skills: [{ type: String, trim: true }],
    education: [{
      degree: { type: String, default: '' },
      institution: { type: String, default: '' },
      year: { type: String, default: '' }
    }],
    experience: [{
      title: { type: String, default: '' },
      company: { type: String, default: '' },
      duration: { type: String, default: '' },
      description: { type: String, default: '' }
    }],
    projects: [{
      name: { type: String, default: '' },
      description: { type: String, default: '' },
      technologies: [{ type: String, trim: true }]
    }]
  },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
