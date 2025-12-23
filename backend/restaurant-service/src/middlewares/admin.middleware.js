const adminMiddleware = (req, res, next) => {
    // This would typically check if the user is an admin
    // For now, we'll just pass through
    // In production, this would verify JWT token and check role
    next();
};

module.exports = adminMiddleware;
