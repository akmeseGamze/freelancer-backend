const TaskState = require("../../constants/TaskState");
const Task = require("../../models/Task");

const taskList = async (req, res, next) => {
    const {state} = req.body;
    if (state) {
        const tasks = await req.freelancer.getTasks(state);

        return res.json({ tasks: tasks });
    }

    const tasks = await req.freelancer.getTasks();

    return res.json({ tasks: tasks });
};

const taskCreate = async (req, res, next) => {
    const { title, description, state } = req.body;

    if (! req.freelancer.activated_at) {
        return res.json({ message: 'freelancer_not_active' });
    }

    if (!title) {
        return res.json({ message: 'title_error' });
    }

    if (!description) {
        return res.json({ message: 'description_error' });
    }

    var task_state = state;

    if (!task_state) {
        task_state = TaskState.todo;
    }

    if (!TaskState.values().includes(task_state)) {
        return res.json({ message: 'state_error' });
    }

    try {
        const task = new Task({ title, description, freelancer_id: req.freelancer._id, state: task_state });
        await task.save();
        res.json({ task: task });
    } catch (error) {
        next(error);
    }
};
const taskGet = async (req, res, next) => {
    const { id } = req.body;

    const task = await Task.findById(id);

    if (!task) {
        return res.json({ message: 'task_error' });
    }

    if (req.freelancer._id != task.freelancer_id) {
        return res.json({ message: 'task_error' });
    }

    res.json({ task: task });
};

const taskDelete = async (req, res, next) => {
    const { id } = req.body;

    if (! req.freelancer.activated_at) {
        return res.json({ message: 'freelancer_not_active' });
    }

    const response = await Task.deleteOne({_id: id, freelancer_id: req.freelancer._id});

    if (response.deletedCount !== 1) {
        return res.json({ message: 'task_not_deleted' });
    }

    res.json({ message: 'task_deleted' });
};

const taskUpdate = async (req, res, next) => {
    const { title, description, id } = req.body;

    if (! req.freelancer.activated_at) {
        return res.json({ message: 'freelancer_not_active' });
    }

    const task = await Task.findById(id);

    if (!task) {
        return res.json({ message: 'task_error' });
    }

    if (req.freelancer._id != task.freelancer_id) {
        return res.json({ message: 'task_error' });
    }

    if (!title) {
        return res.json({ message: 'title_error' });
    }

    if (!description) {
        return res.json({ message: 'description_error' });
    }

    try {
        task.title = title;
        task.description = description;
        await task.save();
        res.json({ task: task });
    } catch (error) {
        next(error);
    }
};

const taskUpdateState = async (req, res, next) => {
    const {state, id } = req.body;

    if (! req.freelancer.activated_at) {
        return res.json({ message: 'freelancer_not_active' });
    }

    const task = await Task.findById(id);

    if (!task) {
        return res.json({ message: 'task_error' });
    }

    if (req.freelancer._id != task.freelancer_id) {
        return res.json({ message: 'task_error' });
    }

    if (!state) {
        return res.json({ message: 'state_error' });
    }

    if (!TaskState.values().includes(state)) {
        return res.json({ message: 'state_error' });
    }

    if (state == task.state) {
        return res.json({ message: 'state_error' });
    }

    if (state == TaskState.todo) {
        if (task.counter_started_at) {
            task.counter_duration = getTaskCounterDuration(task);
            task.counter_started_at = null;
        }
    } else if (state == TaskState.done) {
        if (task.counter_started_at) {
            task.counter_duration = getTaskCounterDuration(task);
            task.counter_started_at = null;
        }
    }

    try {
        task.state = state;
        await task.save();
        res.json({ task: task });
    } catch (error) {
        next(error);
    }
};

const taskStartCounter = async (req, res, next) => {
    const { id } = req.body;

    if (! req.freelancer.activated_at) {
        return res.json({ message: 'freelancer_not_active' });
    }

    const task = await Task.findById(id);

    if (!task) {
        return res.json({ message: 'task_error' });
    }

    if (req.freelancer._id != task.freelancer_id) {
        return res.json({ message: 'task_error' });
    }

    if (task.counter_started_at) {
        return res.json({ message: 'task_counter_already_started' });
    }

    task.state = TaskState.in_progress;
    task.counter_started_at = Date.now();

    try {
        await task.save();
        res.json({ task: task });
    } catch (error) {
        next(error);
    }
};

const taskStopCounter = async (req, res, next) => {
    const { id } = req.body;

    if (! req.freelancer.activated_at) {
        return res.json({ message: 'freelancer_not_active' });
    }

    const task = await Task.findById(id);

    if (!task) {
        return res.json({ message: 'task_error' });
    }

    if (req.freelancer._id != task.freelancer_id) {
        return res.json({ message: 'task_error' });
    }

    if (!task.counter_started_at) {
        return res.json({ message: 'task_counter_not_started' });
    }

    task.counter_duration = getTaskCounterDuration(task);
    task.counter_started_at = null;

    try {
        await task.save();
        res.json({ task: task });
    } catch (error) {
        next(error);
    }
};

function getTaskCounterDuration(task) {
    var task_counter_duration = task.counter_duration;

    if (! task_counter_duration) {
        task_counter_duration = 0;
    }

    return task_counter_duration + Date.now() - task.counter_started_at.getTime();
}

module.exports = { taskList, taskCreate, taskUpdate, taskUpdateState, taskStartCounter, taskStopCounter, taskGet, taskDelete };