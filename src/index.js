import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv"
dotenv.config();
import express from "express";
import connectDB from "./db/index.js";
import { app } from "./app.js";



connectDB()
.then(()=>{
    app.on("error",(err)=>{
        console.log("Error : ",err)
        throw err
    })
    
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Server is listening on port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("Mongo DB error :",error)
})