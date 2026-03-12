import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app=express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://notenestnote.netlify.app" // Replace this when you get your real link!
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
import { router_variable } from "./srcbackend/Routes/user.router.js";
app.use("/users",router_variable)

export {app}