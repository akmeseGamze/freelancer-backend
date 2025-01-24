const jwt = require('jsonwebtoken');
const Employee = require('../../models/Employee');

const authenticate = async (req, res, next) => {
  var token = req.headers.authorization?.split(' ')[1];

  if (! token) {
    token = req.body.authentication_token;
  }

  if (!token) {
    return res.json({ message: 'authentication_error' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const employee = await Employee.findById(decodedToken.employeeId);
    if (!employee) {
      return res.json({ message: 'authentication_error' });
    }

    req.employee = employee;
    next();
  } catch (error) {
    res.json({ message: 'authentication_error' });
  }
};

module.exports = { authenticate };