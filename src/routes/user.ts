import { Router } from "express";
import { signUp,list, signIn, show, update, destroy, updatePicture} from "../controllers/user.controller";
import { auth } from "../utils/auth";
import { formData } from "../utils/formData";

const router = Router();
router.route("/").get(list); 
router.route("/getuser").get(auth,show); 
router.route("/signup").post(signUp); 
router.route("/signin").post(signIn); 
router.route("/update").put(auth,update);
router.route("/delete").delete(auth,destroy);
router.route("/updateImage").put(auth, formData("USER"),updatePicture);
export default router;