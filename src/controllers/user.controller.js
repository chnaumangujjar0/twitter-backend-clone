import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import  jwt  from "jsonwebtoken"
import mongoose,{isValidObjectId} from "mongoose";
import cloudinary from "cloudinary"
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const existedUser = await User.findById(userId)
    
        const accessToken = await existedUser.generateAccessToken()
        const refreshToken = await existedUser.generateRefreshToken()
        existedUser.refreshToken = refreshToken
        await existedUser.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(400,"Something went Wrong while generating tokens")
    }
}

const deleteOldFileFromCloudinary = async (url) => {
    if(url == ""){
        throw new ApiError(401,"URL is not corect! ")
    }

   // Get filename after last '/'
    let part = url.split('/').pop();

    // Remove file extension
    part = part.substring(0, part.lastIndexOf('.'));

    const result = await cloudinary.uploader.destroy(part);
    if(result.result === "ok"){
        console.log("Image deleted successfully!")
    } else {
        console.log("Image not found!")
    }
}
// --------------- Controllers ----------------------
const registerUser = asyncHandler(async (req, res) => {
    const {email, username, fullName, password, bio, dateOfBirth} = req.body

    if(
        [email, username, fullName, password, dateOfBirth].some((field) => field?.trim() === "")
    )
    {
        throw new ApiError(400, "all fields are required")
    }

    if(!email.includes("@")){
        throw new ApiError(400,"Enter valid email")
    }

    const existedUser = await User.findOne(
        {
            $or: [{username},{email}]
        }
    )
    if(existedUser){
        throw new ApiError(400, "Username or email already exists ")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath) {
        throw new ApiError(400, "avatar file is required")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    let coverImage= "";
    if(coverImageLocalPath){
        coverImage = await uploadOnCloudinary(coverImageLocalPath)
    }

    if(!avatar){
        throw new ApiError(401,"avatar is not uploaded ")
    }

    const user = await User.create({
        username,
        email,
        fullName,
        bio: bio || "",
        dateOfBirth,
        password,
        avatar: avatar?.url,
        coverImage: coverImage?.url || ""
    })

    const createdUser = await User.findById({_id: user._id}).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"Something went wrong")
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser, "User Registered Successfully!")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    const {email, username, password} = req.body

    if(!(email || username )){
        throw new ApiError(400, "email or username is required")
    }
    
    const existedUser = await User.findOne({
        $or: [{email},{username}]
    })

    if(!existedUser){
        throw new ApiError(400,"user does not exist")
    }

    const isPasswordValid = await existedUser.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400, "Invalid password")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(existedUser._id)

    const loggedInUser = await User.findById(existedUser._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res.status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "user logged in successfully!"
        )
    )
})

const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        { returnDocument: "after" }
    )
    
    const options = {
    httpOnly: true,
    secure: true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "User loggedout Successfuly"
        )
    )
})

const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorize access")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        
        const user = await User.findById({_id: decodedToken._id})

        if(!user){
            throw new ApiError(401,"Invalid refresh Token")
        }
        
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"refreh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refrehToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: user,
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Token Generated Sucessfuly"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Access token refresh failed")
    }
})

const changeCurrentPassword = asyncHandler(async (req,res) => {
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both passwords are required")
    }
   const user = await User.findById(req.user._id)
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
   console.log(isPasswordCorrect)
   if(!isPasswordCorrect){
    throw new ApiError(400,"Incorrect password")
   }

   user.password = newPassword;
   await user.save({validateBeforeSave: false})

   return res
   .status(200)
   .json(
    new ApiResponse(
        200,
        {},
        "password changed successfully"
    )
   )
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const {fullName, bio, dateOfBirth, email } = req.body

    if(
        [fullName, dateOfBirth, email].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400," these files required")
    }

    if(!email.includes("@")){
        throw new ApiError(400, "enter valid email")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                email,
                fullName,
                bio: bio || "",
                dateOfBirth
            }
        },
        {returnDocument: "after"}
    ).select("-password -refreshToken")

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Details updated successfully"
        )
    )

})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file.path

    if(!avatarLocalPath){
        throw new ApiError(400, "new avatar file is required")
    }
    const oldVatar = req.user.avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading avatar file to cloudinary")
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            avatar: avatar.url
        },
        {returnDocument: "after"}
    ).select("-password -refreshToken")

    deleteOldFileFromCloudinary(oldVatar) 

    return res
    .json(
        new ApiResponse(
            200,
            user,
            "avatar updated successfully!"
        )
    )
})

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400, "new avatar file is required")
    }
    const oldCoverImage = req.user.avatar
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading coverImage file to cloudinary")
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            coverImage: coverImage.url
        },
        {returnDocument: "after"}
    ).select("-password -refreshToken")

    deleteOldFileFromCloudinary(oldCoverImage) 

    return res
    .json(
        new ApiResponse(
            200,
            user,
            "avatar updated successfully!"
        )
    )
})

const getUserProfile = asyncHandler(async (req, res) => {
   const {username} = req.params;

    if(!username.trim()){
        throw new ApiError(401," This username does not exist")
    }
    const userProfile = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "following",
                as: "followers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "follower",
                as: "followTo"
            }
        },
        {
            $lookup: {
                from: "tweets",
                localField: "_id",
                foreignField: "owner",
                as: "tweets"
            }
        },
        {
            $addFields: {
                followerCount: {
                    $size: "$followers"
                },
                followToCount: {
                    $size: "$followTo"
                },
                totalTweets: {
                    $size: "$tweets"
                },
                isFollowed: {
                    $cond: {
                        if: {
                            $in: [
                                new mongoose.Types.ObjectId(req.user._id),
                                "$followers.follower"
                            ]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
                coverImage: 1,
                followerCount: 1,
                followToCount: 1,
                totalTweets: 1,
                isFollowed: 1
            }
        }
]);

    if(!userProfile?.length){
        throw new ApiError(400,"this user does not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            userProfile,
            "user profile fetched successfully!"
        )
    )
})


export {
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword,
    updateUserDetails,
    updateUserAvatar,
    updateCoverImage,
    getUserProfile
}