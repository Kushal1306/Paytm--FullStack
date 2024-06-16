import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const url = process.env.url;

//Connecting to the database

async function connectToDB(){
    try {
        await  mongoose.connect(url);
        console.log("connected");
        
    } catch (error) {
        console.error('Error connecting to Database',error)
    }

};

export default connectToDB;