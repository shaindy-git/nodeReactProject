const mongoose = require('mongoose')

const adminScehema = new mongoose.Schema({
    
    userName: {
        type: String,
        unique: true,
        required: true
    },
    
    password: {
        type: String,
        required: true,
    },
   
}, {
    timestamps: true
})
module.exports = mongoose.model('Admin', adminScehema)