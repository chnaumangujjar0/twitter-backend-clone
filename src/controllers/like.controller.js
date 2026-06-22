import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {Tweet} from "../models/tweet.model.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.model.js";

const toogleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"invalid objectid")
    }

    const existingLike = await Tweet.find({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if(existingLike){
        await Tweet.deleteOne(
            {
                _id: existingLike._id,
            }
        )

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "comment unliked succesfully!"
            )
        )
    }

    const like = await Like.create({
        tweet: tweetId,
        likedBy: req.user._id,
    })

    if(!like){
        throw new ApiError(400,"tweet does not liked successfully!")
    }

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

const toogleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"invalid objectid")
    }

    const existingLike = await Tweet.find({
        tweet: commentId,
        likedBy: req.user._id
    })

    if(existingLike){
        await Tweet.deleteOne(
            {
                _id: existingLike._id,
            }
        )

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

    const like = await Like.create({
        tweet: commentId,
        likedBy: req.user._id,
    })

    if(!like){
        throw new ApiError(400,"comment is not liked successfully!")
    }

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