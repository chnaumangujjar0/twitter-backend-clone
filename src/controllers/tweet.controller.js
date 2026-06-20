import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Tweet } from "../models/tweet.model.js";
import {ApiResponse} from "../utils/apiResponse.js"
import mongoose, { isValidObjectId } from "mongoose";

const uploadTweet = asyncHandler(async (req, res) => {
    const {content} = req.body

    if(!content){
        throw new ApiError(400, "title is required")
    }
    //console.log(req.files);
    const paths = req.files.map((file) => file.path)
    console.log(paths)

    if(paths.length > 4){
        throw new ApiError(400,"maximum 4 files can be upload")
    }

    const mediaFiles = await Promise.all(
        paths.map(path => uploadOnCloudinary(path))
    );
    if(!mediaFiles){
        throw new ApiError(401, "error un uploading file")
    }
    const url = mediaFiles.map((file) => file.url)
    console.log(mediaFiles)
    const tweet = await Tweet.create({
        content,
        mediaFile: url,
        owner: req.user._id
    })

    const existedTweet = await Tweet.findById({_id: tweet._id})

    if(!existedTweet){
        throw new ApiError(401,"tweet is not uploaded")
    }


    return res.status(200).json(
        new ApiResponse(
            200,
            tweet,
            "hello"
        )
    )
})

const getAllTweets = asyncHandler(async (req, res) => {
    const {userId} = req.query
    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)}
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
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$ownerDetails"
        }
    ])

    if(!tweets){
        throw new ApiError(400, "Tweet not found!")
    }

     return res.status(200)
     .json(
        new ApiResponse(
            200,
            tweets,
            "tweets fetched sucessfully!"
        )
     )
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const {content} = req.body
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid object id")
    }
    const existedTweet = await Tweet.findById(tweetId)

    if(!existedTweet){
        throw new ApiError(400,"tweet does not exist")
    }

    if(req.user._id.toString() !== existedTweet.owner.toString()){
        throw new ApiError(400, "you are un authorize to update this tweet")
    }

    const tweet = await Tweet.findByIdAndUpdate(
        existedTweet._id,
        {
            $set: {content : content}
        },
        {"returnDocument": "after"}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweet,
            "tweet updated successfully!"
        )
    )
})

const getTweetById = asyncHandler(async (req,res) => {
    const {tweetId} = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid oject id")
    }
    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(400, "tweet does not exist!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweet,
            "tweet fetched successfully!"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) =>{
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "invalid object id")
    }
    const existedTweet = await Tweet.findById(tweetId)
    if(!existedTweet){
        throw new ApiError(400, "tweet already deleted")
    }

    if(req.user._id.toString() !== existedTweet.owner ){
        throw new ApiError(400, "you are un un authorize to delete this tweet")
    }

    const deletedTweet = await Tweet.deleteOne({_id: existedTweet._id})

    if(!deleteTweet){
        throw new ApiError(401, "tweeet is not deleted")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "tweet deleted successfully!"
        )
    )
})

export {uploadTweet, getAllTweets, updateTweet, deleteTweet}