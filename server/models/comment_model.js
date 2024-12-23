const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    // this post is to know on which post the user has commented
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    },
    text:{
        type:String,
    }

},{timestamps:true})

module.exports = mongoose.Model('comment',commentSchema);