const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String, // Can be specific userId or 'ALL'
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['ORDER_UPDATE', 'PROMO', 'SYSTEM', 'NEW_ARRIVAL'],
        default: 'SYSTEM'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedId: {
        type: String // e.g., OrderID or RestaurantID
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
