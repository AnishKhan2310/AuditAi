import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import documentRoutes from "./routes/documentRoutes.js" // <-- Only the route is imported!

dotenv.config()

const app = express()

app.use(cors({
 origin: "http://localhost:5173",
 credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(cookieParser())

connectDB()

app.use("/api/auth", authRoutes)
app.use("/api/documents", documentRoutes) 

app.listen(process.env.PORT, () => {
 console.log("Server running on port " + process.env.PORT)
})

export default app