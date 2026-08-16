import userModel from "../model/user.model.js";
import jwt from 'jsonwebtoken'
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ email }, { username }]
  })

  if (isUserAlreadyExist) {
    return res.status(409).json({
      message: "User already exists with this email or username",
      success: false,
      err: "User already exists"
    })
  }


  const user = await userModel.create({ username, email, password })

  const emailVerificationToken = jwt.sign({
    email:user.email,

  },process.env.JWT_SECRET)

  await sendEmail({
    to: email,
    subject: "Welcome to Axion AI",
    html: `
    <h1>Welcome to Axion AI</h1>
    <p>Thank you for registering with us. We're excited to have you on board!</p>
    <p>Please verify your email by clicking the link below:</p>
    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
    <p>If you did not register with us, please ignore this email.</p>
    <p>Thank you,</p>
    <p>The Axion AI Team</p>
    `,
    text: "Thank you for registering with Axion AI. We're excited to have you on board!"
  })

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user:{
      id: user._id,
      username: user.username,
      email: user.email,
    }
  })



}

export async function login(req,res) {
  const {email,password} = req.body;
  const user = await userModel.findOne({email})

  if(!user){
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found"
    })
  }

  const isPasswordValid = await user.comparePassword(password)

  if(!isPasswordValid){
    return res.status(401).json({
      message: "Invalid password",
      success: false,
      err: "Invalid password"
    })
  } 

  if(!user.verified) {
    return res.status(401).json({
      message: "Email not verified",
      success: false,
      err: "Email not verified"
    })
  }

  const token = jwt.sign({
    id:user._id,
    username:user.username,
  },process.env.JWT_SECRET,{expiresIn: '7d'})

  res.cookie("token",token)

  res.status(200).json({
    message:"Login successful",
    success:true,
    user:{
      id:user._id,
      username:user.username,
      email:user.email,
    }
  })

}

export async function verifyEmail(req,res) {
  try{
    const {token} = req.query;

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    const user = await userModel.findOne({email:decoded.email})

    if(!user){
      return res.status(400).json({
        message: "Invalid token",
        success: false,
        err: "User not found"
      })
    }

    user.verified = true;
    await user.save();

    res.status(200).send(`
          <h1>Email Verified Successfully</h1>
          <p>You can now log in to your account.</p>

          <a href="http://localhost:3000/api/auth/login">Go to Login</a>
      `);
  }
  catch(err){
    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
      err: err.message
    })
  }
}

export async function getMe(req,res) {
  const userId = req.user.id;
  const user = await userModel.findById(userId).select("-password");

  if(!user){
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found"
    })
  }

  res.status(200).json({
    message: "User details fetched successfully",
    success: true,
    user
  })
}

export async function logout(req,res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successful",
    success: true
  })
}