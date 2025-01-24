const TaskState = require('../constants/TaskState');
const connectDB = require('../db');
const Employee = require('../models/Employee');
const Freelancer = require('../models/Freelancer');
const Task = require('../models/Task');

// Connect to MongoDB
connectDB();

console.log("Seeding database...");

async function seed() {
    var password = process.env.DEV_EMPLOYEE_PASSWORD;
    var first_name = process.env.DEV_EMPLOYEE_FIRST_NAME;
    var last_name = process.env.DEV_EMPLOYEE_LAST_NAME;
    var email = process.env.DEV_EMPLOYEE_EMAIL;
    const employee = new Employee({ first_name, last_name, email, password: password, role: "superadmin" });
    await employee.save();
    console.log("Employee created.");
    console.log("Password: " + password);
    console.log("Email: " + email);

    password = process.env.DEV_FREELANCER_PASSWORD;
    first_name = process.env.DEV_FREELANCER_FIRST_NAME;
    last_name = process.env.DEV_FREELANCER_LAST_NAME;
    email = process.env.DEV_FREELANCER_EMAIL;

    const eDate = new Date();
    eDate.setDate(eDate.getDate() - 30);

    const freelancer = await createFreelancer({ first_name, last_name, email: email, password: password, createdAt: eDate, activated_at: eDate, 'phone_number': '+90 000 000 00 00', 'role': 'Developer' });
    console.log("Freelancer created.");
    console.log("Password: " + password);
    console.log("Email: " + email);
    email = 'na_' + process.env.DEV_FREELANCER_EMAIL;
    first_name = 'na_' + process.env.DEV_FREELANCER_FIRST_NAME;
    last_name = 'na_' + process.env.DEV_FREELANCER_LAST_NAME;
    await createFreelancer({ first_name, last_name, email: email, password: password, 'phone_number': '+90 000 000 00 01', 'role': 'Developer' });



    await createTask(freelancer, 'Test Task 1', 'This is a Test Task and it needs to be accomplished 1', TaskState.todo, eDate);
    eDate.setDate(eDate.getDate() + 1);
    await createTask(freelancer, 'Test Task 2', 'This is a Test Task and it needs to be accomplished 2', TaskState.todo, eDate);
    eDate.setDate(eDate.getDate() + 1);
    await createTask(freelancer, 'Test Task 3', 'This is a Test Task and it is in progress 3', TaskState.in_progress, eDate);
    eDate.setDate(eDate.getDate() + 1);
    await createTask(freelancer, 'Test Task 4', 'This is a Test Task and it is in progress 4', TaskState.in_progress, eDate);
    eDate.setDate(eDate.getDate() + 1);
    await createTask(freelancer, 'Test Task 5', 'This is a Test Task and it is done 5', TaskState.done, eDate);
    eDate.setDate(eDate.getDate() + 1);
    await createTask(freelancer, 'Test Task 6', 'This is a Test Task and it is done 6', TaskState.done, eDate);
    eDate.setDate(eDate.getDate() + 1);
    await createTask(freelancer, 'Test Task 1', 'This is a Test Task and it needs to be accomplished 1', TaskState.todo, eDate);
    eDate.setDate(eDate.getDate() + 1);
    await createTask(freelancer, 'Test Task 2', 'This is a Test Task and it needs to be accomplished 2', TaskState.todo, eDate);
    eDate.setDate(eDate.getDate() + 1);
    await createTask(freelancer, 'Test Task 3', 'This is a Test Task and it is in progress 3', TaskState.in_progress, eDate);
    eDate.setDate(eDate.getDate() + 1);
    await createTask(freelancer, 'Test Task 4', 'This is a Test Task and it is in progress 4', TaskState.in_progress, eDate);
    await createTask(freelancer, 'Test Task 5', 'This is a Test Task and it is done 5', TaskState.done, eDate);
    eDate.setDate(eDate.getDate() + 1);
    await createTask(freelancer, 'Test Task 6', 'This is a Test Task and it is done 6', TaskState.done, eDate);

    await createTask(freelancer, 'Test Task 1', 'This is a Test Task and it needs to be accomplished 1', TaskState.todo, eDate);
    await createTask(freelancer, 'Test Task 2', 'This is a Test Task and it needs to be accomplished 2', TaskState.todo, eDate);
    await createTask(freelancer, 'Test Task 3', 'This is a Test Task and it is in progress 3', TaskState.in_progress, eDate);
    eDate.setDate(eDate.getDate() + 1);
    await createTask(freelancer, 'Test Task 4', 'This is a Test Task and it is in progress 4', TaskState.in_progress, eDate);
    eDate.setDate(eDate.getDate() + 1);
    await createTask(freelancer, 'Test Task 5', 'This is a Test Task and it is done 5', TaskState.done, eDate);
    await createTask(freelancer, 'Test Task 6', 'This is a Test Task and it is done 6', TaskState.done, eDate);
};

async function createFreelancer({ first_name, last_name, email, password, activated_at, phone_number, role, about, createdAt }) {
    const freelancer = new Freelancer({ first_name, last_name, email: email, password: password, activated_at: activated_at, phone_number, role, about, createdAt });
    await freelancer.save();

    return freelancer;
}

async function createTask(freelancer, title, description, state, createdAt = undefined) {
    const task = new Task({ freelancer_id: freelancer._id, title, description, state, createdAt });

    await task.save();

    return task;
}

seed();