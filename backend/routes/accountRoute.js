import express from 'express';
import mongoose from "mongoose";
import authMiddleWare from "../middleware.js";
import Account from "../models/Account.js";

const accountRouter = express.Router();

//Getting the balance of User
accountRouter.get("/", async (req, res) => {
    return res.send("hello world");
})
accountRouter.get("/balance", authMiddleWare, async (req, res) => {
    // console.log(req.userId);
    const account = await Account.findOne({
        userId: req.userId
    });
    console.log(account);
    return res.json({
        balance: account.balance
    });
})

//Transfering ammount from one account to other handling atomicity
//either all transaction should happen or none should happen

accountRouter.post("/transfer", authMiddleWare, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { amount, to } = req.body;
    console.log(req.body);

    const account = await Account.findOne({ userId: req.userId }).session(session);
    console.log("the account is",account);
    console.log("Account balance:", account.balance);
    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(404).json({
            message: "Insufficient Balance"
        })
    }
    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Invalid Account" });
    }
    //Performing the transactions
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    //commiting the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer Successfull"
    })

});
export default accountRouter;