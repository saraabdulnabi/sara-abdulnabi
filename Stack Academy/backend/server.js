require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const projectRoutes = require('./routes/projectRoutes');
const specificationRoutes = require('./routes/specificationRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/specifications', specificationRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Stack Academy API',
    endpoints: {
      projects: '/api/projects',
      projectSpecifications: '/api/specifications/project/:projectId'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});