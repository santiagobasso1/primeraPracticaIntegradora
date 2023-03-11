import { Router } from "express";

const routerSocket = Router();

routerSocket.get('/', async(req,res) => {
        res.render("index", { 
        titulo: "Desafio 4 Santiago Basso",
      })
  })

export default routerSocket;