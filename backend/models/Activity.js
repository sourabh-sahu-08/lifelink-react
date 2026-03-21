const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    id: { type: Number, required: false },
    user: { type: String },
    action: { type: String },
    time: { type: String },
    type: { type: String }
}, { timestamps: true });

activitySchema.pre('save', async function() {
    if (this.isNew && !this.id) {
        const lastAct = await this.constructor.findOne().sort('-id');
        this.id = lastAct && lastAct.id ? lastAct.id + 1 : 1;
    }
});

module.exports = mongoose.model('Activity', activitySchema);
