import { Notification } from "../models/notification.model.js"

const sendNotification = async (io, { recipient, sender, type, tweet = null, message }) => {
    // Don't notify yourself
    if (recipient.toString() === sender.toString()) return

    // Save to database
    const existingNotification = await Notification.findOneAndUpdate(
        {
            recipient,
            sender,
            type,
            tweet,   // same tweet, same sender, same type = duplicate
        },
        {
            message,
            isRead: false,        // mark unread again
            createdAt: new Date() // new the timestamp
        },
        {
            new: true,
            upsert: true,  // create if not exists, update if exists
        }
    )

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