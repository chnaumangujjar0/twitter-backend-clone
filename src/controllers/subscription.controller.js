import { asyncHandler } from "../utils/asyncHandler.js"
import {Subscription} from "../models/subscription.model.js"
import { isValidObjectId } from "mongoose"

const toggleSubscription = asyncHandler(async (req, res) =>{
    const {userId} = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid object id")
    }
    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        following: userId
    })

    if(existingSubscription){
        await Subscription.deleteOne(
            {
            _id: existingSubscription._id
            }
        )

        return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "unsubscribed successfully"
        )
    )
    }
    
    const subscribe = await Subscription.create(
        {
            subscriber:  req.user._id ,
            following: userId
        }
    )
    if(!subcribe){
        throw new ApiError(401, " channel is not subscribed")
    }
    
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                subscribe
            },
            "subscribed successfully"
        )
    )
})