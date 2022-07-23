import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import {connect} from "./db"
import userRouter from "./routes/user"
import carRouter from "./routes/car"
import Stripe from "stripe";
import bookingRouter from "./routes/booking"
dotenv.config();
declare var process : {
    env: {
        STRIPE_SECRET_KEY: string,
        PORT:string
    }
    }
const port = process.env.PORT;
const app = express();
connect();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/users", userRouter); 
app.use("/cars", carRouter); 
app.use("/bookings", bookingRouter); 

const stripe = new Stripe("sk_test_51LORjaDDc38cnPECzpnd76z4oclZZ7uDuMWgxJQ4T07TtIrMpTC17g73QBlKCLdtzY8fEMivBCa7hx9BEmMmJ0S20058KxwRC1", { apiVersion: "2020-08-27" });


app.listen(port, () => {
    console.log(`Port: ${port} is running`);
});

app.post("/create-payment-intent", async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099, //lowest denomination of particular currency
        currency: "usd",
        payment_method_types: ["card"], //by default
        });

        const clientSecret = paymentIntent.client_secret;

        res.json({
        clientSecret: clientSecret,
        });
    } catch (e) {
        console.log(e.message);
        res.json({ error: e.message });
    }
});