require('dotenv').config();
const errorHandler = require('./middleware/error.middleware');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const projectRoutes = require('./routes/projectRoutes');
const specificationRoutes = require('./routes/specificationRoutes');
const technologyRoutes = require('./routes/technologyRoutes'); // Add this

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
app.use('/api/technologies', technologyRoutes); // Add this

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Stack Academy API',
    endpoints: {
      projects: '/api/projects',
      specifications: '/api/specifications',
      technologies: '/api/technologies', // Add this
      projectSpecifications: '/api/specifications/project/:projectId',
      projectTechnologies: '/api/technologies/project/:projectId'
    }
  });
});

const PORT = process.env.PORT || 3000; 
// Handle undefined routes
app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.statusCode = 404;
  next(error);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Centralized Error Handler (ALWAYS LAST)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});