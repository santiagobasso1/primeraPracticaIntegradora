import { Router } from "express";
import {ProductManager} from "../controllers/ProductManager.js"

const routerSocket = Router();
const productManager = new ProductManager('src/dao/FileSystem/models/products.json');


  routerSocket.get('/', async(req,res) => {
    const productos = await productManager.getAllProducts()
        res.render("index", { 
        titulo: "Primera practica Integradora",
        products: productos
      })
  })


  routerSocket.get('/realtimeproducts', async(req,res) => {
    
    const products = await productManager.getAllProducts()
    res.render("realTimeProducts", { 
        titulo: "Practica Integradora Real Time Products",
        products: products
    })
  })
  

export default routerSocket;