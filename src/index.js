import dns from "node:dns"
dns.setServers(["8.8.8.8", "8.8.4.4"])

import dotenv from "dotenv"
dotenv.config()

import { createServer } from "http"
import { Server } from "socket.io"
import connectDB from "./db/index.js"
import { app } from "./app.js"

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: false,
  },
  connectionStateRecovery: {}
})

app.set("io", io)

io.on("connection", (socket) => {
  

  socket.on("join", (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined their room`)

    socket.broadcast.emit("userOnline", { userId })
        console.log(`User ${userId} is online`)

  })

  socket.on("disconnect", () => {
    
    socket.broadcast.emit("userOffline", { userId: socket.userId })
        console.log("User disconnected:", socket.id)
  })
})

connectDB()
  .then(() => {
    httpServer.on("error", (err) => {
      console.log("Error:", err)
      throw err
    })

    httpServer.listen(process.env.PORT || 8000, () => {
      console.log(`Server is listening on port ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.log("MongoDB error:", error)
  })