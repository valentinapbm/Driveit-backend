import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import Car, {ICar} from "../models/car.model";
import Booking, {IBooking} from "../models/booking.model"
import Review, {IReview} from "../models/review.model"

//CREATE-POST
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const id = req.user;
        const user = await User.findById(id);
        const {carId} = req.params;
        const car = await Car.findById(carId);
        if (!car) {
        throw new Error("Invalid user");
        }
        if(!car){
            throw new Error("Invalid car");
        }
        const review: IReview = await Review.create({...req.body, userId: user?._id, carId: carId });
        user?.reviews.push(review); 
        car.reviews.push(review);
        await user?.save({ validateBeforeSave: false });
        await car.save({ validateBeforeSave: false });
    res.status(201).json({
        message: "review created",
        data: review,
        });
    }catch (err:any){
        res.status(400).json({ message: "review could not be created", data: err.message });
    } 
}
