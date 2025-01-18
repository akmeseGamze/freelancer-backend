const jwt = require('jsonwebtoken');
const Employee = require('../../models/Employee');

// Login with an existing employee
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: 'employee_credentials_incorrect' });
    }

    const passwordMatch = await employee.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'employee_credentials_incorrect' });
    }

    const token = jwt.sign({ employeeId: employee._id }, process.env.SECRET_KEY, {
      expiresIn: '1 hour'
    });
    res.json({ token: token, employee: employee });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };