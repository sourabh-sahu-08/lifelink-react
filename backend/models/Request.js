const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    id: { type: Number, required: false },
    hospital: { type: String, required: true },
    hospitalId: { type: Number },
    bloodType: { type: String, required: true },
    units: { type: Number, required: true },
    urgency: { type: String },
    reason: { type: String },
    time: { type: String },
    collected: { type: Number, default: 0 },
    distance: { type: String }
}, { timestamps: true });

requestSchema.pre('save', async function() {
    if (this.isNew && !this.id) {
        const lastRequest = await this.constructor.findOne().sort('-id');
        this.id = lastRequest && lastRequest.id ? lastRequest.id + 1 : 1;
    }
});

module.exports = mongoose.model('Request', requestSchema);
