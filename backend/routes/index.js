import express from 'express';
import userRoute from './userRoute.js'
import accountRoute from './accountRoute.js'

const router=express.Router();

router.use("/user",userRoute);
router.use("/account",accountRoute);

export default router;