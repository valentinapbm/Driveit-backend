import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import Car, {ICar} from "../models/car.model";
import Booking, {IBooking} from "../models/booking.model"
import {transporter, bookingsendHost, bookingsendUser} from "../utils/mailer"

//CREATE-POST
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const id = req.user;
        const user = await User.findById(id);
        const {carId} = req.body;
        const{startDate,
            endDate,
            pickupHour,
            leftHour,
            priceTotal} = req.body
        const car = await Car.findById(carId);
        if (!user) {
        throw new Error("Invalid user");
        }
        if(!car){
            throw new Error("Invalid car");
        }
        const Usercar = car.userId;
        const userHost = await User.findById(Usercar);
        const booking: IBooking = await Booking.create({...req.body, userId: user._id, carId: carId });
        user.bookings.push(booking); 
        car.bookings.push(booking);
        await user.save({ validateBeforeSave: false });
        await car.save({ validateBeforeSave: false });
        await transporter.sendMail(bookingsendHost(userHost?.email, userHost?.name, car.brand,priceTotal, startDate, endDate, pickupHour, leftHour));
        await transporter.sendMail(bookingsendUser(user.email, user.name, car.brand,priceTotal, startDate, endDate, pickupHour, leftHour));
    res.status(201).json({
        message: "booking created",
        data: car,
        });
    }catch (err:any){
        res.status(400).json({ message: "booking could not be created", data: err.message });
    } 
}
