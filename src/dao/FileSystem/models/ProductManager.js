import fs from "fs";
import { getManagerProducts } from "../../daoManager.js";


class Producto {
    constructor(title, description, price, thumbnail, code, stock,status,category) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.status = status;
        this.category = category;
    }
}


const producto1 = new Producto("Ryzen Threadripper 3990x", "Procesador Gaming gama alta", 490000, ["./img/threadripper3990x.jpg"] , "aaaa", 10,true,"procesadores");
const producto2 = new Producto("Z590 Ultra", "Motherboard Gama Alta", 82000, ["./img/aorusZ590ULTRA.jpg"], "aaab", 256,true,"motherboards");
const producto3 = new Producto("Zenith II Alpha", "Motherboard Gama Alta", 1000000, ["./img/ROGthreadripper.jpg"] , "aaac", 56,true,"motherboards");
const producto4 = new Producto("Rx 5500 xt ASUS", "Grafica Gama Media Alta", 100000, ["./img/rx5500xt.jpg"] , "aaad", 32,true,"tarjetas graficas");
const producto5 = new Producto("I7 4790", "Procesador Gama Media", 82000, ["./img/i7_4790.jpg"], "aaae", 22,true,"procesadores");
const producto6 = new Producto("Z97_Gaming_3", "Motherboard", 24232, ["./img/Z97Gaming3.jpg"] , "aaaf", 253,true,"motherboards");
const producto7 = new Producto("IX570 Plus", "Motherboard", 46200, ["./img/X570plus.jpg"] , "aaag", 56,true,"motherboards");
const producto8 = new Producto("I7 11700K", "Procesador gama alta", 2525234, ["./img/i7_11700k.jpg"] , "aaah", 526,true,"procesadores");
const producto9 = new Producto("RTX 3090 EVGA", "Grafica Gama Alta", 32421, ["./img/rtx3090.jpg"] , "aaai", 32,true,"tarjetas graficas");
const producto10 = new Producto("Ryzen 5 5600", "Procesador Gama Media", 132512,  ["./img/Ryzen_5_5600.jpg"] , "aaaj", 22,true,"procesadores");


export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    checkArchivo = ()=>{
        return fs.existsSync(this.path)       
    }
    crearArchivo = async () => {
        await fs.promises.writeFile(this.path, "[]")
    }
    addProduct = async (newProduct) => {
        let i=0;
        let cantidadCampos=8;
        for (const campo in newProduct){
            i++
        }
        if (i==cantidadCampos){
            if (newProduct.status===true && newProduct.category.length>0 && newProduct.title.length > 0 && newProduct.description.length > 0 && toString(newProduct.price).length > 0  && newProduct.code.length > 0 && toString(newProduct.stock).length > 0) {
                let contenido = await fs.promises.readFile(this.path, "utf-8");
                let arrayProductos = JSON.parse(contenido);
                if (arrayProductos.filter(product => product.code == newProduct.code).length > 0) {
                    return "Ya existe el producto";
                }
                else 
                {
                    let contenido = await fs.promises.readFile(this.path, "utf-8");
                    let aux = JSON.parse(contenido);
                    if (aux.length>0){
                        const idAutoincremental = aux[aux.length-1].id+1; //Esto para que sea incremental dependiendo del ultimo elemento
                        aux.push({ id: idAutoincremental, ...newProduct });
                        await fs.promises.writeFile(this.path, JSON.stringify(aux));
                        return "Producto Agregado"
                    }
                    else{
                        const idAutoincremental = 1;
                        aux.push({ id: idAutoincremental, ...newProduct });
                        await fs.promises.writeFile(this.path, JSON.stringify(aux));
                        return "Producto agregado"
                    }
    
                }
            } else {
                return "No puede tener campos vacios"
            }
        }else{
            return `Falta o sobra al menos 1 campo (deben ser ${cantidadCampos})`
        }
       
    }

    getAllProducts= async()=> {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')  
        let aux = JSON.parse(contenido)
        return aux;   
    }
    updateProduct = async({id, title, description, price, thumbnail, code, stock, status, category})  => {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')  
        let aux = JSON.parse(contenido)
        if(aux.some(product=> product.id === id)) {
            let pos = aux.findIndex(product => product.id === id)
            if (title!=undefined){
                if (title.length>0)
                {
                    aux[pos].title = title;
                }
            }
            if (description!=undefined){
                if (description.length>0)
                {
                    aux[pos].description = description;
                }
            }
            if (price!=undefined){
                if (price.length>0)
                {
                    aux[pos].price = parseFloat(price);
                }
            }
            if (thumbnail!=undefined){
                if (thumbnail.length>0)
                {
                    aux[pos].thumbnail = thumbnail;
                }
            }
            if (aux.some(prod => prod.code==code)){
                return "No puede poner un codigo que ya existe"
            }else if(code!=undefined){
                if (code.length>0)
                {
                    aux[pos].code = code;
                }
            }
            if (stock!=undefined){
                if (stock.length>0)
                {
                    aux[pos].stock = parseInt(stock);
                }
            }        
            if (status!=undefined){
                if (status==false)
                {
                    aux[pos].status = false;
                }else{
                    aux[pos].status = true;
                }
            }
            if (category!=undefined){
                if (category.length>0)
                {
                    aux[pos].category = category;
                }
            }
            
            await fs.promises.writeFile(this.path, JSON.stringify(aux))
            return "Producto actualizado exitosamente";
        } else {
            return  "Producto no encontrado para actualizar"
        }
    
    }
    getProductById= async(id)=> {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')  
        let aux = JSON.parse(contenido)
        if(aux.some(product=> product.id === id)) 
        {
            let pos = aux.findIndex(product => product.id === id)
            return aux[pos];
        }else{
            return null
        }        
    }

    deleteProductById= async(id)=> {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')
        let aux = JSON.parse(contenido)
        if(aux.some(product=> product.id === id)) 
        {
            const arraySinElIdSeleccionado = aux.filter(product => product.id != id);
            await fs.promises.writeFile(this.path, JSON.stringify(arraySinElIdSeleccionado))
            return "Producto eliminado exitosamente";           
        }else{
            return "No se encontró el producto que desea eliminar"
        }        
    }
    devolverArrayProductos = ()=>{
        return [producto1,producto2,producto3,producto4,producto5,producto6,producto7,producto8,producto9]
    }
    cargarArchivo = async () => {
        //tests pedidos y adicionales:
        await this.crearArchivo(); //Es para que si no tiene el array vacio al inicio se lo ponga así evitamos errores, y para asegurarnos que existe el archivo
        await this.addProduct(producto1);
        await this.addProduct(producto2);
        await this.addProduct(producto3);
        await this.addProduct(producto4);
        await this.addProduct(producto5);
        await this.addProduct(producto6);
        await this.addProduct(producto7);
        await this.addProduct(producto8);
        await this.addProduct(producto9);
        await this.addProduct(producto10);

    }

}
// const manager = new ProductManager('../models/products.json');
// const tests = async()=>{
//     await manager.updateProduct({id:1,title:"2",description:"3",price:"4",thumbnail:["5"],code:"6",stock:"7",status:false,category:"9"})
// };

// tests();




// tests()

