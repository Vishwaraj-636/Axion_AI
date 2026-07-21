import { Router } from 'express'
import { register, verifyEmail, login, getMe } from '../controllers/auth.controller.js'
import { registerValidator, loginValidator } from '../validators/auth.validator.js'
import { authUser } from '../middleware/auth.middleware.js'

const authRouter = Router()

/**
 * @routes POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */

authRouter.post('/register', registerValidator, register)

/**
 * @route POST api/auth/login
 * @desc login user and return JWT token
 * @access Public
 * @body 
 */

authRouter.post('/login', loginValidator, login)

/**
 * @route GET /api/auth/verify-email
 * @desc verify email
 * @access Public
 * @body {email, password}
 */

authRouter.get("/verify-email", verifyEmail)

/**
 * @route GET /api/auth/get-me
 * @desc get detail
 * @access Public
 * @body {}
 */

authRouter.get("/get-me",authUser,getMe)

export default authRouter


