const express = require('express');
const { authenticate } = require('../middlewares/auth/employee');
const { freelancerActivate, freelancerTasks, freelancerGet, dashboard } = require('../controllers/employee');

const router = express.Router();

router.post('/freelancer', authenticate, freelancerGet);
router.post('/dashboard', authenticate, dashboard);
router.post('/freelancer/activate', authenticate, freelancerActivate);
router.post('/freelancer/task/list', authenticate, freelancerTasks);

module.exports = router;