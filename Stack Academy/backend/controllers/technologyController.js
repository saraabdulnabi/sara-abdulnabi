const Technology = require('../models/Technology');
const Project = require('../models/Projects');
const asyncHandler = require('../middleware/async.middleware');


// =============================
// CREATE TECHNOLOGY
// =============================
const createTechnology = asyncHandler(async (req, res) => {
    const technology = await Technology.create(req.body);

    res.status(201).json({
        success: true,
        data: technology,
        message: 'Technology created successfully'
    });
});


// =============================
// GET ALL TECHNOLOGIES
// =============================
const getAllTechnologies = asyncHandler(async (req, res) => {
    const technologies = await Technology.find()
        .populate('projects', 'title category')
        .sort('name');

    res.json({
        success: true,
        count: technologies.length,
        data: technologies,
        message: 'Technologies retrieved successfully'
    });
});


// =============================
// GET TECHNOLOGY BY ID
// =============================
const getTechnologyById = asyncHandler(async (req, res, next) => {
    const technology = await Technology.findById(req.params.id)
        .populate('projects', 'title category status');

    if (!technology) {
        const error = new Error('Technology not found');
        error.statusCode = 404;
        return next(error);
    }

    res.json({
        success: true,
        data: technology,
        message: 'Technology retrieved successfully'
    });
});


// =============================
// GET TECHNOLOGIES BY CATEGORY
// =============================
const getTechnologiesByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;

    const technologies = await Technology.find({ category })
        .populate('projects', 'title');

    res.json({
        success: true,
        count: technologies.length,
        data: technologies,
        message: `Technologies in category: ${category}`
    });
});


// =============================
// UPDATE TECHNOLOGY
// =============================
const updateTechnology = asyncHandler(async (req, res, next) => {
    const technology = await Technology.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!technology) {
        const error = new Error('Technology not found');
        error.statusCode = 404;
        return next(error);
    }

    res.json({
        success: true,
        data: technology,
        message: 'Technology updated successfully'
    });
});


// =============================
// DELETE TECHNOLOGY
// =============================
const deleteTechnology = asyncHandler(async (req, res, next) => {
    const technology = await Technology.findById(req.params.id);

    if (!technology) {
        const error = new Error('Technology not found');
        error.statusCode = 404;
        return next(error);
    }

    // Prevent deletion if assigned to projects
    if (technology.projects && technology.projects.length > 0) {
        const error = new Error(
            'Cannot delete technology that is assigned to projects'
        );
        error.statusCode = 400;
        return next(error);
    }

    await technology.deleteOne();

    res.json({
        success: true,
        message: 'Technology deleted successfully'
    });
});


// =============================
// ADD TECHNOLOGY TO PROJECT
// =============================
const addTechnologyToProject = asyncHandler(async (req, res, next) => {
    const { projectId, technologyId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        return next(error);
    }

    const technology = await Technology.findById(technologyId);
    if (!technology) {
        const error = new Error('Technology not found');
        error.statusCode = 404;
        return next(error);
    }

    // Check if already added
    if (project.technologies.includes(technologyId)) {
        const error = new Error('Technology already added to this project');
        error.statusCode = 400;
        return next(error);
    }

    // Add to project
    project.technologies.push(technologyId);
    await project.save();

    // Add project to technology
    if (!technology.projects.includes(projectId)) {
        technology.projects.push(projectId);
        await technology.save();
    }

    const updatedProject = await Project.findById(projectId)
        .populate('technologies');

    res.json({
        success: true,
        data: updatedProject,
        message: 'Technology added to project successfully'
    });
});


// =============================
// REMOVE TECHNOLOGY FROM PROJECT
// =============================
const removeTechnologyFromProject = asyncHandler(async (req, res, next) => {
    const { projectId, technologyId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        return next(error);
    }

    const technology = await Technology.findById(technologyId);
    if (!technology) {
        const error = new Error('Technology not found');
        error.statusCode = 404;
        return next(error);
    }

    project.technologies = project.technologies.filter(
        t => t.toString() !== technologyId
    );
    await project.save();

    technology.projects = technology.projects.filter(
        p => p.toString() !== projectId
    );
    await technology.save();

    const updatedProject = await Project.findById(projectId)
        .populate('technologies');

    res.json({
        success: true,
        data: updatedProject,
        message: 'Technology removed from project successfully'
    });
});


// =============================
// GET PROJECT TECHNOLOGIES
// =============================
const getProjectTechnologies = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
        .populate('technologies');

    if (!project) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        return next(error);
    }

    res.json({
        success: true,
        count: project.technologies.length,
        data: project.technologies,
        message: 'Project technologies retrieved successfully'
    });
});


// =============================
// EXPORTS
// =============================
module.exports = {
    createTechnology,
    getAllTechnologies,
    getTechnologyById,
    getTechnologiesByCategory,
    updateTechnology,
    deleteTechnology,
    addTechnologyToProject,
    removeTechnologyFromProject,
    getProjectTechnologies
};
