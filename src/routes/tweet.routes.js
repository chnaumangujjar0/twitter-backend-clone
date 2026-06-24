import { Router } from "express";
import {verifyJwt} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";
import { deleteTweet, getAllTweets, getTweetById, retweet, updateTweet, uploadTweet } from "../controllers/tweet.controller.js";
const router = Router()

router.use(verifyJwt)

router.route("/upload-tweet").post(upload.array("mediaFile", 4),uploadTweet )
router.route("/all").get(getAllTweets)
router.route("/update-tweet/:tweetId").patch(updateTweet)
router.route("/getTweetById/:tweetId").get(getTweetById)
router.route("/delete/:tweetId").delete(deleteTweet)
router.route("/retweet/:tweetId").post(retweet)
export default router