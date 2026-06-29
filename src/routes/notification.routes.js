import { Router } from "express"
import {
    getNotifications,
    markAllAsRead,
    markOneAsRead,
    getUnreadCount,
    deleteNotification,
} from "../controllers/notification.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJwt) 

router.get("/",              getNotifications)
router.get("/unread-count",  getUnreadCount)
router.patch("/read-all",    markAllAsRead)
router.patch("/:notificationId/read", markOneAsRead)
router.delete("/:notificationId",     deleteNotification)

export default router