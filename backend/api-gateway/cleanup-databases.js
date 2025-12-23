const mongoose = require('mongoose');

const dbsToDelete = [
    'food_db',
    'auth_service_db',
    'delivery_service_db',
    'notification_service_db',
    'restauarant_service_db', // Typo potential in old code?
    'restaurant_service_db',
    'order_service_db',
    'food_delivery_app'
];

async function wipeDatabases() {
    console.log('🗑️ Starting Database Cleanup...');

    // Connect to local instance
    const connection = await mongoose.connect('mongodb://127.0.0.1:27017/test');

    for (const dbName of dbsToDelete) {
        try {
            // Switch to the database
            const db = connection.connection.db.admin().client.db(dbName);
            await db.dropDatabase();
            console.log(`✅ Dropped database: ${dbName}`);
        } catch (error) {
            console.log(`⚠️ Could not drop ${dbName} (maybe it didn't exist)`);
        }
    }

    console.log('✨ All targeted databases wiped clean.');
    process.exit(0);
}

wipeDatabases().catch(err => {
    console.error('❌ Error during cleanup:', err);
    process.exit(1);
});
