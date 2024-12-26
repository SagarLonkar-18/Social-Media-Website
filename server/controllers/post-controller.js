const User = require('../models/user-model');
const Post = require('../models/post-model');
const Comment = require('../models/comment-model');
const cloudinary = require('../config/cloudinary');
const formidable = require('formidable');

exports.addPost = async (req, res) => {
    try{
        const form = formidable({});
        form.parse(req, async(err, fields, files) => {
            if(err){
                return res.status(400).json({msg:"Error in form parse !",err:err});
            }
            const post = new Post();
            if(fields.text){
                post.text = fields.text;
            }
            if(files.media){
                // filepath means the temporary location on our c drive from where it is uploaded
                const uploadedImage = await cloudinary.uploader.upload(files.media.filepath, {folder:"Threads_clone/Posts"})
            }
            if(!uploadedImage){
                return res.status(400).json({msg:"Error while uploading image !"});
            }
            post.media = uploadedImage.secure_url;
            post.public_id = uploadedImage.public_id;
        })
        post.admin = req.user._id;
        const newPost = await post.save();
        await User.findByIdAndUpdate(
            req.user._id,
            { $push : {threads : newPost._id}} ,
            {new:true})

        res.status(201).json({msg:"Post created !",newPost});
    }
    catch(err){
        res.status(500).json({msg:"Error in addPost !",err: err.message});
    }
}