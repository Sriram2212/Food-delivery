require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./src/models/Restaurant');
const MenuItem = require('./src/models/MenuItem');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant_service_db';

const menuItems = [
    // 1. Madras Cafe (Pure Veg & Tiffins)
    { name: 'Ghee Roast Dosa', description: 'Crispy golden dosa fried in pure ghee, served with chutney and sambar.', price: 120, category: 'tiffin', preparationTime: 15 },
    { name: 'Idli Vada Combo (2+1)', description: '2 fluffy Idlis and 1 crispy Medu Vada.', price: 90, category: 'tiffin', preparationTime: 10 },
    { name: 'Filter Coffee', description: 'Authentic South Indian filter coffee.', price: 40, category: 'beverage', preparationTime: 5 },
    { name: 'Family Dosa Platter', description: 'Assorted mini dosas (Masala, Paneer, Onion, Plain) for the family.', price: 450, category: 'packs', preparationTime: 25 },
    { name: 'Pongal & Vada', description: 'Classic Ven Pongal served with Vada and coconut chutney.', price: 110, category: 'tiffin', preparationTime: 15 },
    { name: 'Payasam', description: 'Sweet vermicelli pudding with cashews and raisins.', price: 80, category: 'dessert', preparationTime: 10 },

    // 2. Spicy Chettinad (Non-Veg Special)
    { name: 'Chettinad Chicken Biryani', description: 'Aromatic seeraga samba rice cooked with Chettinad spices.', price: 280, category: 'main', preparationTime: 25 },
    { name: 'Chicken 65', description: 'Spicy, deep-fried chicken appetizer.', price: 220, category: 'appetizer', preparationTime: 20 },
    { name: 'Couple Feast Combo', description: '2 Chicken Biryanis + Chicken 65 + 2 Cokes. (Save ₹100)', price: 699, category: 'offers', preparationTime: 30 },
    { name: 'Mutton Chukka', description: 'Dry roasted mutton with pepper and curry leaves.', price: 320, category: 'appetizer', preparationTime: 25 },
    { name: 'Parotta & Salna', description: '2 Flaky Parottas served with spicy chicken salna.', price: 150, category: 'main', preparationTime: 15 },
    { name: 'Nannari Sarbath', description: 'Refreshing root-based drink.', price: 60, category: 'beverage', preparationTime: 5 },

    // 3. Kerala Kitchen (Coastal Flavors)
    { name: 'Appam with Stew', description: 'Soft rice hoppers served with vegetable stew.', price: 160, category: 'main', preparationTime: 20 },
    { name: 'Puttu & Kadala Curry', description: 'Steamed rice cake with black chickpea curry.', price: 140, category: 'main', preparationTime: 20 },
    { name: 'Kerala Sadhya (Full Meal)', description: 'Traditional feast with 21 items on banana leaf.', price: 350, category: 'packs', preparationTime: 30 },
    { name: 'Karimeen Pollichathu', description: 'Pearl spot fish marinated and grilled in banana leaf.', price: 450, category: 'main', preparationTime: 35 },
    { name: 'Banana Chips', description: 'Freshly fried nendran banana chips.', price: 80, category: 'appetizer', preparationTime: 0 },
    { name: 'Tender Coconut Water', description: 'Fresh natural tender coconut.', price: 50, category: 'beverage', preparationTime: 0 },

    // 4. Hyderabad Spice House (Biryani & Grill)
    { name: 'Hyderabadi Dum Biryani', description: 'World famous nizami chicken dum biryani.', price: 300, category: 'main', preparationTime: 30 },
    { name: 'Weekend Family Pack (4 pax)', description: 'Family pack Biryani (Chicken/Mutton) + 4 Starters + 4 Desserts.', price: 1499, category: 'offers', preparationTime: 45 },
    { name: 'Apollo Fish', description: 'Spicy stir-fried fish fillet.', price: 290, category: 'appetizer', preparationTime: 20 },
    { name: 'Double Ka Meetha', description: 'Rich bread pudding delight.', price: 120, category: 'dessert', preparationTime: 10 },
    { name: 'Haleem', description: 'Slow-cooked stew of meat, lentils, and wheat (Special).', price: 250, category: 'main', preparationTime: 0 },
    { name: 'Masala Chai', description: 'Spiced hot tea.', price: 30, category: 'beverage', preparationTime: 5 },

    // 5. Udupi Upahar (Pure Veg)
    { name: 'Masala Dosa', description: 'Crispy dosa filled with spiced potato masala.', price: 90, category: 'tiffin', preparationTime: 10 },
    { name: 'Rava Kesari', description: 'Sweet roasted semolina pudding.', price: 70, category: 'dessert', preparationTime: 5 },
    { name: 'South Indian Thali', description: 'Rice, Sambar, Rasam, Poriyal, Kootu, Curd, Pickle, Papad.', price: 200, category: 'main', preparationTime: 15 },
    { name: 'Mangalore Buns', description: 'Sweet, fluffy banana puris.', price: 60, category: 'tiffin', preparationTime: 10 },
    { name: 'Breakfast Combo for 2', description: '2 Idlis, 2 Vadas, 1 Masala Dosa, 2 Coffees. (Best Value)', price: 299, category: 'offers', preparationTime: 20 },
    { name: 'Buttermilk', description: 'Spiced yogurt drink with ginger and curry leaves.', price: 40, category: 'beverage', preparationTime: 2 },
];

const restaurants = [
    {
        name: "Madras Cafe",
        description: 'Authentic Tamil Brahmin style pure vegetarian tiffins and coffee.',
        address: { street: '45 Gandhi Road', city: 'Chennai', state: 'TN', zipCode: '600017', coordinates: { lat: 13.0, lng: 80.2 } },
        phone: '+91 44 2435 1234', email: 'hello@madrascafe.com', cuisine: ['south indian', 'vegetarian'],
        rating: 4.8, totalRatings: 1240, isActive: true, deliveryTime: 25, minimumOrder: 200, deliveryFee: 30,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800', // Dosa
        ownerId: 'owner1',
        openingHours: { monday: { open: '07:00', close: '22:00' }, tuesday: { open: '07:00', close: '22:00' }, wednesday: { open: '07:00', close: '22:00' }, thursday: { open: '07:00', close: '22:00' }, friday: { open: '07:00', close: '22:00' }, saturday: { open: '07:00', close: '22:00' }, sunday: { open: '07:00', close: '22:00' } }
    },
    {
        name: "Spicy Chettinad",
        description: 'Fiery non-vegetarian delicacies from the Chettinad region.',
        address: { street: '12 Karaikudi Lane', city: 'Madurai', state: 'TN', zipCode: '625001', coordinates: { lat: 9.9, lng: 78.1 } },
        phone: '+91 452 234 5678', email: 'spicy@chettinad.com', cuisine: ['chettinad', 'non-veg'],
        rating: 4.6, totalRatings: 850, isActive: true, deliveryTime: 40, minimumOrder: 300, deliveryFee: 40,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', // Biryani
        ownerId: 'owner2',
        openingHours: { monday: { open: '11:00', close: '23:00' }, tuesday: { open: '11:00', close: '23:00' }, wednesday: { open: '11:00', close: '23:00' }, thursday: { open: '11:00', close: '23:00' }, friday: { open: '11:00', close: '23:00' }, saturday: { open: '11:00', close: '23:00' }, sunday: { open: '11:00', close: '23:00' } }
    },
    {
        name: "Kerala Kitchen",
        description: 'God\'s own country on a plate. Coconutty goodness.',
        address: { street: '8 Backwaters Rd', city: 'Kochi', state: 'KL', zipCode: '682001', coordinates: { lat: 9.9, lng: 76.2 } },
        phone: '+91 484 222 3333', email: 'info@keralakitchen.com', cuisine: ['kerala', 'seafood'],
        rating: 4.7, totalRatings: 620, isActive: true, deliveryTime: 45, minimumOrder: 400, deliveryFee: 50,
        image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800', // Kerala food
        ownerId: 'owner3',
        openingHours: { monday: { open: '10:00', close: '22:00' }, tuesday: { open: '10:00', close: '22:00' }, wednesday: { open: '10:00', close: '22:00' }, thursday: { open: '10:00', close: '22:00' }, friday: { open: '10:00', close: '22:00' }, saturday: { open: '10:00', close: '22:00' }, sunday: { open: '10:00', close: '22:00' } }
    },
    {
        name: "Hyderabad Spice House",
        description: 'Legends of Biryani. Authentic Hyderabadi flavors.',
        address: { street: '55 Charminar St', city: 'Hyderabad', state: 'TS', zipCode: '500002', coordinates: { lat: 17.3, lng: 78.4 } },
        phone: '+91 40 5555 1111', email: 'orders@hydspice.com', cuisine: ['biryani', 'mughlai'],
        rating: 4.5, totalRatings: 2100, isActive: true, deliveryTime: 35, minimumOrder: 250, deliveryFee: 35,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800', // Biryani
        ownerId: 'owner4',
        openingHours: { monday: { open: '11:00', close: '01:00' }, tuesday: { open: '11:00', close: '01:00' }, wednesday: { open: '11:00', close: '01:00' }, thursday: { open: '11:00', close: '01:00' }, friday: { open: '11:00', close: '02:00' }, saturday: { open: '11:00', close: '02:00' }, sunday: { open: '11:00', close: '01:00' } }
    },
    {
        name: "Udupi Upahar",
        description: 'Quick, clean, and delicious Karnataka style vegetarian food.',
        address: { street: '99 MG Road', city: 'Bangalore', state: 'KA', zipCode: '560001', coordinates: { lat: 12.9, lng: 77.5 } },
        phone: '+91 80 2555 9999', email: 'contact@udupi.com', cuisine: ['karnataka', 'vegetarian'],
        rating: 4.4, totalRatings: 1560, isActive: true, deliveryTime: 20, minimumOrder: 150, deliveryFee: 25,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', // Thali/Veg
        ownerId: 'owner5',
        openingHours: { monday: { open: '06:30', close: '22:30' }, tuesday: { open: '06:30', close: '22:30' }, wednesday: { open: '06:30', close: '22:30' }, thursday: { open: '06:30', close: '22:30' }, friday: { open: '06:30', close: '22:30' }, saturday: { open: '06:30', close: '22:30' }, sunday: { open: '06:30', close: '22:30' } }
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        await Restaurant.deleteMany({});
        await MenuItem.deleteMany({});
        console.log('🗑️  Cleared existing data');

        const createdMenuItems = await MenuItem.insertMany(menuItems);
        console.log(`✅ Created ${createdMenuItems.length} menu items`);

        const itemsPerRestaurant = 6;
        for (let i = 0; i < restaurants.length; i++) {
            const startIdx = i * itemsPerRestaurant;
            const endIdx = startIdx + itemsPerRestaurant;
            // Check bounds to avoid errors if items count mismatch
            const items = createdMenuItems.slice(startIdx, endIdx);
            if (items.length > 0) {
                restaurants[i].menu = items.map(item => item._id);
            }
        }

        const createdRestaurants = await Restaurant.insertMany(restaurants);
        console.log(`✅ Created ${createdRestaurants.length} restaurants (South Indian Edition)`);

        console.log('\n🎉 Database re-seeded with South Indian Menu & INR Pricing!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
