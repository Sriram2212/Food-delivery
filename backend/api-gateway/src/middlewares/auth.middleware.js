const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, config.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            // Set user with both _id and id for compatibility
            req.user = {
                ...user.toObject(),
                id: user._id.toString(),
                userId: user._id.toString()
            };

            return next();
        } catch (error) {
            console.error('Not authorized, token failed:', error.message);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};
