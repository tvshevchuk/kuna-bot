const mongoose = require('mongoose');

module.exports = mongoose.model('Order', {
    side: {
        type: String,
        required: true
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
    method: {
        type: String,
        required: true
    }
});
