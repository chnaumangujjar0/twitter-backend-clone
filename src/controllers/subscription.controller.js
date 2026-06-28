import { asyncHandler } from "../utils/asyncHandler.js"
import {Subscription} from "../models/subscription.model.js"
import mongoose, { isValidObjectId } from "mongoose"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
const toggleSubscription = asyncHandler(async (req, res) =>{
    const {userId} = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid object id")
    }
    const existingSubscription = await Subscription.findOne({
        follower: req.user._id,
        following: userId
    })

    if(existingSubscription){
        await Subscription.deleteOne(
            {
            _id: existingSubscription._id
            }
        )

        return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "unsubscribed successfully"
        )
    )
    }
    
    const subscribe = await Subscription.create(
        {
            follower:  req.user._id ,
            following: userId
        }
    )
    if(!subscribe){
        throw new ApiError(401, " channel is not subscribed")
    }

    if (subscribe.following.toString() !== req.user._id.toString()) {
        const io = req.app.get("io")
        io.to(subscribe.following.toString()).emit("notification", {
            type: "follow",
            message: `${req.user.username} followed your`,
            userId: req.user._id
        })
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                subscribe
            },
            "subscribed successfully"
        )
    )
})

const getUserFollower = asyncHandler(async (req, res) => {
    const {userId} = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid object id")
    }
    const followers = await Subscription.aggregate([
        {
            $match: {
                following: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "follower",
                foreignField: "_id",
                as: "followerInfo",
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
            $unwind: "$followerInfo" // it convert the array data into object
        },
    ])
    if(!followers){
       throw new ApiError(400, "follower does not fetchedd sucessfully")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            followers,
            !followers.length  ? "user has no follower" : "follwer fetched successfully"
        )
    )

})

const getUserFollowing = asyncHandler(async (req,res) => {
    const {userId} = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid object id")
    }

    const followingList = await Subscription.aggregate([
        {
            $match: {
                follower: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "follower",
                foreignField: "_id",
                as: "followedUserInfo",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$followedUserInfo"
        }
    ])

    if(!followingList){
        throw new ApiError(400, "empty following list ")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(400,followingList,"follwing list fetched successfully!")
    )
})

export {toggleSubscription, getUserFollower, getUserFollowing}