const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        enum: ['appetizer', 'main', 'dessert', 'beverage', 'other', 'tiffin', 'packs', 'offers'],
    },
    image: {
        type: String,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    preparationTime: {
        type: Number, // in minutes
        default: 15,
    },
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
