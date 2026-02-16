const Specification = require('../models/Specification');
const Project = require('../models/Projects');

// CREATE a specification for a project
const createSpecification = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Create specification with projectId
    const specification = await Specification.create({
      ...req.body,
      projectId: projectId
    });
    
    res.status(201).json({
      success: true,
      data: specification,
      message: 'Specification created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET all specifications for a project
const getProjectSpecifications = async (req, res) => {
  try {
    const specifications = await Specification.find({ 
      projectId: req.params.projectId 
    }).sort('-priority createdAt');
    
    res.json({
      success: true,
      count: specifications.length,
      data: specifications,
      message: 'Specifications retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE a specification
const updateSpecification = async (req, res) => {
  try {
    const specification = await Specification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!specification) {
      return res.status(404).json({
        success: false,
        message: 'Specification not found'
      });
    }
    
    res.json({
      success: true,
      data: specification,
      message: 'Specification updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE a specification
const deleteSpecification = async (req, res) => {
  try {
    const specification = await Specification.findByIdAndDelete(req.params.id);
    
    if (!specification) {
      return res.status(404).json({
        success: false,
        message: 'Specification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Specification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createSpecification,
  getProjectSpecifications,
  updateSpecification,
  deleteSpecification
};