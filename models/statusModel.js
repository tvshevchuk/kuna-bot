const mongoose = require('mongoose');

module.exports = mongoose.model('Status', {
    market: {
       type: String,
       required: true
    },
    isRun: {
        type: Boolean,
        required: true
    },
    uahBudget: {
        type: Number,
        required: true
    },
    timeLimit: {
        type: Number,
        required: true
    },
    askStory: {
        type: [Number]
    },
    bidStory: {
        type: [Number]
    },
    updatedAt: {
        type: Date,
        required: true
    } 
});