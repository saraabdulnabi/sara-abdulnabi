const Specification = require('../models/Specification');
const Project = require('../models/Projects');
const asyncHandler = require('../middleware/async.middleware');

// CREATE a specification for a project
const createSpecification = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        return next(error);
    }

    const specification = await Specification.create({
        ...req.body,
        projectId
    });

    res.status(201).json({
        success: true,
        data: specification,
        message: 'Specification created successfully'
    });
});


// GET all specifications for a project
const getProjectSpecifications = asyncHandler(async (req, res) => {
    const specifications = await Specification.find({
        projectId: req.params.projectId
    }).sort('-priority createdAt');

    res.json({
        success: true,
        count: specifications.length,
        data: specifications,
        message: 'Specifications retrieved successfully'
    });
});

// UPDATE a specification
const updateSpecification = asyncHandler(async (req, res, next) => {
    const specification = await Specification.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!specification) {
        const error = new Error('Specification not found');
        error.statusCode = 404;
        return next(error);
    }

    res.json({
        success: true,
        data: specification,
        message: 'Specification updated successfully'
    });
});


// DELETE a specification
const deleteSpecification = asyncHandler(async (req, res, next) => {
    const specification = await Specification.findByIdAndDelete(req.params.id);

    if (!specification) {
        const error = new Error('Specification not found');
        error.statusCode = 404;
        return next(error);
    }

    res.json({
        success: true,
        message: 'Specification deleted successfully'
    });
});


module.exports = {
  createSpecification,
  getProjectSpecifications,
  updateSpecification,
  deleteSpecification
};