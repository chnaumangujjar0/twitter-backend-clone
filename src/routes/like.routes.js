import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getLikedTweet, toogleCommentLike, toogleTweetLike } from "../controllers/like.controller.js";

const router = Router();
router.use(verifyJwt)

router.route("/toggle-tweet-like/:tweetId").post(toogleTweetLike)
router.route("/toggle-comment-like/:commentId").post(toogleCommentLike)
router.route("/get-liked-tweets").get(getLikedTweet)

export default router