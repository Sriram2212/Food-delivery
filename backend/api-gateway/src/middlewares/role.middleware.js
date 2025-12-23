const { errorResponse } = require('../utils/responseFormatter');
const { HTTP_STATUS } = require('../utils/constants');

const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(
                errorResponse('Authentication required.', HTTP_STATUS.UNAUTHORIZED)
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(HTTP_STATUS.FORBIDDEN).json(
                errorResponse('Access denied. Insufficient permissions.', HTTP_STATUS.FORBIDDEN)
            );
        }

        next();
    };
};

module.exports = roleMiddleware;
