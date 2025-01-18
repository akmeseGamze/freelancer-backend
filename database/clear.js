const Freelancer = require('../models/Freelancer');
const connectDB = require('../db');
const Employee = require('../models/Employee');
const Task = require('../models/Task');

// Connect to MongoDB
connectDB();

console.log("Clearing database...");

Freelancer.collection.drop().then((response) => {
    console.log("Freelancer Cleared.");
});

Employee.collection.drop().then((response) => {
    console.log("Employee Cleared.");
});

Task.collection.drop().then((response) => {
    console.log("Task Cleared.");
});