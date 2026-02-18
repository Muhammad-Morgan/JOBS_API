const mongoose = require("mongoose");


const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide the company name'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide the desired position'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },//now let's tie our job with the creating user
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, { timestamps: true });// manages createdAt and updatedAt fields

module.exports = mongoose.model('Job', JobSchema);