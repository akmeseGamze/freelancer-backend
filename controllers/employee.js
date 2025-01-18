const Freelancer = require("../models/Freelancer");

const freelancerList = async (req, res, next) => {
    const freelancers = await Freelancer.find();

    return res.json({ freelancers: freelancers });
};

const freelancerTasks = async (req, res, next) => {
    const { id } = req.body;

    if (! id) {
        return res.json({message: 'freelancer_error'});
    }

    const freelancer = await Freelancer.findById(id);

    if (! freelancer) {
        return res.json({message: 'freelancer_error'});
    }

    const tasks = await freelancer.getTasks();

    return res.json({ tasks: tasks });
};

const freelancerGet = async (req, res, next) => {
    const { id } = req.body;

    if (! id) {
        return res.json({message: 'freelancer_error'});
    }

    const freelancer = await Freelancer.findById(id);

    if (! freelancer) {
        return res.json({message: 'freelancer_error'});
    }

    return res.json({ freelancer: freelancer });
};


const freelancerActivate = async (req, res, next) => {
    const { id } = req.body;

    const freelancer = await Freelancer.findById(id);

    if (!freelancer) {
        return res.json({ message: 'freelancer_error' });
    }

    if (freelancer.activated_at) {
        return res.json({ message: 'already_activated' });
    }

    freelancer.activated_at = Date.now();

    try {
        await freelancer.save();
        res.json({ freelancer: freelancer });
    } catch (error) {
        next(error);
    }
};

module.exports = { freelancerList, freelancerActivate, freelancerTasks, freelancerGet};