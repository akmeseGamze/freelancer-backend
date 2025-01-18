const TaskState = require("../constants/TaskState");
const Task = require("../models/Task");

const profile = async (req, res, next) => {
    const freelancer = req.freelancer;

    return res.json({ freelancer: freelancer });
};

const dashboard = async (req, res, next) => {
    const freelancer = req.freelancer;
    
    const tasks = await Task.find({freelancer_id: freelancer._id, state: {$ne : TaskState.done}}).sort({'created_at': -1}).limit(10);

    return res.json({ tasks: tasks });
};

// Register a new freelancer
const update = async (req, res, next) => {
    const freelancer = req.freelancer;
    const { first_name, last_name, email, phone_number, about, role } = req.body;
  
    if (!email) {
      res.json({ message: 'email_error' });
      return;
    }
  
    if (!role) {
      res.json({ message: 'role_error' });
      return;
    }
  
    if (!phone_number) {
      res.json({ message: 'phone_number_error' });
      return;
    }
  
    if (about && about.length > 3072) {
      res.json({ error: 'about_error' });
      return;
    }
  
    if (!first_name) {
      res.json({ error: 'first_name_error' });
      return;
    }
  
    if (!last_name) {
      res.json({ error: 'last_name_error' });
      return;
    }
  
    try {
      freelancer.role = role;
      freelancer.first_name = first_name;
      freelancer.last_name = last_name;
      freelancer.email = email;
      freelancer.phone_number = phone_number;
      freelancer.about = about;
      await freelancer.save();
      res.json({freelancer: freelancer});
    } catch (error) {
      next(error);
    }
  };

module.exports = { profile, dashboard, update};