const express = require('express');
const router = express.Router();

const {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    debugSingleProject,
} = require('../controllers/projectController');

// Make sure all these functions exist in your controller
router.get('/debug/:id', debugSingleProject);
router.post('/', createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;