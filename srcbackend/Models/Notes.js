import mongoose, {Schema} from "mongoose"
import { User } from "./User.js";

const noteSchema=new Schema( {
    title:{
        type: String,
        required: true
    },
     
    content:{
        type: String,
        required: true
    },

    tag:{
        type: String,
        default: "General"
    },

    date:{
        type: Date,
        default: Date.now
    },

    user:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
   

},

{
    timestamps:true
},
);

export const Note =  mongoose.model("Note",noteSchema);