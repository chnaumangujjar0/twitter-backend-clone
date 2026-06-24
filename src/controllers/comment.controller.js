import mongoose, { isValidObjectId } from "mongoose"
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
const addComment = asyncHandler(async (req,res) => {
    const {tweetId} = req.params
    const {content} = req.body
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "invalid object id")
    }

    if(!content){
        throw new ApiError(400, "content is required")
    }

    const comment = await Comment.create({
        tweet: tweetId,
        content,
        owner: req.user._id
    })

    if(!comment){
        throw new ApiError(401, " comment is not posted")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comment,
            "comment posted successfully!"
        )
    )
})

const deleteComment = asyncHandler( async (req,res) =>{
    const {commentId} = req.params;

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "invalid object id")
    }
    const existingComment = await Comment.findById(commentId)

    if(!existingComment){
        throw new ApiError(400, "comment not found")
    }

    await Comment.deleteOne(
        {
            _id: existingComment._id
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"comment deleted Successfully!")
    )
})

const updateComment = asyncHandler( async (req,res) => {
    const {commentId} = req.params
    const {content} = req.body

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "invalid object id")
    }

    if(!content){
        throw new ApiError(400, "content is required")
    }

    const existingComment = await Comment.findById(commentId)

    if(!existingComment){
        throw new ApiError(400, "comment not found")
    }
    if(existingComment.content == content){
        throw new ApiError(400,"new content is required")
    }

    if(req.user._id.toString() !== existingComment.owner.toString()){
        throw new ApiError(400, "you are un authorize to update this comment")
    }
    const comment = await Comment.findByIdAndUpdate(
        existingComment._id,
        {
            $set: {content : content}
        },
        {"returnDocument": "after"}
    )
    
    if(!comment){
        throw new ApiError(401,"comment is not updated")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comment,
            "comment updated successfully!"
        )
    )
})

const getTweetComments = asyncHandler( async (req,res) =>{
    const {tweetId} = req.params
    const {page =1, limit = 10} = req.query

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "invalid object id")
    }

    const existingTweet = await Tweet.findById(tweetId)

    if(!existingTweet){
        throw new ApiError(400, "tweet not found")
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                tweet: new mongoose.Types.ObjectId(tweetId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$ownerDetails"
        },
        {
            $sort: { createdAt: -1 }
        },
        { $skip: (pageNum - 1) * limitNum },
        { $limit: limitNum }
    ])

    if(!comments){
        throw new ApiError(400, "tweet has no comments")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            comments,
            "tweet's comments fetched successfully!"
        )
    )
})

export {addComment, deleteComment, updateComment, getTweetComments}