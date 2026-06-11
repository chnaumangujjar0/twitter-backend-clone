import mongoose,{Schema} from "mongoose";

const tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        mediaFile: [
            {
                type: String,
            }
        ],
        owner: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

export const Tweet = mongoose.model("Tweet", tweetSchema)