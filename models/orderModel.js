const mongoose = require('mongoose');

module.exports = mongoose.model('Order', {
    orderId: {
        type: String,
        required: true
    },
    side: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    volume: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    market: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    }
});
