const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: Number, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    bloodType: { type: String },
    city: { type: String },
    location: {
        lat: { type: Number, default: 22.0797 },
        lng: { type: Number, default: 82.1391 }
    },
    phone: { type: String }
}, { timestamps: true });

// Auto-increment simple id for backward compatibility
userSchema.pre('save', async function() {
    if (this.isNew && !this.id) {
        const lastUser = await this.constructor.findOne().sort('-id');
        this.id = lastUser && lastUser.id ? lastUser.id + 1 : 1;
    }
});

module.exports = mongoose.model('User', userSchema);
