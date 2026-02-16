const mongoose = require('mongoose');
const Project = require('../models/Projects');
const Specification = require('../models/Specification');

const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        return res.status(201).json({
            success: true,
            data: project,
            message: 'Project created successfully'
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const getAllProjects = async (_req, res) => {
    try {
        const projects = await Project.find()
            .populate('specifications')
            .sort('-createdAt');

        return res.json({
            success: true,
            count: projects.length,
            data: projects,
            message: 'Projects retrieved successfully'
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('specifications');

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        return res.json({
            success: true,
            data: project,
            message: 'Project retrieved successfully'
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        return res.json({
            success: true,
            data: project,
            message: 'Project updated successfully'
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        await Specification.deleteMany({ projectId: req.params.id });
        await project.deleteOne();

        return res.json({
            success: true,
            message: 'Project and its specifications deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Debug route controller
const debugSingleProject = async (req, res) => {
    try {
        const { id } = req.params;

        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidId) {
            return res.status(400).json({
                success: false,
                message: "Invalid MongoDB ObjectId format"
            });
        }

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found in DB"
            });
        }

        const specifications = await Specification.find({ projectId: id });

        return res.json({
            success: true,
            message: "Project is valid",
            data: {
                projectId: project._id,
                title: project.title,
                specsCount: specifications.length
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    debugSingleProject,
};