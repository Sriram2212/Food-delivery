const { errorResponse } = require('../utils/responseFormatter');
const { HTTP_STATUS } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json(
        errorResponse(message, statusCode, err.errors || null)
    );
};

module.exports = errorHandler;
