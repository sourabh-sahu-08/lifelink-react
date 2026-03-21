const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    id: { type: Number, required: false },
    name: { type: String, required: true },
    bloodType: { type: String, required: true },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    donations: { type: Number, default: 0 },
    status: { type: String, default: 'Available' },
    lastDonation: { type: String, default: 'Never' },
    city: { type: String }
}, { timestamps: true });

donorSchema.pre('save', async function() {
    if (this.isNew && !this.id) {
        const lastDonor = await this.constructor.findOne().sort('-id');
        this.id = lastDonor && lastDonor.id ? lastDonor.id + 1 : 1;
    }
});

module.exports = mongoose.model('Donor', donorSchema);
