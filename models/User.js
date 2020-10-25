const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    "name" : {
        type : String,
        required : true,
        max : 255
    },
    "email" : {
        type : String,
        required : true,
        max : 255
    },
    "password" : {
        type : String,
        required : true,
        max : 1024
    }
})


module.exports = mongoose.model('User', userSchema);