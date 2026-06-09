import mongoose from "mongoose";
import {DB_NAME} from "../constant.js";


const connectDB = async ()=>{
    try {
       const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`MongoDB connected!! DB host : ${connectionInstance.connection.host}`) // just for knowing where we connected
    } catch (error) {
        console.log("Mongo DB Error : ",error)
        process.exit(1);
    }
    
}

export default connectDB;