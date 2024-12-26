// auth middleware runs befores any route like sigin where the tokens and all will be verified and the next functions wiil be executed
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

const auth = async (req,res,next) => {
    try{
        // check if there is any token available before going to further route
        // .token means name which we gave like we can see in sign in conroller
        // console.log(req.cookies);
        const token = req.cookies.token;
        if(!token){
            return res.status(403).json({msg:"No token in auth!"});
        }

        // if token is there then we will check it
        const decodedToken = jwt.verify(token , process.env.JWT_SECRET);
        // console.log(decodedToken);
        if(!decodedToken){
            return res.status(403).json({msg:"Error while decoding token in auth !"});
        }

        // if token is verified
        const user = await User.findById(decodedToken.token)
        .populate('followers')
        // .populate('threads')
        // .populate('replies')
        // .populate('reposts');

        if(!user){
            return res.status(400).json({msg:"User not found in auth!"});
        }

        req.user = user;
        next();
    }
    catch(err){
        res.status(400).json({msg:"Error in auth !",err:err.message});
    }
}

module.exports = auth;