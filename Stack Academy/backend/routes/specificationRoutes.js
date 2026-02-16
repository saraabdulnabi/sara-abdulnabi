const express = require('express');
const router = express.Router();
const {
  createSpecification,
  getProjectSpecifications,
  updateSpecification,
  deleteSpecification
} = require('../controllers/specificationController');

router.post('/project/:projectId', createSpecification);
router.get('/project/:projectId', getProjectSpecifications);
router.put('/:id', updateSpecification);
router.delete('/:id', deleteSpecification);

module.exports = router;