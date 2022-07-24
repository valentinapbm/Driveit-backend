import { model, Schema, Document } from "mongoose";
import {IUser} from "./user.model";
import {ICar} from "./car.model"

export interface IReview extends Document {
    carId: ICar["_id"];
    userId: IUser["_id"];
    rating:number;
    message:string,
}


const reviewSchema = new Schema(
    {
    carId: {
        type: [{ type: Schema.Types.ObjectId, ref: "Car" }],
        required: false,
    },
    userId: { 
        type: Schema.Types.ObjectId, ref: "User", 
        required: true,
    },
    rating: { 
        type: Number, 
        required: true,
    },
    message: { 
        type: String, 
        required: true,
    },
    
    },
    {
    timestamps: true,
    }
);

export default model<IReview>("Review", reviewSchema);