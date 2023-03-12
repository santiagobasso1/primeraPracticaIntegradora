import { ManagerMongoDB } from "../../../db/mongoDBManager.js";
import { Schema } from "mongoose";

const url = process.env.URLMONGODB

const cartSchema = new Schema({
    products: {
        type: Array,
        required: true
    }
})

export class ManagerCartMongoDB extends ManagerMongoDB {
    constructor() {
        super(url, "carts", cartSchema)
        //Aqui irian los atributos propios de la clase
    }
    //Aqui irian los metodos propios de la clase
}
