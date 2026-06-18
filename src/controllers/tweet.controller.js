import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Tweet } from "../models/tweet.model.js";
import {ApiResponse} from "../utils/apiResponse.js"
const uploadVideo = asyncHandler(async (req, res) => {
    const {content} = req.body

    if(!content){
        throw new ApiError(400, "title is required")
    }

    const mediaFileLocalPath = req.file?.path
    let mediaFile = null
    console.log(mediaFileLocalPath)
    // if(videoFileLocalPath){
    //      videoFile = await uploadOnCloudinary(videoFileLocalPath)
    // }


})

const getAllTweets = asyncHandler(async (req, res) => {
    const tweets = await Tweet.find({owner: req.user.Id})

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