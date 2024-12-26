const User = require('../models/user-model');
const bcrypt = require('bcrypt');  // used for password hashing
const jwt = require('jsonwebtoken');
const formidable = require('formidable');  // used for multimedia data , helpts for combiningly working
const cloudinary = require('../config/cloudinary'); 
const { trusted } = require('mongoose');

exports.signin = async (req,res) => {
    try {
        // req.body means the data which is sent by user (when clicked on submit)
        const {userName,email,password } = req.body;

        // if any of these are not there then we will through a error 
        if (!userName || !email || !password) {
            return res.status(400).json({msg:"Username , email and password are required !"});
        }

        // if userexist then we will tell them to login
        const userExists =  await User.findOne({email});
        if(userExists){
            return res.status(400).json({msg:"User is already registered ! Please Login!"});
        }

        // if user doesn't exists then we need to create a new user
        // first we need to hash the users password  bcrypt.hash(name, saltRounds)
        const hashedPassword = await bcrypt.hash(password, 10);
        if(!hashedPassword){
            res.status(400).json({msg:"Error in password hashing !"});
        }
        // create a new user
        const user = new User({
            userName,
            email,
            password: hashedPassword
        });
        const result = await user.save();
        if(!result){
            return res.status(400).json({msg:"Error while saving user !"});
        }

        // create a accesstoken for the user to access our website
        // sign means create a new token , tokem:result._id means the id of user which db creates and it is encrypted in token, 2nd parameter is the secretKey which is only one for all application , 3rd parameter is expiresIn like below 30d means user dont need to signin again for 30 days  
        const accessToken = jwt.sign({token:result._id},process.env.JWT_SECRET, {expiresIn:'30d'} )
        if(!accessToken){
            return res.status(400).json({msg:"Error while generating access token !"});
        }

        // if token is generated then store the token in cookies , http only cookies or we can server side cookies which we cannot edit with the browser and are very secure
        // 1st parameter is name which can be anything which is used to access , 2nd parameter is value , 3rd parameter is options 
        // maxAge is time in milliseconds for the cookie to be valid, httpOnly means only the server can access this cookie, sameSite means whether the cookie is only accessible from same site or cross site, secure means the cookie should only be sent over https
        // secure: true means the cookie should only be sent over http
        res.cookie('token',accessToken,{
            maxAge: 1000 * 60 * 60 * 24 * 30,    
            httpOnly: true,
            sameSite: 'none',
            secure:true
        })

        // 201 status code means resource is created successfully 
        res.status(201).json({msg:`User signed in successfully ! Hello ${result?.userName}`}); 

    } 
    catch(err) {
        res.status(400).json({msg:"Error in signin !",err:err.message})
    }   
}

exports.login = async (req,res) => {
    try{
        // we only need email and password for login
        const {email, password} = req.body;
        // if any of them are not there then we will throw the error
        if(!email || !password){
            return res.status(400).json({msg:"Email and password are required!"});
        }

        // check if user exists
        const userExists = await User.findOne({email: email});
        if(!userExists){
            return res.status(400).json({msg:"User does not exist! Please sign up."});
        } 

        // email is there but check if password matches , compare() takes 2 arguments 1st compared with 2nd
        const passwordMatched = await bcrypt.compare(password,userExists.password);
        // if password is not matched
        if(!passwordMatched){
            return res.status(400).json({msg:"Incorrect credentials!"});
        }
        // if password is matched then generate a token
        const accessToken = jwt.sign({token:userExists._id},process.env.JWT_SECRET, {expiresIn:'30d'} )
        if(!accessToken){
            return res.status(400).json({msg:"Token not generated in login !"});
        }
        // if access token is geenrated then store in cookie
        res.cookie('token',accessToken,{
            maxAge: 1000 * 60 * 60 * 24 * 30,    
            httpOnly: true,
            sameSite: 'none',
            secure:true
        })

        // if all above conditions are met then user logged in successfully 200 status code means request is successful and data is returned  as response  with msg:User logged in successfully
        res.status(200).json({msg:"User logged in successfully"});
    }
    catch(err){
        res.status(400).json({msg:"Error in login!",err:err.message})
    }
}

// user details controller for profile section  
exports.userDetails = async (req,res) => {
    try{
        // params means we send info through url
        // first id is required
        const { id } = req.params;
        if(!id){
            return res.status(400).json({msg:" ID is required!"});
        }

        // check if the user exists of that id , select the user without password , populate followers
        // populating threads , threads refer to post model so we can access the post models likes , comment etc
        // similarly populate the replies , who is the admin of reply
        // reposts is similar like post 
        const user = await User.findById(id)
            .select('-password')
            .populate('followers')
            .populate({path:"threads",populate:[{path:"likes"},{path:"comments"},{path:"admin"}]})
            .populate({path:"replies",populate:[{path:"admin"}]})
            .populate({path:"reposts",populate:[{path:"likes"},{path:"comments"},{path:"admin"}]});
        
        res.status(200).json("User Details Fetched !",user);

    }
    catch(err){
        res.status(400).json({msg:"Error in user details!",err:err.message})
    }
}

exports.followUser = async (req,res) => {
    try{
        // this is the id of user which we want to follow
        const { id } = req.params;
        if(!id){
            return res.status(400).json({msg:" ID is required!"});
        }

        // check if user exists
        const userExists = await User.findById(id);
        if(!userExists){
            return res.status(400).json({msg:"User does not exist!"});
        }

        // if user exists
        // req.user means me who is making the request and _id means my id
        // checking if i exist in the followers 
        // if we already exist in the followers then remove it from array with pull 
        if(userExists.followers.includes(req.user._id)){
            await User.findByIdAndUpdate(userExists._id,{
                $pull:{followers:req.user._id}
            },{new:true});
            return res.status(200).json({msg:`Unfollowed ${userExists.userName}!`});
        }

        // if user does not exist in the followers then add it to array with push
        // new:true shows new updated document in json, gives latest updates
        await User.findByIdAndUpdate(userExists._id,{
            $push:{followers:req.user._id}
        },{new:true});
        return res.status(200).json({msg:`Following ${userExists.userName}!`});
    }
    catch(err){
        res.status(400).json({msg:"Error in follow user!",err:err.message})
    }
}

exports.updateProfile = async( req,res) => {
    try{
        // first check if the user exists , we will get the req.user from the auth.js middleware 
        const userExists = await User.findById(req.user._id);
        if(!userExists){
            return res.status(400).json({msg:"User does not exist!"});
        }

        // make an instance of formidable
        // err means error , fields means text field which will be edited, files mostly means images
        const form = formidable({});
        form.parse(req, async(err, fields, files)=>{
            // if there is any error return it
            if(err){
                return res.status(400).json({msg:"Error in formidable!",err:err});
            }
            // if there is any text editing like in bio update it
            // console.log({files,fields});
            if(fields.text){
                await User.findByIdAndUpdate(
                    req.user.id,
                    {bio:fields.text},
                    {new:true});
            }
            // if there are any files 
            if(files.media){
                // if user already has a image/profile pic we will first delete it 
                if(userExists.public_id){
                    await cloudinary.uploader.destroy(userExists.public_id, 
                        (error, result) => {
                            console.log({error, result});
                        }
                    )
                }
                // upload the new image to cloudinary , folder parameter means all files will be stored properly here in folder
                // when a image will be uploaded cloudinary will create a new folder Threads_clone and upload in Profiles folder
                const uploadedImage = await cloudinary.uploader.upload(files.media.filepath,{folder:'Threads_clone/Profiles'})
                if(!uploadedImage){
                    return res.status(400).json({msg:"Error while uploading pic !"});
                }
                // console.log(uploadedImage)
                // after the image is uploaded save it
                await User.findByIdAndUpdate(
                    req.user._id,
                    {
                        profilePic:uploadedImage.secure_url,
                        public_id:uploadedImage.public_id
                    },
                    {new:true}
                )
                res.status(201).json({msg:"Profile updated successfully !"})
            }
        })
    }
    catch(err){
        res.status(400).json({msg:"Error in update profile!",err:err.message})
    }
}

exports.searchUser = async(req,res) => {
    try{
        const {query} = req.params;
        // checks does the regex matches query and options makes it case insensitive 
        const users = await User.find({
            $or:[
                {userName: {$regex:query, $options:'i'}},
                {email: {$regex:query, $options:'i'}}
            ]
        })
        res.status(201).json({msg:"Searched !",users})
    }
    catch(err){
        res.status(400).json({msg:"Error in search user!",err:err.message})
    }
}

exports.logout = async (req,res) => {
    // when user logs out hes cookies are replaced with this cookie
    try{
        res.cookie('token','',{
            maxAge: Date.now(),
            httpOnly: true,
            sameSite: 'none',
            secure:true
        })
        res.status(201).json({msg:"You logged out !"});
    }
    catch(err){
        res.status(400).json({msg:"Error in logout!",err:err.message})
    }
}

// we will get our own info when we go on this route
exports.myInfo = async (req,res) => {
    try{
        res.status(200).json({me:req.user});
    }
    catch(err){
        res.status(400).json({msg:"Error in myInfo!",err:err.message});
    }
}