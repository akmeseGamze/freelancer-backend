const express = require('express');
const { authenticate } = require('../../middlewares/auth/employee');
const { login, autoLogin } = require('../../controllers/auth/employee');

const router = express.Router();

router.post('/employee/login', login);
router.post('/employee/auto-login',authenticate, autoLogin);

module.exports = router;