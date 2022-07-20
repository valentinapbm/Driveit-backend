import { model, Schema, Document } from "mongoose";
import {IUser} from "./user.model";
import { ICar } from "./car.model";

export interface IBooking extends Document {
    user: IUser["_id"];
    carId:ICar["_id"];
}


const bookingSchema = new Schema(
    {
    userId: { 
        type: Schema.Types.ObjectId, ref: "User", 
        required: true,
    },
    carId: {
        type: [{ type: Schema.Types.ObjectId, ref: "Car" }],
        required: false,
    },
    startDate: {
        type: Date,
        required: false,
    },
    endDate: {
        type: Date,
        required: false,
    },
    pickupHour: {
        type: Number,
        required: false,
    },
    leftHour: {
        type: Number,
        required: false,
    },
    statusBooking:{
        type:String
    },
    },
    {
    timestamps: true,
    }
);

export default model<IBooking>("Booking", bookingSchema);