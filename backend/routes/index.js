import express from 'express';
import userRouter from './userRoute.js'
import accountRouter from './accountRoute.js'

const router=express.Router();

router.use("/user",userRouter);
router.use("/account",accountRouter);

export default router;