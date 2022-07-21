import { model, Schema, Document, models } from "mongoose";


export interface IUser extends Document {
    role:string;
    name: string;
    lastname: string;
    email: string;
    password: String;
    image:string;
    birthday:Date;
    gender:String;
    cars:Array<any>;
    bookings:Array<any>;
    reviews:Array<any>;
}


const userSchema = new Schema(
    {
    role: {
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    lastname:{
        type: String,
        required: true,
    },
    email:  {
        type: String,
        required: true,
        validate: [
            {
            validator(value: any) {
                return models.User.findOne({ email: value })
                .then((user) => !user)
                .catch(() => false);
            },
            message: "email already exist",
            },
        ],
        },
    password: {
        type: String,
        required: true,
        },

    image:String,
    birthday:Date,
    gender:String,
    cars: {
        type: [{ type: Schema.Types.ObjectId, ref: "Car" }],
        required: false,
        },
    bookings: {
        type: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
        required: false,
        },
    reviews: {
        type: [{ type: Schema.Types.ObjectId, ref: "Review" }],
        required: false,
        },
    },
    {
    timestamps: true,
    }
);

export default model<IUser>("User", userSchema);