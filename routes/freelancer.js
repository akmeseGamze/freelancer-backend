const express = require('express');
const { authenticate } = require('../middlewares/auth/freelancer');
const { profile, dashboard, update} = require('../controllers/freelancer');
const { taskGet, taskList, taskCreate, taskUpdate, taskStartCounter, taskStopCounter, taskUpdateState, taskDelete} = require('../controllers/freelancer/task');

const router = express.Router();

router.post('/dashboard', authenticate, dashboard);
router.post('/profile', authenticate, profile);
router.post('/update', authenticate, update);
router.post('/task', authenticate, taskGet);
router.post('/task/list', authenticate, taskList);
router.post('/task/create', authenticate, taskCreate);
router.post('/task/update', authenticate, taskUpdate);
router.post('/task/update/state', authenticate, taskUpdateState);
router.post('/task/delete', authenticate, taskDelete);
router.post('/task/counter/start', authenticate, taskStartCounter);
router.post('/task/counter/stop', authenticate, taskStopCounter);

module.exports = router;