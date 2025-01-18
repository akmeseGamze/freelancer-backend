const express = require('express');
const { authenticate } = require('../middlewares/auth/employee');
const { freelancerActivate, freelancerList, freelancerTasks, freelancerGet } = require('../controllers/employee');

const router = express.Router();

router.post('/freelancer', authenticate, freelancerGet);
router.post('/freelancer/list', authenticate, freelancerList);
router.post('/freelancer/activate', authenticate, freelancerActivate);
router.post('/freelancer/task/list', authenticate, freelancerTasks);

module.exports = router;