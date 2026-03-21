const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    type: { type: String, required: true, unique: true },
    units: { type: Number, default: 0 },
    total: { type: Number, default: 20 },
    status: { type: String },
    percent: { type: Number },
    color: { type: String },
    text: { type: String },
    bgColor: { type: String }
});

module.exports = mongoose.model('Inventory', inventorySchema);
