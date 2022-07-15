import { model, Schema, Document } from "mongoose";
import {IUser} from "./user.model";

export interface ICar extends Document {
    cathegoryId:Number;
    brand: string;
    model:string;
    features: Array<String>;
    images:Array<String>;
    year:Number;
    user: IUser["_id"];
    bookings:Array<any>;
    reviews:Array<any>;
}


const carSchema = new Schema(
    {
    cathegoryId: {
        type: Number,
        required: true,
    },
    brand:{
        type: String,
        required: true,
    },
    model:{
        type: String,
        required: true,
    },
    year:  {
        type: Number,
        required: true,
        },
    features: {
        type: Array,
        required: true,
        },
    images:Array,

    bookings: {
        type: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
        required: false,
        },
    reviews: {
        type: [{ type: Schema.Types.ObjectId, ref: "Review" }],
        required: false,
        },
    userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
    },
    {
    timestamps: true,
    }
);

export default model<ICar>("Car", carSchema);