const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Task = require('./Task');
const TaskState = require('../constants/TaskState');

const freelancerSchema = new mongoose.Schema(
  {
    activated_at: {
      type: Date,
      required: false,
    },
    about: {
      type: String,
      required: false,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    role: {
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
freelancerSchema.pre('save', async function (next) {
  const freelancer = this;
  if (!freelancer.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt();
    freelancer.password = await bcrypt.hash(freelancer.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Compare the given password with the hashed password in the database
freelancerSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

freelancerSchema.methods.getTasks = async function (state = null) {
  if (! state) {
    return Task.find({freelancer_id: this._id});
  }

  if (! TaskState.values().includes(state)) {
    return Task.find({freelancer_id: this._id});
  }

  return Task.find({freelancer_id: this._id, state: state});
};

const Freelancer = mongoose.model('Freelancer', freelancerSchema);

module.exports = Freelancer;