const express = require('express');
const {
  matchScore,
  generateResume,
  generateCoverLetter,
  skillGap,
  recommendations,
  applications,
  deleteApplication
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/match-score', protect, matchScore);
router.post('/generate-resume', protect, generateResume);
router.post('/generate-cover-letter', protect, generateCoverLetter);
router.post('/skill-gap', protect, skillGap);
router.get('/recommendations', protect, recommendations);
router.get('/applications', protect, applications);
router.delete('/applications/:id', protect, deleteApplication);

module.exports = router;
