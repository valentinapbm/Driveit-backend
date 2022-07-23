import { Router } from "express";
import { create} from "../controllers/booking.controller";
import { auth } from "../utils/auth";
import { formData } from "../utils/formData";

const router = Router();

router.route("/create").post(auth, create);

export default router;