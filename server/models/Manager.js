const mongoose = require('mongoose')
const Teacher = require('./Teacher')
const managerSceheme = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        uniq: true,
        required: true
    },
    numberID: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: mongoose.Schema.Types.Date,
        format: ("yyyy-MM-dd "),
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        enum:["Jerusalem", "Tel Aviv"],
        required: true,
    },
    // ולמנהל ישלח מייל שיש בקשה חדשה הבקשות ישלחו לרשימה זו!!!
    RequestList: {
        type: [{
            firstName: { type: String },
            lastName: { type: String },
            userName: { type: String },
            numberID: { type: String },
            dateOfBirth: {type: mongoose.Schema.Types.Date, format: ("yyyy-MM-dd ")},
            phone: { type: String },
            email: { type: String },
            password: { type: String },
            area: { type: String },
            gender: { type: String }
        }]
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Manager', managerSceheme)