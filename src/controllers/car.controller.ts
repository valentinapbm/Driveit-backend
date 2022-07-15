import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import Car, {ICar} from "../models/car.model";


//GET- READ ALL
export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const cars = await Car.find();
        if(cars.length === 0){
            throw new Error ("There is not any car created")
        }
        res.status(200).json(cars);
    }catch (err:any){
        res.status(404).json({ message:err.message})
    } 
}
//show ID
export async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
    const {cardId} = req.params;

        const car = await User.findById(cardId)
        if (!car){
            throw new Error ("Car does not exist")
        }
    res.status(200).json(car);
    } catch(err:any){
        res.status(404).json({message:err.message});
    }
}

//CREATE-POST
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const id = req.user;
        const user = await User.findById(id);

        if (!user) {
        throw new Error("Invalid user");
        }

        const car: ICar = await Car.create({...req.body, userId: user._id, });
        await user.cars.push(car);
        await user.save({ validateBeforeSave: false });
    res.status(201).json({
        message: "car created",
        data: car,
        });
    }catch (err:any){
        res.status(400).json({ message: "car could not be created", data: err.message });
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
        const user = await User.findById(userId);
        if(!user){
            throw new Error ("User does not exist")
        }
        const {cardId} = req.params;
        const car = await Car.findByIdAndDelete(cardId);

        res.status(200).json({ message: "Car deleted", data:car });
    } catch (err:any) {
        res.status(400).json({ message:err.message});
    }
}