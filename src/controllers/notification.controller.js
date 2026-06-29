import { Notification } from "../models/notification.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

// Get all my notifications
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({
        recipient: req.user._id
    })
    .populate("sender", "username avatar")
    .populate("tweet", "content")
    .sort({ createdAt: -1 })
    .limit(20)

    return res
        .status(200)
        .json(new ApiResponse(200, notifications, "Notifications fetched!"))
})

// Mark all notifications as read
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "All notifications marked as read!"))
})

// Mark one notification as read
const markOneAsRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params

    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: req.user._id },
        { isRead: true },
        { new: true }
    )

    if (!notification) throw new ApiError(404, "Notification not found")

    return res
        .status(200)
        .json(new ApiResponse(200, notification, "Notification marked as read!"))
})

// Get unread count (for badge on bell icon)
const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { count }, "Unread count fetched!"))
})

// Delete a notification
const deleteNotification = asyncHandler(async (req, res) => {
    const { notificationId } = req.params

    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: req.user._id,
    })

    if (!notification) throw new ApiError(404, "Notification not found")

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Notification deleted!"))
})

export {
    getNotifications,
    markAllAsRead,
    markOneAsRead,
    getUnreadCount,
    deleteNotification,
}