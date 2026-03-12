import express from "express";
import cookieParser from "cookie-parser";
const app=express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import { router_variable } from "./srcbackend/Routes/user.router.js";
app.use("/users",router_variable)

export {app}