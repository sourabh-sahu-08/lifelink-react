const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const User = require('./models/User');
const BloodRequest = require('./models/BloodRequest');
const BloodSupply = require('./models/BloodSupply');
const Activity = require('./models/Activity');
const Inventory = require('./models/Inventory');

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();
        
        console.log('Clearing old data...');
        await User.deleteMany({});
        await BloodRequest.deleteMany({});
        await BloodSupply.deleteMany({});
        await Activity.deleteMany({});
        await Inventory.deleteMany({});
        
        console.log('Creating Bilaspur Users...');
        
        // Hospitals in Bilaspur
        const hospital1 = await User.create({
            name: 'Apollo Hospital Bilaspur',
            email: 'apollo@life.link',
            password: 'password123',
            role: 'hospital',
            city: 'Bilaspur',
            location: { lat: 22.1158, lng: 82.1643 },
            phone: '07752-243300'
        });

        const hospital2 = await User.create({
            name: 'CIMS Bilaspur',
            email: 'cims@life.link',
            password: 'password123',
            role: 'hospital',
            city: 'Bilaspur',
            location: { lat: 22.0792, lng: 82.1388 },
            phone: '07752-224200'
        });

        const hospital3 = await User.create({
            name: 'SIMS (Balaji) Hospital',
            email: 'sims@life.link',
            password: 'password123',
            role: 'hospital',
            city: 'Bilaspur',
            location: { lat: 22.0912, lng: 82.1524 },
            phone: '07752-421000'
        });

        // Donors in Bilaspur
        const donor1 = await User.create({
            name: 'Sourabh Sahu',
            email: 'sourabh@life.link',
            password: 'password123',
            role: 'donor',
            bloodType: 'O+',
            city: 'Bilaspur',
            location: { lat: 22.0797, lng: 82.1391 },
            phone: '9876543210'
        });

        const donor2 = await User.create({
            name: 'Priya Sharma',
            email: 'priya@life.link',
            password: 'password123',
            role: 'donor',
            bloodType: 'B-',
            city: 'Bilaspur',
            location: { lat: 22.0880, lng: 82.1550 },
            phone: '9876543211'
        });

        console.log('Creating Bilaspur Blood Requests...');
        await BloodRequest.create([
            {
                requesterName: 'Sourabh Sahu',
                requesterRole: 'donor',
                bloodType: 'O+',
                units: 2,
                urgency: 'Critical',
                reason: 'Accident Emergency at Vyas Nagar',
                city: 'Bilaspur',
                location: { lat: 22.0797, lng: 82.1391 }
            },
            {
                requesterName: 'CIMS Bilaspur',
                requesterRole: 'hospital',
                bloodType: 'B-',
                units: 5,
                urgency: 'Urgent',
                reason: 'Surgery Ward requirement',
                city: 'Bilaspur',
                location: { lat: 22.0792, lng: 82.1388 }
            }
        ]);

        console.log('Creating Bilaspur Blood Supplies...');
        await BloodSupply.create([
            {
                hospitalName: 'Apollo Hospital Bilaspur',
                bloodType: 'A+',
                units: 10,
                expiryDate: '2024-05-15',
                notes: 'New batch available',
                city: 'Bilaspur',
                location: { lat: 22.1158, lng: 82.1643 }
            },
            {
                hospitalName: 'SIMS (Balaji) Hospital',
                bloodType: 'O-',
                units: 3,
                expiryDate: '2024-04-20',
                notes: 'Emergency reserve release',
                city: 'Bilaspur',
                location: { lat: 22.0912, lng: 82.1524 }
            }
        ]);

        console.log('Seeding Inventory for Bilaspur...');
        await Inventory.create([
            { type: 'A+', units: 15, total: 20, bgColor: 'bg-red-500', text: 'text-red-500', status: 'Stable' },
            { type: 'O+', units: 8, total: 20, bgColor: 'bg-orange-500', text: 'text-orange-500', status: 'Low' },
            { type: 'B-', units: 4, total: 10, bgColor: 'bg-red-600', text: 'text-red-600', status: 'Critical' }
        ]);

        console.log('Seeding Bilaspur Activities...');
        await Activity.create([
            { user: 'Apollo Hospital', action: 'Added 10 units of A+', time: 'Just now', type: 'system' },
            { user: 'Sourabh Sahu', action: 'Posted O+ Request', time: '5 mins ago', type: 'request' }
        ]);

        console.log('Database seeded with Bilaspur data successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDatabase();
