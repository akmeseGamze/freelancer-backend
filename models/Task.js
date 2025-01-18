const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    counter_started_at: {
      type: Date,
      required: false
    },
    counter_duration: {
      type: Number,
      required: false
    },
    freelancer_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;