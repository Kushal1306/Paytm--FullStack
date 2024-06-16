import mongoose from "mongoose";

const UserSchema= new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
        
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    }
});

export const User=mongoose.model('User',UserSchema)