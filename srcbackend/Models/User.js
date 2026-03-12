import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema=new Schema( {
    name:{
        type: String,
        required: true
    },
     
    email:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true
    },
    
    refreshtoken:{
        type: String,
    },

    date:{
        type: Date,
        default: Date.now
    },

});

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
       this.password= await bcrypt.hash(this.password, 10)
    }
})

userSchema.methods.ispasswordcorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateaccesstoken=function(){
    return jwt.sign({
        _id:this._id,
        name:this.name,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIREY
    }
)
}


userSchema.methods.generaterefreshtoken=function(){
    return jwt.sign({
        _id:this._id,
        name:this.name,
        email:this.email
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIREY
    }
    )
}

export const User=mongoose.model('User',userSchema)