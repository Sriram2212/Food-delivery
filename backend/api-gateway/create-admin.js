const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/food_db';

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to food_db');

        const adminEmail = 'admin@nammafoodie.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('⚠️ Admin user exists. Removing to ensure clean state...');
            await User.deleteOne({ email: adminEmail });
        }

        const admin = new User({
            name: 'System Admin',
            email: adminEmail,
            password: 'admin123',
            role: 'admin'
        });

        await admin.save();
        console.log('🎉 Admin user created successfully!');
        console.log('📧 Email: admin@nammafoodie.com');
        console.log('🔑 Password: admin123');

    } catch (err) {
        console.error('❌ Error creating admin:', err);
    } finally {
        await mongoose.connection.close();
    }
}

createAdmin();
