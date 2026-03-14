import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { OAuth2Client } from "google-auth-library"
import { generateAccessToken, generateRefreshToken } from "../utils/token.js"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)


// SIGNUP
export const register = async (req, res) => {

  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    provider: "local"
  })

  const accessToken = generateAccessToken(user._id)
  const refreshToken = generateRefreshToken(user._id)

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.json({
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan
    }
  })
}



// LOGIN
export const login = async (req, res) => {

  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" })
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return res.status(400).json({ message: "Invalid credentials" })
  }

  const accessToken = generateAccessToken(user._id)
  const refreshToken = generateRefreshToken(user._id)

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.json({
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan
    }
  })
}



// REFRESH TOKEN
export const refresh = (req, res) => {

  const token = req.cookies.refreshToken

  if (!token) return res.status(401).json({ message: "No token" })

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, user) => {

    if (err) return res.status(403).json({ message: "Invalid token" })

    try {
      // Fetch the user from database
      const User = (await import("../models/User.js")).default
      const foundUser = await User.findById(user.userId).select("-password")
      
      if (!foundUser) return res.status(404).json({ message: "User not found" })

      const newAccessToken = generateAccessToken(user.userId)

      res.json({ 
        accessToken: newAccessToken,
        user: {
          email: foundUser.email,
          name: foundUser.name,
          plan: foundUser.plan
        }
      })
    } catch (error) {
      res.status(500).json({ message: "Server error" })
    }

  })
}



// GOOGLE LOGIN
export const googleAuth = async (req, res) => {

  try {

    const { token } = req.body

    if (!token) {
      return res.status(400).json({ message: "Google token missing" })
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()

    const email = payload.email
    const googleId = payload.sub
    const name = payload.name
    const picture = payload.picture

    let user = await User.findOne({ email })

    if (!user) {

      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture,
        provider: "google"
      })

    } else {

      if (!user.googleId) {
        user.googleId = googleId
      }

      if (!user.profilePicture) {
        user.profilePicture = picture
      }

      if (!user.name) {
        user.name = name
      }

      await user.save()
    }

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        plan: user.plan
      }
    })

  } catch (error) {

    console.error(error)

    res.status(401).json({
      message: "Google authentication failed"
    })

  }

}



// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("refreshToken")
  res.json({ message: "Logged out" })
}


// SUBSCRIBE - Update user plan
export const subscribe = async (req, res) => {
  try {
    const { plan, email } = req.body

    if (!email || !plan) {
      return res.status(400).json({ message: "Email and plan are required" })
    }

    const validPlans = ["Starter", "Growth", "Enterprise"]
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.plan = plan
    await user.save()

    res.json({
      message: "Plan updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}