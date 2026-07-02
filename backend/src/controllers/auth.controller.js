import userModel from "../model/user.model";
import jwt from 'jsonwebtoken'

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ email }, { username }]
  })

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User already exists with this email or username",
      success: false,
      err: "User already exists"
    })
  }


  const user = await userModel.create({ username, email, password })





}