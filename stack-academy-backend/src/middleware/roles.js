// Check if user is instructor
exports.isInstructor = (req, res, next) => {
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'This resource is only available to instructors'
        });
    }
    next();
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'This resource is only available to administrators'
        });
    }
    next();
};

// Check if user owns the resource
exports.isOwner = (model) => async (req, res, next) => {
    try {
        const resource = await model.findById(req.params.id);
        
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        // Check if user owns the resource or is admin
        if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to modify this resource'
            });
        }

        req.resource = resource;
        next();
    } catch (error) {
        next(error);
    }
};