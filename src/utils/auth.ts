import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import express, {Request, Response} from 'express';
declare var process : {
    env: {
        SECRET_KEY: string
    }
    }
    interface JwtPayload {
        id: string
    }

export async function auth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
       // En el back minuscula, en el front mayuscula
    const { authorization } = req.headers;

    //Para verificar que trae el encabezado
    if (!authorization) {
        throw new Error("expired session auth");
    }

    //Para separar el Bearer del token
    const [_, token] = authorization.split(" ");

    //Para verificar que trae el token
    if (!token) {
        throw new Error("expired session token");
    }

    //Reversión de la codificación del token
    const {id} = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;

    //Mutar el objeto req en el user (req.user) para poder acceder a el en cualquier parte
    req.user = id;

    next();
    }catch (err:any){
        res.status(401).json({ message: err.message });
    } 
}