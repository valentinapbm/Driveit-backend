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
    const {carId} = req.params;
        console.log(carId)
        const car = await   Car.findById(carId)
        .populate("userId", "name lastname image")

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
    let listKeys: Array<any>;
    
    listKeys = Object.values(req.body);
    try{
        const id = req.user;
        const user = await User.findById(id);

        if (!user) {
        throw new Error("Invalid user");
        }

        const car: ICar = await Car.create({...req.body, userId: user._id, });
        
        for (let i = 0; i < listKeys.length; i++) {
            if (listKeys[i].secure_url !== undefined) {
                await car.images.push(listKeys[i].secure_url);
                await car.save({ validateBeforeSave: false });
            }
        }
        
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
        const {carId} = req.params;
     
        if (!user) {
        throw new Error("Invalid user");
        }

        const car = await Car.findByIdAndUpdate(carId, req.body, { new: true, runValidators: true });
        if (!car) {
            throw new Error("Invalid car");
        }
    res.status(201).json({
        message: "car updated",
        data: car,
        });
    }catch (err:any){
        res.status(400).json({ message: "car could not be updated", data: err.message });
    } 
}
//UPDATE IMAGES
export async function updateImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    let listKeys: Array<any>;
    listKeys = Object.entries(req.body).filter(([key, value]) => key.includes("file"));
    try{
        const id = req.user;
        const user = await User.findById(id);
        const {carId} = req.params;

        if (!user) {
        throw new Error("Invalid user");
        }

        const car = await Car.findById(carId);
        if (!car) {
            throw new Error("Invalid car");
        }

        for (let j = 0; j < listKeys.length; j++) {
            console.log("AQUI", listKeys[j][1].secure_url);
            if (listKeys[j][1].secure_url !== undefined || listKeys[j][1].secure_url !== null ) {
            await car.images.push(listKeys[j][1].secure_url);
            await car.save({ validateBeforeSave: false }); 
            }
        }
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
        const {carId} = req.params;
        const car = await Car.findByIdAndDelete(carId);

        res.status(200).json({ message: "Car deleted", data:car });
    } catch (err:any) {
        res.status(400).json({ message:err.message});
    }
}