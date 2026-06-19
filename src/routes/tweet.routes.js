import { Router } from "express";
import {verifyJwt} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";
import { getAllTweets, uploadTweet } from "../controllers/tweet.controller.js";
const router = Router()

router.use(verifyJwt)

router.route("/upload-tweet").post(upload.array("mediaFile", 4),uploadTweet )
router.route("/all").get(getAllTweets)
export default router