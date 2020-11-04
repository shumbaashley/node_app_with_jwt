const mongoose = require('mongoose');
const User = require('./User');

const ProfileSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    bio : {
        type :String
    },
    company : {
        type : String
    },
    website : {
        type : String,
    },
    company : {
        type : String,
    },
    skills : {
        type : [String],
        required : true
    },
    location : {
        type : String,
    },
    date : {
        type : Date,
        default :Date.now
    }


})

module.exports = mongoose.model('Profile', ProfileSchema)