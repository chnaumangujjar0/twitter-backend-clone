import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Tweet } from "../models/tweet.model.js";
import {ApiResponse} from "../utils/apiResponse.js"
import mongoose from "mongoose";

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

export {uploadTweet, getAllTweets}