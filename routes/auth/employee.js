const express = require('express');
const { login } = require('../../controllers/auth/employee');

const router = express.Router();

router.post('/employee/login', login);

module.exports = router;