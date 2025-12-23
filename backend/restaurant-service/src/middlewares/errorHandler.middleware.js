const { HTTP_STATUS } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Validation error',
            errors,
        });
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Invalid ID format',
        });
    }

    // Custom error
    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || null,
    });
};

module.exports = errorHandler;
