import "dotenv/config"
import express from "express";
import { Server } from "socket.io";
import { getManagerMessages } from "./dao/daoManager.js";
import { __dirname, __filename } from "./path.js";
import routerSocket from "./routes/socket.routes.js";
import { engine } from 'express-handlebars';
import * as path from 'path'
import routerChat from "./routes/chat.routes.js";
const app = express()



app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

//PUERTO
app.set("port", process.env.PORT || 5000)

const server = app.listen(app.get("port"), () => console.log(`Server on port ${app.get("port")}`))

//Socket.io
const io = new Server(server)
const data = await getManagerMessages()
const managerMessage = new data.ManagerMessageMongoDB();
io.on("connection", async (socket) => {
    console.log("Cliente conectado")
    socket.on("message", async (info) => {
        console.log(info)
            managerMessage.addElements([info]).then(() => {
            managerMessage.getElements().then((mensajes) => {
                console.log(mensajes)
                socket.emit("allMessages", mensajes)
            })
        })
    })
})



//Routes
app.use('/', routerSocket)
app.use('/chat', routerChat)
app.use('/', express.static(__dirname + '/public'))