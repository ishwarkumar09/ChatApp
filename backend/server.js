import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from"./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"
import { app, server } from "./socket/socket.js";


dotenv.config();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve()

// app.get("/" ,(req,res)=>{
//     res.status(200)
//     .send("<h1>Helloo bhai log</h1>")
// })

app.use(express.json()); //to parse the incoming request with json payloads (from req.body)
app.use(cookieParser());


app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/user",userRoutes )

app.use(express.static(path.join(__dirname ,"/frontend/dist")))

app.get("" ,(req,res)=>{
  res.sendFile(path.join(__dirname ,"frontend" ,"dist" ,"index.html"))
})

connectDB()
.then(()=>{
    server.listen(PORT , ()=>console.log(`server is running on the ${PORT} port`))
}).catch((error)=>{
  console.log("Momgo db connection failed !!! ", error.message)
})
