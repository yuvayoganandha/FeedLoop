require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');
const Food = require('../backend/models/Food');
const User = require('../backend/models/User');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const foods = await Food.find({ phone: { $exists: false } }).populate('donor');
        console.log(`Found ${foods.length} foods without phone field`);

        for (const food of foods) {
            if (food.donor && food.donor.phone) {
                food.phone = food.donor.phone;
                await food.save();
                console.log(`Updated food ${food.name} with phone ${food.phone}`);
            } else {
                food.phone = 'Contact Donor'; // Fallback
                await food.save();
                console.log(`Updated food ${food.name} with placeholder`);
            }
        }

        console.log('Migration complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
