import mongoose,{Schema} from "mongoose";

const likeSchema = new Schema({
    tweet: {
        type: new mongoose.Types.ObjectId,
        ref: "Tweet"
    },
    comment: {
        type: new mongoose.Types.ObjectId,
        ref: "Comment"
    },
    likedBy: {
        type: new mongoose.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

export const Like = new mongoose.model("Like", likeSchema)