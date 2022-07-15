
import mongoose from "mongoose";
declare var process : {
    env: {
        MONGOURI: string
    }
    }

export let connection: mongoose.Connection;

export async function connect(): Promise<void> {
    if (connection) return;
    
    await mongoose.connect(process.env.MONGOURI);

    connection = mongoose.connection;

    connection.once("open", () => {
    console.log("Connection to MongoDB running");
    });
}

export async function disconnect(): Promise<void> {
    if (!connection) return;
    await mongoose.disconnect();
}