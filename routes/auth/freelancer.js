const express = require('express');
const { register, login, autoLogin } = require('../../controllers/auth/freelancer');
const { authenticate } = require('../../middlewares/auth/freelancer');

const router = express.Router();

router.post('/freelancer/register', register);
router.post('/freelancer/login', login);
router.post('/freelancer/auto-login',authenticate, autoLogin);

module.exports = router;