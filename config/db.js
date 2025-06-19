const mongoose = require("mongoose")
const dotenv = require('dotenv')

dotenv.config()


async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDB