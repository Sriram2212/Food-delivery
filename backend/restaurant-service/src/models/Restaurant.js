const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        cuisine: [{
            type: String,
            enum: ['italian', 'chinese', 'indian', 'mexican', 'american', 'japanese', 'thai', 'other', 'south indian', 'vegetarian', 'non-veg', 'chettinad', 'kerala', 'seafood', 'biryani', 'mughlai', 'karnataka'],
        }],
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalRatings: {
            type: Number,
            default: 0,
        },
        menu: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
        }],
        isActive: {
            type: Boolean,
            default: true,
        },
        openingHours: {
            monday: { open: String, close: String },
            tuesday: { open: String, close: String },
            wednesday: { open: String, close: String },
            thursday: { open: String, close: String },
            friday: { open: String, close: String },
            saturday: { open: String, close: String },
            sunday: { open: String, close: String },
        },
        deliveryTime: {
            type: Number, // in minutes
            default: 30,
        },
        minimumOrder: {
            type: Number,
            default: 0,
        },
        deliveryFee: {
            type: Number,
            default: 0,
        },
        image: {
            type: String,
        },
        ownerId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
restaurantSchema.index({ name: 'text', description: 'text' });
restaurantSchema.index({ 'address.city': 1 });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ rating: -1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
