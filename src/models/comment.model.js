import mongoose,{Schema} from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    tweet: {
        type:  Schema.type.ObjectId,
        ref: "Tweet"
    },
    owner: {
        type:  Schema.Types.ObjectId,
        ref: "User"
    }
})

export const Comment = new mongoose.model("Comment", commentSchema)