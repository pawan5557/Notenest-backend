import mongoose from "mongoose";
import { User } from "../Models/User.js";
import { Note } from "../Models/Notes.js";


const registeruser = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
  
      // Check required fields
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Please enter all required fields" });
      }

      const userexists= await User.findOne({email})
      if(userexists){
        return res.status(400).json({ message: "Username with email already exists" })
      }
  
      // Username length check
      if (username.length < 2) {
        return res.status(400).json({ message: "Username must be at least 2 characters long" });
      }
  
      // Email validation (basic regex)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Please enter a valid email address" });
      }
  
      // Password validation
      // const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{5,}$/;
      // if (!passwordRegex.test(password)) {
      //   return res.status(400).json({
      //     message:
      //       "Password must be at least 5 characters long and contain letters, numbers, and a special character",
      //   });
      // }


      if(password.length<3){
        return res.status(400).json({message:"password should have length of min 3 chars"})
      }


      const user= await User.create({
       name: username,
        email:email,
        password:password,
        
      })

      await user.save()
  
      res.status(200).json({ message: "Registration successful" });
  
    } catch (error) {
      next(error);
    }
  }

  const login= async(req,res,next)=>{
    try {
      
      const {email,password}=req.body

      if(!email){
        return res.status(400).json({message:"email is required"})
      }

      if(!password){
        return res.status(400).json({message:"password is required"})
      }

      const user=await User.findOne({email})
      if(!user){
        return res.status(400).json({message:"no such email exists, kindly register first"})
      }

      const ispasswordvalid= await user.ispasswordcorrect(password)
      if(!ispasswordvalid){
        return res.status(400).json({message:"pls enter correct password"})
      }

      const accessToken=user.generateaccesstoken();
      const refreshToken=user.generaterefreshtoken();

      user.refreshtoken=refreshToken
      await user.save()
      

      const options={
        httpOnly:true,
        secure: true,        // REQUIRED: Tells browser the connection is HTTPS
        sameSite: "none"     // REQUIRED: Allows Netlify and Render to share the cookie
        
      }

      return res.status(200).cookie("cookedaccesstoken",accessToken,options)
      .cookie("cookedrefreshtoken",refreshToken,options)
      .json({message:"user successfully logged in"})

    } catch (error) {
      next(error)
    }
  }


  const logout=async(req,res,next)=>{
    try {
      await User.findByIdAndUpdate(req.objuser._id,{ $set:{refreshtoken:1}},{new:true});
      const options={
        httpOnly:true,
        secure: true,        // REQUIRED: Tells browser the connection is HTTPS
        sameSite: "none"     // REQUIRED: Allows Netlify and Render to share the cookie
      }

      return res.status(200)
      .clearCookie("cookedaccesstoken",options)
      .clearCookie("cookedrefreshtoken",options)
      .json({message:"user logged outta here"})
      
    } catch (error) {
      next(error)
    }
  }






  const createnotes=async (req,res,next)=>{
    //we check if user is logged in or not by using verifyjwt
    try {

      let {title, content, tag}=req.body

      const user= await User.findById(req.objuser._id).select("-password -accesstoken")
      if(!user){
        return res.status(400).json({message:"pls login first to use notes app"})
      }

      if(!title){
        title= "Untitled"
      }

      if(!content){
        content= "empty note"
      }

      if(!tag){
        tag= "General"
      }

      const newnote= await  Note.create({
        title:title,
        content:content,
        tag:tag,
        user: req.objuser._id
      })

      await newnote.save();

      return res.status(200).json({message:"Note saved successfully", note: newnote})
      
    } catch (error) {
      next(error)
    }
  }



  const fetchallnotes=async(req,res,next)=>{
    //chech if user is loged in or not
    // to get count of notes we gotta count all notes who has a user id lets say abc
    try {
      const user= await User.findById(req.objuser._id).select("-password -refreshtoken")
      if (!user){
        return res.status(400).json({message:"no such user exists"})
      }

      const fetchnotes= await Note.find({user:req.objuser._id}).sort({createdAt:-1})

    return res.status(200).json({
      total: fetchnotes.length,
      notes: fetchnotes
    });


    } catch (error) {
      next(error)
    }
  }


    const updatenotes=async(req,res,next)=>{
      //we check if user is logedin or not
      //we take title,tag,content via req.body
      //if fields are non empty we save it
      try {

        

        const user= await User.findById(req.objuser._id)
        if(!user){
          return res.status(400).json({message:"pls login first"})
        }

        const{noteid}=req.params
        
          if(!noteid){
           
            return res.status(400).json({message:"no such note exists"})
          }
          
          const note= await Note.findOne({ _id:noteid, user:req.objuser._id})
          


        const {title, tag, content}=req.body

        if(title!==undefined){
          note.title=title
        }

        if(tag!==undefined){
          note.tag=tag
        }

        if(content!==undefined){
          note.content=content
        }

        await note.save()

        return res.status(200).json({
          message: "note updated successfully",
          note: note
        });
        
        
      } catch (error) {
        next(error)
      }
    }













  const deletenotes = async (req, res, next) => {
    try {
  
      const user = await User.findById(req.objuser._id);
  
      if (!user) {
        return res.status(400).json({ message: "pls login before deleting" });
      }
  
      const { noteid } = req.params;
  
      if (!noteid) {
        return res.status(400).json({ message: "note id is required" });
      }
  
      const note = await Note.findOne({
        _id: noteid,
        user: req.objuser._id   // ensures ownership
      });
  
      if (!note) {
        return res.status(400).json({ message: "no such note exists or unauthorized" });
      }
  
      await Note.findByIdAndDelete(noteid);
  
      return res.status(200).json({ message: "note deleted successfully" });
  
    } catch (error) {
      next(error);
    }
  };


  const updateuser= async(req,res,next)=>{
    //user needs to be loged in first
    //then allow changing details
    try {

      const user= await User.findById(req.objuser._id).select("-password -accesstoken")
      if(!user){
        return res.status(400).json({message:"pls login first to use notes app"})
      }

      const{username,email}=req.body

      if(!username || !email){
        return res.status(400).json({message:"pls enter username n email to update"}) 
      }

      const userexists= await User.findOne({email})
      if(userexists){
        return res.status(400).json({ message: "Username with email already exists" })
      }

      await User.findOneAndUpdate(req.objuser._id, {$set:{
        username:username,
        email:email
      }},
        {new:true}  
    )

      return res.status(200).json({message:"username n email updated successfully"})
    } catch (error) {
      next(error)
    }
  }


  const updatepassword=async(req,res,next)=>{
    try {
      const {oldpassword, newpassword}=req.body || {}

     const user= await User.findById(req.objuser._id)
      if(!user){
        return res.status(400).json({message:"user id not found"})
      }

      if(!oldpassword || !newpassword){
        return res.status(400).json({message:"pls fill the necessary details"})
      }

      const comparepassword= await user.ispasswordcorrect(oldpassword)
      if(!comparepassword){
        return res.status(400).json({message:"incorrect password"})
      }

      user.password=newpassword
      await user.save()

      return res.status(200).json({message:"password updated successfully"})

    } catch (error) {
      next(error)
    }
  }




  const deleteuser = async (req, res, next) => {
    try {
  
      const user= await User.findById(req.objuser._id)
  
      if (!user) {
        return res.status(400).json({ message: "unauthorized request" });
      }
  
      // Delete all notes of the user
      await Note.deleteMany({ user: req.objuser._id});
  
      // Delete user account
      await User.findByIdAndDelete(req.objuser._id);
  
      const options = {
        httpOnly: true,
        secure: true,        // REQUIRED: Tells browser the connection is HTTPS
        sameSite: "none"     // REQUIRED: Allows Netlify and Render to share the cookie
      };
  
      return res.status(200)
        .clearCookie("cookedaccesstoken", options)
        .clearCookie("cookedrefreshtoken", options)
        .json({ message: "user account deleted successfully" });
  
    } catch (error) {
      next(error);
    }
  };


export {registeruser, login, logout, createnotes, fetchallnotes, updatenotes, deletenotes,deleteuser, updatepassword, updateuser}