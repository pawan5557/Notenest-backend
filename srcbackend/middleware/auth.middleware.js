import jwt from "jsonwebtoken"
import { User } from "../Models/User.js"
const verifyjwt =async(req,res,next)=>{
    try {
        const ifrefreshtokenexists=req.cookies?.cookedrefreshtoken;
if(!ifrefreshtokenexists){
    return res.status(400).json({message:"no refresh token exists"})
}

const comparerefreshtoken= await jwt.verify(ifrefreshtokenexists,process.env.REFRESH_TOKEN_SECRET)
if(!comparerefreshtoken){
    return res.status(400).json({message:"unauthorized access for logout"})
}

const findrefreshtoken= await User.findById(comparerefreshtoken._id).select("-password -accesstoken")


req.objuser=findrefreshtoken;
next();
    } catch (error) {
        next(error)
    }
}

export {verifyjwt}