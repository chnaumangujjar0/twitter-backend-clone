import { Router } from "express";
import {verifyJwt} from "../middlewares/auth.middleware.js"
import { addComment, deleteComment, getTweetComments, updateComment } from "../controllers/comment.controller.js";
const router = Router()

router.use(verifyJwt)

router.route("/upload-comment").post(addComment)
router.route("/update-comment/:commentId").patch(updateComment)
router.route("/delete-comment").post(deleteComment)
router.route("/get-tweet-comments/:tweetId").get(getTweetComments)