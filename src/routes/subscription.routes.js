import { Router } from "express";
import{verifyJwt} from "../middlewares/auth.middleware.js"
import { getUserFollower, getUserFollowing, toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router()

router.use(verifyJwt)

router.route("/toggle-Subscription/:userId").post(toggleSubscription)
router.route("/followers/:userId").get(getUserFollower)
router.route("/following/:userId").get(getUserFollowing)

export default router
