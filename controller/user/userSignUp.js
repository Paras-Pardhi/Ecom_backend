const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()


async function userSignUpController(req,res){
    try{
        const { email, password, name} = req.body

        const user = await userModel.findOne({email})

        console.log("user",user)

        if(user){
            throw new Error("Already user exits.")
        }

        if(!email){
           throw new Error("Please provide email")
        }
        if(!password){
            throw new Error("Please provide password")
        }
        if(!name){
            throw new Error("Please provide name")
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);

        if(!hashPassword){
            throw new Error("Something is wrong")
        }

        const payload = {
            ...req.body,
            role : "GENERAL",
            password : hashPassword
        }

        const userData = new userModel(payload)
        const saveUser = await userData.save()

        // res.status(201).json({
        //     data : saveUser,
        //     success : true,
        //     error : false,
        //     message : "User created Successfully!"
        // })
        //  ✅ Generate JWT Token
    const tokenPayload = {
      _id: saveUser._id,
      email: saveUser.email,
    };

    const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, {
      expiresIn: 60 * 60 * 8, // 8 hours
    });

    // ✅ Cookie Options
    const tokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use true in production
    };

    // ✅ Set cookie and send response
    res.cookie("token", token, tokenOptions).status(201).json({
      message: "User created and logged in successfully!",
      data: saveUser,
      success: true,
      error: false,
    });


    }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}

module.exports = userSignUpController