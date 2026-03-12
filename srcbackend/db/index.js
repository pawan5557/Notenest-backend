import mongoose from "mongoose";


const connectDB= async()=>{
    try {

        mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)

        console.log("connected to database")



    } catch (error) {
        console.log("failed connecting to mongodb",error)
    }
}

export {connectDB}