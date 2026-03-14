import jwt from "jsonwebtoken"

export const authenticate = (req, res, next) => {

 const authHeader = req.headers.authorization

 if (!authHeader) {
  return res.status(401).json({ message: "No token" })
 }

 const token = authHeader.split(" ")[1]

 jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {

  if (err) return res.status(403).json({ message: "Invalid token" })

  req.user = user
  next()

 })
}