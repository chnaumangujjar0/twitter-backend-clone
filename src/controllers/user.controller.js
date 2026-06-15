import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import {jwt} from "jsonwebtoken"
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

        
        const user = await User.findById({_id: decodedToken._id}).select("-password -refreshToken")

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
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshtoken(user._id)
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
   console.log("old password",oldPassword)
   console.log("new password",newPassword)
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


export {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword}