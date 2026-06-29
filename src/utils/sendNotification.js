import { Notification } from "../models/notification.model.js"

const sendNotification = async (io, { recipient, sender, type, tweet = null, message }) => {
    // Don't notify yourself
    if (recipient.toString() === sender.toString()) return

    // Save to database
    const notification = await Notification.create({
        recipient,
        sender,
        type,
        tweet,
        message,
    })

    // Populate sender details before emitting
    const populated = await notification.populate("sender", "username avatar")

    // Send real-time event to recipient
    io.to(recipient.toString()).emit("notification", {
        _id: populated._id,
        type: populated.type,
        message: populated.message,
        sender: populated.sender,
        tweet: populated.tweet,
        isRead: populated.isRead,
        createdAt: populated.createdAt,
    })
}

export default sendNotification