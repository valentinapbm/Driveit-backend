import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import Car, {ICar} from "../models/car.model";
import Booking, {IBooking} from "../models/booking.model"



//CREATE-POST
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const id = req.user;
        const user = await User.findById(id);
        const {carId} = req.body;
        const car = await User.findById(carId);
        if (!user) {
        throw new Error("Invalid user");
        }
        if(!car){
            throw new Error("Invalid car");
        }
        const booking: IBooking = await Booking.create({...req.body, userId: user._id, carId: carId });
        user.bookings.push(booking); 
        car.bookings.push(booking);
        await user.save({ validateBeforeSave: false });
        await car.save({ validateBeforeSave: false });
    res.status(201).json({
        message: "booking created",
        data: car,
        });
    }catch (err:any){
        res.status(400).json({ message: "booking could not be created", data: err.message });
    } 
}

//UPDATE
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const id = req.user;
        const user = await User.findById(id);
        const {cardId} = req.params;

        if (!user) {
        throw new Error("Invalid user");
        }

        const car = await Car.findByIdAndUpdate(cardId, req.body, { new: true, runValidators: true });

    res.status(201).json({
        message: "car updated",
        data: car,
        });
    }catch (err:any){
        res.status(400).json({ message: "car could not be updated", data: err.message });
    } 
}
//DELETE
export async function destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const userId = req.user;
        const { bookingId } = req.body;
        const user = await User.findById(userId);
        if(!user){
            throw new Error ("User does not exist")
        }
        const booking = Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ message: "Booking deleted", data:booking });
    } catch (err:any) {
        res.status(400).json({ message:err.message});
    }
}