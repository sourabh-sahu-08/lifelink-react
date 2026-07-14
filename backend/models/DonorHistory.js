const mongoose = require('mongoose');

const donorHistorySchema = new mongoose.Schema({
    id: { type: Number, required: false },
    donorId: { type: mongoose.Schema.Types.Mixed, required: true },
    requestId: { type: Number },
    hospital: { type: String },
    date: { type: String },
    amount: { type: String },
    type: { type: String },
    status: { type: String }
}, { timestamps: true });

donorHistorySchema.pre('save', async function() {
    if (this.isNew && !this.id) {
        const lastHistory = await this.constructor.findOne().sort('-id');
        this.id = lastHistory && lastHistory.id ? lastHistory.id + 1 : 1;
    }
});

module.exports = mongoose.model('DonorHistory', donorHistorySchema);
