import express from "express"
import { register, login, refresh, logout, googleAuth, subscribe } from "../controllers/authController.js"
import { validate } from "../middleware/validate.js"

import {
 registerValidator,
 loginValidator,
 googleValidator
} from "../validators/authValidator.js"

const router = express.Router()

router.post("/signup", registerValidator, validate, register)

router.post("/login", loginValidator, validate, login)

router.post("/google", googleValidator, validate, googleAuth)

router.post("/refresh", refresh)

router.post("/logout", logout)

router.post("/subscribe", subscribe)

export default router