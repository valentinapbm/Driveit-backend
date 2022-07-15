import { model, Schema, Document } from "mongoose";
import {IUser} from "./user.model";

export interface IReview extends Document {
    cathegoryId:Number;
    brand: string;
    model:string;
    features: Array<String>;
    images:Array<String>;
    year:Number;
    user: IUser["_id"];
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