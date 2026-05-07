const express = require('express');
const { listJobs, getJob, toggleSaveJob, getSavedJobs, seed } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listJobs);
router.post('/seed', seed);
router.get('/saved', protect, getSavedJobs);
router.post('/save/:id', protect, toggleSaveJob);
router.get('/:id', getJob);

module.exports = router;
