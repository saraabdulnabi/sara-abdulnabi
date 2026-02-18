const mongoose = require('mongoose');
const Project = require('../models/Projects');
const Specification = require('../models/Specification');
const asyncHandler = require('../middleware/async.middleware');

// CREATE a new project
const createProject = asyncHandler(async (req, res) => {
    const project = await Project.create(req.body);

    res.status(201).json({
        success: true,
        data: project,
        message: 'Project created successfully'
    });
});


// GET all projects
const getAllProjects = asyncHandler(async (_req, res) => {
    const projects = await Project.find()
        .populate('specifications')
        .populate('technologies')
        .sort('-createdAt');

    res.json({
        success: true,
        count: projects.length,
        data: projects,
        message: 'Projects retrieved successfully'
    });
});


// GET single project by ID
const getProjectById = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id)
        .populate('specifications')
        .populate('technologies');

    if (!project) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        return next(error);
    }

    res.json({
        success: true,
        data: project,
        message: 'Project retrieved successfully'
    });
});


// UPDATE a project
const updateProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate('specifications')
     .populate('technologies');

    if (!project) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        return next(error);
    }

    res.json({
        success: true,
        data: project,
        message: 'Project updated successfully'
    });
});


// DELETE a project
const deleteProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        return next(error);
    }

    await Specification.deleteMany({ projectId: req.params.id });

    if (project.technologies?.length > 0) {
        await mongoose.model('Technology').updateMany(
            { _id: { $in: project.technologies } },
            { $pull: { projects: project._id } }
        );
    }

    await project.deleteOne();

    res.json({
        success: true,
        message: 'Project and its specifications deleted successfully'
    });
});

// DEBUG - Check single project
const debugSingleProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        return next(error);
    }

    const specifications = await Specification.find({ projectId: req.params.id });

    res.json({
        success: true,
        message: "Project is valid",
        data: {
            projectId: project._id,
            title: project.title,
            specsCount: specifications.length
        }
    });
});


// EXPORT all functions
module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,      // This was missing!
    deleteProject,
    debugSingleProject,
};