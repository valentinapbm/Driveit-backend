import { model, Schema, Document } from "mongoose";
import {IUser} from "./user.model";

export interface ICar extends Document {
    brand: string;
    model:string;
    fuel:string;
    color:string;
    countDoors:Number;
    images:Array<any>;
    year:String;
    userId: IUser["_id"];
    bookings:Array<any>;
    reviews:Array<any>;
    countSeats: Number;
    transmision:String;
    price:Number;
    lng: Number;
    lat: Number;
    city:String;

}


const carSchema = new Schema(
    {
    brand:{
        type: String,
        required: true,
    },
    model:{
        type: String,
    },
    year:  {
        type: Number,
        required: true,
        },
    
    fuel: {
        type: String,
    },
    color: {
        type: String,
    },
    transmision: {
        type: String,
    },
    countDoors:Number,
    countSeats: Number,
    price: {
        type: Number,
        require:true
    },
    lat: {
        type: Number,
        require:true
    },
    lng: {
        type: Number,
        require:true
    },
    city: {
        type: String,
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