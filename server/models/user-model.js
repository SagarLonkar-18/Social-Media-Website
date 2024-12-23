const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        trim:true,          // ignores extra spaces 
    },
    email:{
        type:String,
        required:true,
        trim:true,   
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false       // select means when we send user information through API username, email all will be send but not password
    },
    bio:{
        type:String,
    },
    profilePic:{
        type:String,       // string because we are using cloudinary , cloudinary submits us a url , so string
        default:"https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png"
    },
    public_id:{
        // it comes from cloudinary as a response, we will save this because we can reach that image again and when we want to delete or update then this id will help us 
        type:String,
    },
    // mongoose.Schema.Types.ObjectId contains an ID that mongoDB generates automatically
    followers:[{type: mongoose.Schema.Types.ObjectId,ref:'user'}],
    threads:[{type: mongoose.Schema.Types.ObjectId,ref:'post'}],
    replies:[{type: mongoose.Schema.Types.ObjectId,ref:'comment'}],
    reposts:[{type: mongoose.Schema.Types.ObjectId,ref:'post'}]

},{timestamps:true});   

module.exports = mongoose.model('user',userSchema);