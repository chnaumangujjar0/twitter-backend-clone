import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGION,
    credentials : true
}));
app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended : true, limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import 
import healthcheckRouter from "./routes/healthcheck.routes.js"

// routes declaration
app.use("/api/v1/healthcheck",healthcheckRouter)
export {app}