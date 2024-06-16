import express from 'express';
import { User } from '../models/User.js';
import JWT_SECRET from '../config.js';
import jwt from 'jsonwebtoken';
import zod from 'zod'
import authMiddleWare from '../middleware.js';
import bcrypt from 'bcrypt';
import Account from '../models/Account.js';

const router = express.Router();

const signupSchema = zod.object({
    userName: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

router.get("/",async(req,res)=>{
   return res.send("Hello World");
});

router.post("/signup", async (req, res) => {
    const body = req.body;
    const response = signupSchema.safeParse(body)
    if (!response.success) {
        return res.json({ message: "Email already taken/Incorrect inputs" });
    }
    const user = User.findOne({ userName: body.userName });
    if (user._id) {
        return res.json({ message: "email already taken/incorrect inputs" });
    }
    const { userName, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        userName,
        password: hashedPassword,
        firstName,
        lastName

    });
    const userId = newUser._id;

    // Creating account
   await Account.create({
    userId,
    balance:parseInt(Math.random()*10000),
   });

    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });

})
//Sign in
const signinbody = zod.object({
    userName: zod.string().email(),
    password: zod.string(),
})

router.post("/signin", async (req, res) => {
    const response = signinbody.safeParse(req.body);
    if (!response.success) {
        return res.status(411).json({
            message: "incorrect inputs"
        })
    }
    const user = await User.findOne({
        userName: req.body.userName,
    })
    if (!user) {
        return res.status(404).json("user not found!");
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
        return res.status(401).json("Wrong credentials");
    }
    const token = jwt.sign(
        {
            userId: user._id,
        },
        process.env.JWT_SECRET
    );
    res.status(200).json({
        message:"Signed In successfully",
        token: token
    })
    return;
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

router.put("/", authMiddleWare, async (req, res) => {
    const response = updateBody.safeParse(req.body);
    if (!response.success) {
        res.status(411).json({
            message: "error while updating info"
        });
    }
    await User.updateOne({ _id: req.userId }, req.body);
    res.json({
        message: "Updated successfully",
    });

})

// for getting users with filter query
router.get("/bulk",async(req,res)=>{
 const filter=req.query.filter || "";
 const users=await User.find({ 
    $or:[
    {
        firstName:{
            $regex:filter,
        },
    },
    {
        lastName:{
            $regex:filter,
        },
    }
  ],
});

res.json({
    user:users.map((user)=>({
        userName:user.userName,
        firstName:user.firstName,
        lastName:user.lastName,
        _id:user._id
    })),
});
});


//Getting info of current user
router.get("/getUser",authMiddleWare,async(req,res)=>{
    const user=await User.findOne({_id:req.userId});
    res.json(user);
})


export default router;