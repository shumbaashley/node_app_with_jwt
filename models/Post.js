const mongoose = require('mongoose');


const PostSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    author : {
        type : String,
    },
    avatar : {
        type: String
    },
    title : {
        type : String, 
    },
    text : {
        type : String,
        required : true,
    },
    likes : [
        {
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            },
        }
    ],
    comments : [
        {
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            },
            text : {
                type : String,
                required : true,
            },
            name : {
                type : String
            },
            avatar : {
                type : String
            },
            date : {
                type : Date,
                default : Date.now
            }
        }
    ],
    date : {
        type : Date,
        default : Date.now
    }

})

module.exports = mongoose.model('Post', PostSchema)