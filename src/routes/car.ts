import { Router } from "express";
import { list, create, show, update, destroy, updateImage} from "../controllers/car.controller";
import { auth } from "../utils/auth";
import { formData } from "../utils/formData";

const router = Router();
router.route("/").get(list);
router.route("/:carId").get(show); 
router.route("/create").post(auth, formData("CAR"),create);
router.route("/update/:carId").put(auth,update);
router.route("/updateImages/:carId").put(auth, formData("CAR"),updateImage);
router.route("/delete/:carId").delete(auth,destroy);
export default router;