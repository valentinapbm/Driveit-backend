import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import {connect} from "./db"
import userRouter from "./routes/user"
import carRouter from "./routes/car"

dotenv.config();
const port = process.env.PORT;
const app = express();
connect();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/users", userRouter); 
app.use("/cars", carRouter); 

app.listen(port, () => {
    console.log(`Port: ${port} is running`);
});