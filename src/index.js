import "dotenv/config"
import express from "express";
import { Server } from "socket.io";
import { getManagerMessages, getManagerProducts} from "./dao/daoManager.js";
import { __dirname, __filename } from "./path.js";
import routerSocket from "./routes/socket.routes.js";
import routerProduct from "./routes/products.routes.js";
import routerCart from "./routes/cart.routes.js";
import { engine } from 'express-handlebars';
import * as path from 'path'
import routerChat from "./routes/chat.routes.js";
import { ProductManager } from "./dao/FileSystem/models/ProductManager.js";
const app = express()

const productManager = new ProductManager("src/dao/FileSystem/Files/products.json");

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
//Messages
const messageData = await getManagerMessages()
const managerMessage = new messageData.ManagerMessageMongoDB();
//Products
const productData = await getManagerProducts()
const managerProduct = new productData.ManagerProductMongoDB();


// //Carts
// const cartData = await getManagerCarts()
// const managerCart = new cartData.ManagerCartMongoDB();


io.on("connection", async (socket) => {
    console.log("Cliente conectado")
    socket.on("message", async (info) => {
            managerMessage.addElements([info]).then(() => {
            managerMessage.getElements().then((mensajes) => {
                socket.emit("allMessages", mensajes)
            })
        })
    })
    managerMessage.getElements().then((mensajes) => {
        socket.emit("allMessages", mensajes)
    })
    managerProduct.getElements().then((products) => {
        socket.emit("getProducts", products)
    })
    socket.on("addProduct", async (info) => {
        //Si se quiere agregar elementos al archivo, colocar "productManager.devolverArrayProductos()" en lugar de [info]
        managerProduct.addElements([info]).then(() => {
            managerProduct.getElements().then((products) => {
            socket.emit("getProducts", products)
        })
    })
    })
    




    
    socket.on("deleteProduct", async id=>{
        managerProduct.deleteElement(id).then(() => {
            managerProduct.getElements().then((products) => {
            socket.emit("getProducts", products)
            })
        })
    })

})

//Routes
app.use('/', routerSocket)
app.use('/chat', routerChat)
app.use('/', express.static(__dirname + '/public'))
app.use('/api/products', routerProduct)
app.use("/api/carts", routerCart)
