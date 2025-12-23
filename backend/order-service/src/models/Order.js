const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        items: [
            {
                menuItemId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },
                name: String,
                price: Number,
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        deliveryAddress: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        contactNumber: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['CREATED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
            default: 'CREATED',
        },
        paymentStatus: {
            type: String,
            enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
            default: 'PENDING',
        },
        deliveryFee: {
            type: Number,
            default: 0,
        },
        estimatedDeliveryTime: {
            type: Date,
        },
        actualDeliveryTime: {
            type: Date,
        },
        notes: {
            type: String,
        },
        statusHistory: [
            {
                status: String,
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
                note: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, status: 1 });
orderSchema.index({ status: 1 });

// Middleware to add status to history
orderSchema.pre('save', function () {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date(),
        });
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
