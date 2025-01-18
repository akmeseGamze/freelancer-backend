const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const employeeSchema = new mongoose.Schema(
  {
    role: {
        type: String,
        required: true,
      },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

// Hash the password before saving it to the database
employeeSchema.pre('save', async function (next) {
  const employee = this;
  if (!employee.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt();
    employee.password = await bcrypt.hash(employee.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Compare the given password with the hashed password in the database
employeeSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;