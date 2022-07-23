import { model, Schema, Document } from "mongoose";
import {IUser} from "./user.model";
import { ICar } from "./car.model";

export interface IBooking extends Document {
    user: IUser["_id"];
    carId:ICar["_id"];
    startDate: Date;
    endDate:Date;
    pickupHour: Array<any>;
    leftHour: Array<any>;
    priceTotal: Number;
    payment: String
}


const bookingSchema = new Schema(
    {
    userId: { 
        type: Schema.Types.ObjectId, ref: "User", 
        required: true,
    },
    carId: {
        type: [{ type: Schema.Types.ObjectId, ref: "Car" }],
        required: true,
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
        type: Array,
        required: false,
    },
    leftHour: {
        type: Array,
        required: false,
    },
    statusBooking:{
        type:String
    },
    priceTotal:{
        type:Number
    },
    payment:{
        type:String
    },
    },
    {
    timestamps: true,
    }
);

export default model<IBooking>("Booking", bookingSchema);