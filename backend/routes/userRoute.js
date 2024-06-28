import express from 'express';
import { User } from '../models/User.js';
import JWT_SECRET from '../config.js';
import jwt from 'jsonwebtoken';
import zod from 'zod'
import authMiddleWare from '../middleware.js';
import bcrypt from 'bcrypt';
import Account from '../models/Account.js';
import { OAuth2Client } from 'google-auth-library';

const client=new OAuth2Client();

const userRouter = express.Router();

const signupSchema = zod.object({
    userName: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

userRouter.get("/",async(req,res)=>{
   return res.send("Hello World");
});

userRouter.post("/signup", async (req, res) => {
    const {success} = signupSchema.safeParse(req.body);
    if (!success) {
        return res.json({ message: "Incorrect inputs" });
    }
    const existingUser = User.findOne({ userName: req.body.userName });
    console.log("the existing user is:",existingUser);
    if (existingUser._id) {
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
    return;

})
//Sign in
const signinbody = zod.object({
    userName: zod.string().email(),
    password: zod.string(),
})

userRouter.post("/signin", async (req, res) => {
    console.log(req.body);
    const response = signinbody.safeParse(req.body);
    if (!response.success) {
        return res.status(411).json({
            message: "incorrect inputs"
        })
    }
    console.log(response.success);
    const user = await User.findOne({
        userName: req.body.userName,
    })
    console.log(user);
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

//signin with google
userRouter.post("/google-signin",async(req,res)=>{
    const token=req.body.token;
    console.log(token);
    try {
        const ticket=await client.verifyIdToken({
            idToken:token,
            audience:process.env.GOOGLE_CLIENT_ID
        });
        const payload=ticket.getPayload();
        const googleId=payload['sub'];
        const email=payload['email'];
        const firstName=payload['given_name'];
        const lastName=payload['family_name'];
        let user=await User.findOne({userName:email});
        if(!user){
            user=await User.create({
                userName:email,
                password: Math.random().toString(36).slice(-8),
                firstName,
                lastName,
                googleId:googleId
            });
            await Account.create({
                userId:user._id,
                balance:parseInt(Math.random()*10000)
            });
        }
        const jwtToken=jwt.sign(  {
            userId: user._id,
        },
        process.env.JWT_SECRET);
        return res.status(200).json({
            message:"signed in successfully with google",
            token:jwtToken
        });
      
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        res.status(400).json({ message: "Invalid Google token" });
    }
  });

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

userRouter.put("/", authMiddleWare, async (req, res) => {
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
userRouter.get("/bulk",authMiddleWare,async(req,res)=>{
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
console.log('req.userId:', req.userId);

res.json({
    user: users
        .filter(user => user._id.toString() !== req.userId.toString())
        .map(user => ({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
});
});


//Getting info of current user
userRouter.get("/getUser",authMiddleWare,async(req,res)=>{
    const user=await User.findOne({_id:req.userId});
    res.json(user);
})


userRouter.get("/validate-token",authMiddleWare,async(req,res)=>{
  return res.json({valid:true});
});


export default userRouter;