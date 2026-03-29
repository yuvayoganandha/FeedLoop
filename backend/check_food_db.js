require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/Food');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const foods = await Food.find({});
        console.log('Total Foods Found:', foods.length);
        foods.forEach((f, i) => {
            console.log(`\nFood ${i+1}:`);
            console.log(' - Name:', f.name);
            console.log(' - Status:', f.status);
            console.log(' - Expiry:', f.expiryTime);
            console.log(' - Coordinates:', f.location.coordinates); // [lng, lat]
            console.log(' - Address:', f.location.address);
        });
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
check();
