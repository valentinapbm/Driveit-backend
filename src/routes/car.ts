import { Router } from "express";
import { list, create, show} from "../controllers/car.controller";
import { auth } from "../utils/auth";
import { formData } from "../utils/formData";

const router = Router();
router.route("/").get(list);
router.route("/:carId").get(show); 
router.route("/create").post(auth, formData("CAR"),create);
export default router;