import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema(
    {
        follower: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        following: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {timestamps: true}
)

export const Subscription = mongoose.model("Subscription",subscriptionSchema)