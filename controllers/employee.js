const Freelancer = require("../models/Freelancer");
const Task = require("../models/Task");

const dashboard = async (req, res, next) => {
    const freelancers = await Freelancer.find();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
        const tasksCreatedLast30Days = await Task.find({
            createdAt: {
                $gte: thirtyDaysAgo
            }
        });

        var freelancersSortedByTaskCount = {};

        for (var i = 0; i < tasksCreatedLast30Days.length; i++) {
            var freelancerTaskCount = freelancersSortedByTaskCount[tasksCreatedLast30Days[i].freelancer_id] ?? 0;
            freelancerTaskCount++;
            freelancersSortedByTaskCount[tasksCreatedLast30Days[i].freelancer_id] = freelancerTaskCount;
        }

        const freelancersSortedByTaskCountKeys = Object.keys(freelancersSortedByTaskCount)

        var mostValuableFreelancerData = {};

        for (var i = 0; i < freelancersSortedByTaskCountKeys.length; i++) {
            var freelancerTaskCount = freelancerTaskCount[freelancersSortedByTaskCountKeys[i]];

            if (mostValuableFreelancerData?.id ?? null) {
                if (mostValuableFreelancerData.count < freelancerTaskCount) {
                    mostValuableFreelancerData = { id: freelancersSortedByTaskCountKeys[i], count: freelancerTaskCount };
                }
            } else {
                mostValuableFreelancerData = { id: freelancersSortedByTaskCountKeys[i], count: freelancerTaskCount };
            }
        }

        var mostValuableFreelancer = null;

        if (mostValuableFreelancerData?.id ?? null) {
            mostValuableFreelancer = await Freelancer.findById(mostValuableFreelancerData.id);
        }

        return res.json({ freelancers: freelancers, data: { tasks_created_last_30_days: tasksCreatedLast30Days, most_valuable_freelancer: mostValuableFreelancer } });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'error' });
    }
};

const freelancerTasks = async (req, res, next) => {
    const { id } = req.body;

    if (!id) {
        return res.json({ message: 'freelancer_error' });
    }

    const freelancer = await Freelancer.findById(id);

    if (!freelancer) {
        return res.json({ message: 'freelancer_error' });
    }

    const tasks = await freelancer.getTasks();

    return res.json({ tasks: tasks, freelancer: freelancer });
};

const freelancerGet = async (req, res, next) => {
    const { id } = req.body;

    if (!id) {
        return res.json({ message: 'freelancer_error' });
    }

    const freelancer = await Freelancer.findById(id);

    if (!freelancer) {
        return res.json({ message: 'freelancer_error' });
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

module.exports = { dashboard, freelancerActivate, freelancerTasks, freelancerGet };