import {Router} from 'express'
import { register } from '../controllers/auth.controller'
import { registerValidator } from '../validators/auth.validator'

const authRouter = Router()


authRouter.post('/register', registerValidator, register)

export default authRouter
