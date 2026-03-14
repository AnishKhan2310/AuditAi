import { body } from "express-validator"

export const registerValidator = [

 body("email")
  .trim()
  .isEmail()
  .withMessage("Invalid email format")
  .normalizeEmail(),

 body("password")
  .trim()
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters")

]

export const loginValidator = [

 body("email")
  .trim()
  .isEmail()
  .withMessage("Invalid email format")
  .normalizeEmail(),

 body("password")
  .trim()
  .notEmpty()
  .withMessage("Password is required")

]

export const googleValidator = [

 body("token")
  .trim()
  .notEmpty()
  .withMessage("Google token is required")

]