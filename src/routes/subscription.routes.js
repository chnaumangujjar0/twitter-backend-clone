import { Router } from "express";
import{verifyJwt} from "../middlewares/auth.middleware.js"
import { getUserFollower, getUserFollowing, toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router()

router.use(verifyJwt)

router.route("/toggle-Subscription/:userId").post(toggleSubscription)
router.route("/followers/:userid").get(getUserFollower)
router.route("/follwing/:userid").get(getUserFollowing)

export default router