import { Router } from "express";
import {  
    changeCurrentPassword,
    getUserProfile,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser, 
    updateCoverImage, 
    updateUserAvatar, 
    updateUserDetails
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register",).post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser)
router.route("/login").post(loginUser)
/// ----------secure routes ------------------
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/refreshToken").post(verifyJwt, refreshAccessToken)
router.route("/change-password").post(verifyJwt, changeCurrentPassword)
router.route("/update-details").patch(verifyJwt, updateUserDetails)
router.route("/update-avatar").patch(upload.single("avatar"),verifyJwt, updateUserAvatar)
router.route("/update-coverImage").patch(upload.single("coverImage"),verifyJwt, updateCoverImage)
router.route("/c/:username").get(verifyJwt, getUserProfile)

export default router