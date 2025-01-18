const jwt = require('jsonwebtoken');
const Employee = require('../../models/Employee');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'authentication_error' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const employee = await Employee.findById(decodedToken.employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'authentication_error' });
    }

    req.employee = employee;
    next();
  } catch (error) {
    res.status(401).json({ message: 'authentication_error' });
  }
};

module.exports = { authenticate };