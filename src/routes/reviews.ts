import { Router } from "express";
import { create} from "../controllers/review.controller";
import { auth } from "../utils/auth";


const router = Router();

router.route("/create").post(auth, create);

export default router;