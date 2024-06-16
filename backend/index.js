import express from 'express';
import dotenv from 'dotenv';
import zod from 'zod';
import cors from 'cors';
import connectToDB from './db.js';
import route from './routes/index.js';

dotenv.config();
const PORT=3000;
const app=express();
app.use(express.json());
app.use(cors());

app.use("/api/v1",route);


connectToDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Running on port ${PORT}`);
    });
})
