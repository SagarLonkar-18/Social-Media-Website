const User = require('../models/user-model');
const bcrypt = require('bcrypt');  // used for password hashing
const jwt = require('jsonwebtoken');

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