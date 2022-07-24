import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {transporter, recoverypassword, resetpassword} from "../utils/mailer"

declare var process : {
    env: {
        SECRET_KEY: string
    }
    }

//GET- READ ALL
export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const users = await User.find();
        if(users.length === 0){
            throw new Error (JSON.stringify("There is not any user created"))
        }
        res.status(200).json(users);
    }catch (err:any){
        res.status(404).json({ message:JSON.parse(err.message)})
    } 
}
//show ID
export async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
    const id = req.user;
        console.log("este es el id", id);
        const user = await User.findById(id)
        .select("-password")
        .populate({
            path: "cars",
            populate: { path: "bookings", populate: "userId" },
        })
        .populate({
            path: "bookings",
            populate: {
            path: "userId",
            },
        })
        
        if (!user){
            throw new Error ("User does not exist")
        }
    res.status(200).json(user);
    } catch(err:any){
        res.status(404).json({message:err.message});
    }
}

//CREATE-POST
export async function signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
    const data = req.body;
    const encPassword = await bcrypt.hash(data.password, 8);
    const newUser = { ...data, password: encPassword };
    const user: IUser = await User.create(newUser);
    const token = jwt.sign(
        { id: user._id }, //Payload ó datos usuario
        process.env.SECRET_KEY, //llave secreta
        { expiresIn: 60 * 60 * 100 } 
    );
    res.status(201).json({
        message: "user created",
        data: { token, name: user.name, email: user.email },
        });
    }catch (err:any){
        res.status(400).json({ message: "user could not be created", data: err });
    } 
}

//LOGIN-POST
export async function signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email }) 

        if (!user) {
            throw new Error(("user or password invalid"));
        }

        const isValid = await bcrypt.compare(password, user.password.toString());
        if (!isValid) {
            throw new Error(("user / password invalid"));
        }

        const token = jwt.sign(
            { id: user._id }, //Payload ó datos usuario
            process.env.SECRET_KEY, //llave secreta
            { expiresIn: 60 * 60 * 100 }
        );
        res.status(201).json({ message: "user login successfully", data: token });
    } catch (err:any) {
        res.status(400).json({ message:err.message});
    }
}
//UPDATE
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const userId = req.user;

        const user = await User.findByIdAndUpdate(userId, req.body, {
            new: true,
            runValidators: true,
            context: "query",
        })
            .select("-password")
        
        res.status(200).json({ message: "User updated", data:user});
    }catch (err:any) {
        res.status(400).json({ message:err.message});
    }
}
//UPDATE
export async function updatePicture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const image = req.body.file.secure_url;

        const upImage = await User.findByIdAndUpdate(
            req.user,
            { image: image },
            {
            new: true,
            runValidators: true,
            context: "query",
            }
        );
        res.status(200).json({ message: "Image User updated",  data: upImage });
    } catch (err:any) {
        res.status(400).json({ message:err.message});
    }
}


//CHANGE PASSWORD
export async function changePass(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const userId = req.user;
        const { password , newPassword } = req.body;
        const user = await User.findById(userId)
        
        if (!user){
            throw new Error ("User does not exist")
        }
        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid){
            throw new Error ("old password invalid")
        }
        if (isValid) {
            const encPassword = await bcrypt.hash(newPassword, 8);
            const user = await User.findByIdAndUpdate(
            userId,
            { password: encPassword },
            { new: true, runValidators: true, context: "query" }
            );
        }
        res.status(200).json({ message: "Password updated" });
    } catch (err:any) {
        res.status(400).json({ message:err.message});
    }
}

 //recovery pass 
    export async function recovery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Email not found");
        }
        function generateOTP() {
            var digits = '0123456789';
            let OTP = '';
            for (let i = 0; i < 4; i++ ) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }
            return OTP;
        }
        const token = generateOTP();
        await transporter.sendMail(recoverypassword(email, token, user.name));
        res.status(200).json({ message: "email sent", data:token });
    } catch (err:any) {
        res.status(400).json({ message:err.message});
    }
}

 //recovery pass 
 export async function reset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Email not found");
        }
        const encPassword = await bcrypt.hash(newPassword, 8);
        await User.findByIdAndUpdate(
            user._id,
            { password: encPassword },
            { new: true, useFindAndModify: false, runValidators: true }
          );
        await transporter.sendMail(resetpassword(email, user.name));
        res.status(200).json({ message: "email sent" });
    } catch (err:any) {
        res.status(400).json({ message:err.message});
    }
}


//DELETE
export async function destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const userId = req.user;
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            throw new Error ("User does not exist")
        }
        res.status(200).json({ message: "User deleted" });
    } catch (err:any) {
        res.status(400).json({ message:err.message});
    }
}


