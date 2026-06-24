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
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        isRetweet: {
        type: Boolean,
        default: false,
        },
        retweetOf: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",   // points to the original tweet
        default: null,
    },
    },
    {
        timestamps: true
    }
)

export const Tweet = mongoose.model("Tweet", tweetSchema)