const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
    requesterName: { type: String, required: true },
    requesterRole: { type: String, enum: ['donor', 'hospital'], default: 'donor' },
    bloodType: { type: String, required: true },
    units: { type: Number, required: true },
    urgency: { type: String, enum: ['Normal', 'Urgent', 'Critical'], default: 'Normal' },
    reason: { type: String },
    city: { type: String },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    status: { type: String, enum: ['Open', 'Fulfilled', 'Closed'], default: 'Open' },
    respondedBy: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
