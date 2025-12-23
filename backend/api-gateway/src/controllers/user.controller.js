const User = require('../models/User');
const Notification = require('../models/Notification'); // We need to share this model or define in gateway

exports.toggleFavorite = async (req, res) => {
    try {
        const { restaurantId } = req.body;
        const user = await User.findById(req.user.id);

        const index = user.favorites.indexOf(restaurantId);
        if (index === -1) {
            user.favorites.push(restaurantId);
        } else {
            user.favorites.splice(index, 1);
        }

        await user.save();
        res.json({ success: true, favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        res.json({ success: true, data: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);

        const unreadCount = await Notification.countDocuments({ userId: req.user.id, isRead: false });

        res.json({ success: true, data: notifications, unreadCount });
    } catch (error) {
        // Notification model might not be registered in Gateway if I didn't require it
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.markRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { isRead: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
