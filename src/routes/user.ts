import { Router } from "express";
import { signUp,list, signIn, show, update, destroy} from "../controllers/user.controller";
import { auth } from "../utils/auth";
import { formData } from "../utils/formData";

const router = Router();
router.route("/").get(list); 
router.route("/getuser").get(auth,show); 
router.route("/signup").post(signUp); 
router.route("/signin").post(signIn); 
router.route("/update").put(auth,formData("USER"),update);
router.route("/delete").delete(auth,destroy);

export default router;