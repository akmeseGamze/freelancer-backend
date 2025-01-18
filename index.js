const express = require('express');
const connectDB = require('./db');
const authFreelancerRoutes = require('./routes/auth/freelancer');
const freelancerRoutes = require('./routes/freelancer');
const authEmployeeRoutes = require('./routes/auth/employee');
const employeeRoutes = require('./routes/employee');
const { cors } = require('./middlewares/cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json());

app.use(cors);
// Auth
// Freelancer
app.use('/api/v1/auth', authFreelancerRoutes);
// Employee
app.use('/api/v1/auth', authEmployeeRoutes);

// Frontend
// Freelancer
app.use('/api/v1/freelancer', freelancerRoutes);
// Employee
app.use('/api/v1/employee', employeeRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});