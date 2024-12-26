const User = require('../models/user-model');
const Post = require('../models/post-model');
const Comment = require('../models/comment-model');
const {mongoose} = require('mongoose');

exports.addComment = async (req,res) => {
    try{
        // take post id
        const { id } = req.params;
        // take comment text
        const { text } = req.body;
        // check if id is there
        if(!id){
            return res.status(400).json({msg:"Id is required !"});
        }
        // check if the text is there
        if(!text){
            return res.status(400).json({msg:"No comment is added !"});
        }
        // check if post exists
        const postExists = await Post.findById(id);
        if(!postExists){
            return res.status(400).json({msg:"Post does not exist!"});
        }
        // create a new comment
        const comment = new Comment({
            text,
            admin:req.user._id,
            post:postExists._id
        });
        // save it
        const newComment = await comment.save();
        // add the comment to the post
        await Post.findByIdAndUpdate(id,{
            $push:{
                comments:newComment._id
            }
        },{new:true});
        // add the comment to the replies of the user who has created the comment
        await User.findByIdAndUpdate(req.user._id,{
            $push:{
                replies:newComment._id
            }
        },{new:true});
        
        res.status(201).json({msg:"Commented !"});

    }   
    catch(err){
        res.status(500).json({msg:"Error in addComment !",err:err.message});
    }
}

exports.deleteComment = async (req,res) => {
    try{
        // postId means the post's id and id means the comment's id
        const { postId, id } = req.params;
        // check if postId and id are there
        if(!postId || !id){
            return res.status(400).json({msg:"Id is required"});
        };
        // check if the post exists
        const postExists = await Post.findById(postId);
        if(!postExists){
            return res.status(400).json({msg:"Post does not exist!"});
        }
        // chehck if the comment exists
        const commentExists = await Comment.findById(id);
        if(!commentExists){
            return res.status(400).json({msg:"Comment does not exist!"});
        };
        // make mongoose id of the comment id
        const newId = new mongoose.Types.ObjectId(id);
        // check if the comment id exists in the comments array of the post
        if(postExists.comments.includes(newId)){
            const id1 = commentExists.admin._id.toString();  // the one who has commented
            const id2 = req.user._id.toString();  // the one who wants to delete the comment
            // check if the comment is created by the user who wants to delete it
            if(id1!=id2){
                return res.status(403).json({msg:"You are not authorized to delete this comment!"});
            }
            await Post.findByIdAndUpdate(postId,{
                $pull:{
                    comments:id
                }
            },{new:true})
            await User.findByIdAndUpdate(req.user._id,{
                $pull:{
                    replies:id
                }
            },{new:true});
            await Comment.findByIdAndDelete(id);
            return res.status(201).json({msg:"Comment deleted !"})
        }
        res.status(201).json({msg:"This post does not include the comment !"})
    }
    catch(err){
        res.status(500).json({msg:"Error in deleteComment!",err:err.message});
    }
}