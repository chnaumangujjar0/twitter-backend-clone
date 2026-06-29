import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import sendNotification from "../utils/sendNotification.js"
import { Comment } from "../models/comment.model.js";


const toogleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Tweet unliked successfully!"))
    }

    // Get the tweet to find its owner
    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    const like = await Like.create({
        tweet: tweetId,
        likedBy: req.user._id,
    })

    const io = req.app.get("io")
    await sendNotification(io, {
        recipient: tweet.owner,
        sender: req.user._id,
        type: "like",
        tweet: tweetId,
        message: `${req.user.username} liked your tweet`,
    })


    return res
        .status(200)
        .json(new ApiResponse(200, like, "Tweet liked successfully!"))
})

const toogleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"invalid objectid")
    }

    const existingLike = await Like.find({
        comment: commentId,
        likedBy: req.user._id
    })

    if(existingLike.length){
        await Like.findByIdAndDelete(existingLike[0]._id)

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "unliked succesfully!"
            )
        )
    }
    const comment = await Comment.findById(commentId)
    const like = await Like.create({
        comment: commentId,
        likedBy: req.user._id,
    })

    if(!like){
        throw new ApiError(400,"comment is not liked successfully!")
    }

    const io = req.app.get("io")
    await sendNotification(io, {
        recipient: comment.owner,
        sender: req.user._id,
        type: "like",
        tweet: null,
        message: `${req.user.username} liked your comment`,
    })
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            like,
            "video liked successfully!"
        )
    )
})

const getLikedTweet = asyncHandler(async (req, res) => {
    const likedTweets = await Like.find({
        likedBy: req.user._id
    })

    if(!likedTweets){
        throw new ApiError(400," no liked video found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
        200,
        likedTweets,
        "liked tweets fetched successfully!"
    )
    )
})

export {getLikedTweet, toogleTweetLike, toogleCommentLike}