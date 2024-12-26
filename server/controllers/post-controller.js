const User = require('../models/user-model');
const Post = require('../models/post-model');
const Comment = require('../models/comment-model');
const cloudinary = require('../config/cloudinary');
const formidable = require('formidable');
const { mongoose } = require('mongoose');

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
                if(!uploadedImage){
                    return res.status(400).json({msg:"Error while uploading image !"});
                }
                post.media = uploadedImage.secure_url;
                post.public_id = uploadedImage.public_id;
            }
            post.admin = req.user._id;
            const newPost = await post.save();
            await User.findByIdAndUpdate(
                req.user._id,
                { $push : {threads : newPost._id}} ,
                {new:true}
            );
            res.status(201).json({msg:"Post created !",newPost});
        });
    }
    catch(err){
        res.status(500).json({msg:"Error in addPost !",err: err.message});
    }
}

exports.allPost = async (req,res) => {
    try{
        // we will take page number from req.query just like we took id e.g : http://localhost:5000/api/post?page=1
        const { page } = req.query;
        // we are assigning page to pageNumber
        let pageNumber = page;
        // if page is not there or it is undefined then we will assign 1 as pageNumber by default
        if(!page || page === undefined){
            pageNumber = 1;
        }
        // .find gives all posts , then we sort them by which are created latest by -1 also 1 means ascending order, 
        // .skip((pageNumber-1)*3) means skip the first posts , if there are 6 posts and i am on pagenumber 1 then skip (1-1)*3 = 0 posts and if pagenumber 2 then skip (2-1)*3 = 3 posts because the limit is 3 
        // comments are nested because we need comments and the admin who has commented , model:'user' means populate from user model
        const posts = await Post.find({})
        .sort({createdAt: -1})
        .skip((pageNumber-1)*3)
        .limit(3)
        .populate({path:'admin',select:'-password'})
        .populate({path:'likes',select:'-password'})
        .populate({
            path:'comments',
            populate:{
                path:'admin',
                model:'user'
            }
        })
        res.status(200).json({msg:"Post Fetched !", posts})
    }  
    catch(err){
        res.status(400).json({msg:"Error in allPost !",err:err.message});
    }     
}

exports.deletePost = async (req,res) => {
    try{
        // Take the post id from params
        const { id } = req.params;
        // if no id then give error
        if(!id){
            return res.status(400).json({msg:"ID is required!"});
        }
        // if id is there then check if the post exists 
        const postExists = await Post.findById(id);
        // if no post exists then give error
        if(!postExists){
            return res.status(400).json({msg:"Post does not exist!"});
        }
        // if postExists then check if the admin who has created the post and admin who want to delete it are same
        // userId means my id , toString becaue the formats we are comparing should be the same, adminId means the owner of post
        const userId = req.user._id.toString();
        const adminId = postExists.admin._id.toString();
        if(userId!= adminId){
            return res.status(400).json({msg:"You are not authorized to delete this post!"});
        }
        // check if there is any media in the post and delete it
        if(postExists.media){
            await cloudinary.uploader.destroy(postExists.public_id,
                (error,result) => {
                    console.log({error, result});
                }
            )
        }
        // also delete the comments on that post
        await Comment.deleteMany({_id:{$in:postExists.comments}});
        // also update the user by pulling 
        await User.updateMany(
            {
                $or:[{threads:id},{reposts:id},{replies:id}],
            },
            {
                $pull:{
                    threads:id,
                    reposts:id,
                    replies:id,
                }
            },
            {new:true}
        );
        // At last delete the post 
        await Post.findByIdAndDelete(id);
        res.status(200).json({msg:"Post deleted successfully !"});

    }
    catch(err){
        res.status(400).json({msg:"Error in deletePost!",err:err.message});
    }
}

exports.likePost = async (req,res) =>  {
    try{
        // Id of the post which we want to like
        const { id } = req.params;
        // if no id then give error
        if(!id){
            return res.status(400).json({msg:"ID is required!"});
        }
        // check if the post exists
        const post = await Post.findById(id);
        // if no post exists then give error
        if(!post){
            return res.status(400).json({msg:"Post does not exist!"});
        }
        // check if the user who is trying to like the post is already liked or not
        // if user already liked then unlike it by removing the user id from likes array
        if(post.likes.includes(req.user._id)){
            await Post.findByIdAndUpdate(id,
                { $pull:{likes:req.user._id}},
                {new:true}
            )
            return res.status(201).json({msg:"Post unliked !"});
        }
        // if user not liked then like it by adding the user id to likes array
        await Post.findByIdAndUpdate(id,
            { $push:{likes:req.user._id}},
            {new:true}
        )
        return res.status(201).json({msg:"Post liked!"});
    }
    catch(err){
        res.status(400).json({msg:"Error in likePost!",err:err.message});
    }
}

exports.repost = async (req,res) => {
    try{
        // id of post which we want to repost 
        const id = req.params.id;
        console.log("req.params:", req.params);
        // if id is not there give error
        if(!id){
            return res.status(400).json({msg:"ID is required!"});
        }
        // check if the post exists
        const post = await Post.findById(id);
        if(!post){
            return res.status(400).json({msg:"Post does not exist!"});
        }
        // check if the user trying to repost the post is already reposted or not
        const newId = new mongoose.Types.ObjectId(id);
        if(req.user.reposts.includes(newId)){
            return res.status(400).json({msg:"You have already reposted this post!"});
        }
        // if not then repost the post
        await User.findByIdAndUpdate(req.user._id,{
            $push: {reposts:post._id}
        },{new:true});
        res.status(201).json({msg:"Reposted !"});
    }
    catch(err){
        res.status(400).json({msg:"Error in repost!",err:err.message});
    }
}

exports.singlePost = async (req,res) => {
    try{
        // id of the post
        const { id } = req.params;
        if(!id){
            return res.status(400).json({msg:"ID is required!"});
        }
        // access the post and populate it
        const post = await Post.findById(id)
        .populate({path:"admin",select:"-password"})
        .populate({path:"likes",select:"-password"})
        .populate({
            path:"comments",
            populate:{
                path:"admin",
            }
        });
        res.status(201).json({msg:"Post Fetched !",post});
    }
    catch(err){
        res.status(400).json({msg:"Error in singlePost!",err:err.message});
    }
}