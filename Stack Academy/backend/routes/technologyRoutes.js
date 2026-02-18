const express = require('express');
const router = express.Router();
const {
  createTechnology,
  getAllTechnologies,
  getTechnologyById,
  getTechnologiesByCategory,
  updateTechnology,
  deleteTechnology,
  addTechnologyToProject,
  removeTechnologyFromProject,
  getProjectTechnologies
} = require('../controllers/technologyController');

// ===== TECHNOLOGY CRUD ROUTES =====

// CREATE - POST /api/technologies
router.post('/', createTechnology);

// READ - GET all technologies
router.get('/', getAllTechnologies);

// READ - GET technologies by category
router.get('/category/:category', getTechnologiesByCategory);

// READ - GET single technology by ID
router.get('/:id', getTechnologyById);

// UPDATE - PUT technology by ID
router.put('/:id', updateTechnology);

// DELETE - DELETE technology by ID
router.delete('/:id', deleteTechnology);

// ===== PROJECT-TECHNOLOGY RELATIONSHIP ROUTES =====

// GET all technologies for a project
router.get('/project/:projectId', getProjectTechnologies);

// ADD technology to project
router.post('/project/:projectId/technology/:technologyId', addTechnologyToProject);

// REMOVE technology from project
router.delete('/project/:projectId/technology/:technologyId', removeTechnologyFromProject);

module.exports = router;