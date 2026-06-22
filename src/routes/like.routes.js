import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getLikedTweet, toogleCommentLike, toogleTweetLike } from "../controllers/like.controller.js";

const router = Router();
router.use(verifyJwt)

router.route("/toggle-tweet-like/:tweetId", toogleTweetLike)
router.route("/toggle-comment-like/:commentId", toogleCommentLike)
router.route("/get-liked-tweets", getLikedTweet)