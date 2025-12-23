const mongoose = require('mongoose');

const connect = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/food_db');
        console.log('Connected');

        const count = await mongoose.connection.collection('notifications').countDocuments();
        console.log(`Total Notifications: ${count}`);

        const notifs = await mongoose.connection.collection('notifications').find().toArray();
        console.log('Notifications:', JSON.stringify(notifs, null, 2));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

connect();
