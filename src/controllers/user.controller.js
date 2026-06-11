import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import {User} from "../models/user.model.js"

const registerUser = asyncHandler(async (req, res) => {
    const {email, username, fullName, password, bio, dateOfBirth} = req.body

    if(
        [email, username, fullName, password, dateOfBirth].some((field) => field?.trim() === "")
    )
    {
        throw new ApiError(400, "all fields are required")
    }

    if(!email.includes("@")){
        throw new apiError(400,"Enter valid email")
    }

    const exitedUser = await User.findOne(
        {
            $or: [{username},{email}]
        }
    )
    if(exitedUser){
        throw new ApiError(400, "Username or email already exists ")
    }

    const avatar = req.files?.avatar[0].path
    const coverImage = req.files.coverImage[0].path

    if(!avatar) {
        throw new apiError(400, "avatar file is required")
    }


})