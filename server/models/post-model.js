const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    // text in post
    text:{
        type:String,
    },
    media:{ 
        type:String,  // from cloudinary
    },
    public_id:{
        type:String,
    },
    likes:[{type: mongoose.Schema.Types.ObjectId,ref:'user'}],
    comments:[{type: mongoose.Schema.Types.ObjectId,ref:'comment'}],

},{timestamps:true})

module.exports = mongoose.model('post',postSchema);