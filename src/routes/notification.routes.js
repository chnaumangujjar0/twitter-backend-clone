import { Router } from "express"
import {
    getNotifications,
    markAllAsRead,
    markOneAsRead,
    getUnreadCount,
    deleteNotification,
} from "../controllers/notification.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT) 

router.get("/",              getNotifications)
router.get("/unread-count",  getUnreadCount)
router.patch("/read-all",    markAllAsRead)
router.patch("/:notificationId/read", markOneAsRead)
router.delete("/:notificationId",     deleteNotification)

export default router