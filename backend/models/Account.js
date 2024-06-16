import mongoose from "mongoose";
import { User } from "./User.js";

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
});

const Account=mongoose.model("Account",accountSchema);

export default Account;