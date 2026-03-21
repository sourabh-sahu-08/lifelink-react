const mongoose = require('mongoose');

const bloodSupplySchema = new mongoose.Schema({
    hospitalName: { type: String, required: true },
    bloodType: { type: String, required: true },
    units: { type: Number, required: true },
    expiryDate: { type: String },
    notes: { type: String },
    city: { type: String },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    status: { type: String, enum: ['Available', 'Reserved', 'Gone'], default: 'Available' },
    claimedBy: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('BloodSupply', bloodSupplySchema);
