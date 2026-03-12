import { Router} from "express";
import { registeruser, login, logout, createnotes, fetchallnotes, updatenotes, deletenotes,deleteuser, updatepassword, updateuser } from "../controllers/user.controller.js";
import { verifyjwt} from "../middleware/auth.middleware.js"
const router_variable=Router();

router_variable.route("/registeruser").post(registeruser)

router_variable.route("/login").post(login)

router_variable.route("/logout").post(verifyjwt,logout)

router_variable.route("/createnotes").post(verifyjwt, createnotes)

router_variable.route("/fetchnotes").get(verifyjwt, fetchallnotes)

router_variable.route("/updatenotes/:noteid").put(verifyjwt, updatenotes)

router_variable.route("/deletenotes/:noteid").delete(verifyjwt, deletenotes)

router_variable.route("/deleteuser").delete(verifyjwt, deleteuser)

router_variable.route("/updatepassword").put(verifyjwt,updatepassword)

router_variable.route("/updateuser").put(verifyjwt, updateuser)


export {router_variable}