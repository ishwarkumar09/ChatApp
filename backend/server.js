import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from"./routes/message.routes.js"

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
// app.get("/" ,(req,res)=>{
//     res.status(200)
//     .send("<h1>Helloo bhai log</h1>")
// })

app.use(express.json()); //to parse the incoming request with json payloads (from req.body)
app.use(cookieParser());


app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

connectDB()
.then(()=>{
    app.listen(PORT , ()=>console.log(`server is running on the ${PORT} port`))
}).catch((error)=>{
  console.log("Momgo db connection failed !!! ", error.message)
})
