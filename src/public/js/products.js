const socket = io()


const form = document.getElementById("realTimeProductsForm")
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const title = document.getElementById("formTitle")
    const description = document.getElementById("formDescription")
    const price = document.getElementById("formPrice")
    const thumbnail = document.getElementById("formThumbnail")
    const code = document.getElementById("formCode")
    const stock = document.getElementById("formStock")
    const category = document.getElementById("formCategory")
    const product = {
        title: title.value,
        description: description.value,
        price: parseFloat(price.value),
        thumbnail: [thumbnail.value],
        code: code.value,
        stock: parseInt(stock.value),
        status: true,
        category:category.value
    }    
    if (title.value.length > 0 && description.value.length > 0 && price.value.length > 0 && thumbnail.value.length > 0 && code.value.length > 0 && stock.value.length > 0 && category.value.length > 0){
        socket.emit("addProduct", product) 
    }else{
        console.log("Falta algún dato por llenar")
    }
})



socket.on("getProducts", products =>{

    document.getElementById("productsCard").innerHTML=""

    products.forEach(product => {
        document.getElementById("productsCard").innerHTML+=  
        `
        <div class="card col-sm-2 cardProduct">
        <img class="card-img-top imagenCardProducts" src="${product.thumbnail}" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description} </p>
            <p class="card-text">Precio: ${product.price} </p>       
            <p class="card-text">Stock: ${product.stock} </p>   
            <p class="card-text">Code: ${product.code} </p>                                               
            <a id="botonProducto${product._id}" class="btn btn-primary">Eliminar</a>
        </div>
        `
    })


    products.forEach(product=>{
        document.getElementById(`botonProducto${product._id}`).addEventListener("click",(e)=>{
            socket.emit("deleteProduct", product._id) 
            socket.on("mensajeProductoEliminado",mensaje=>{
                console.log(mensaje) //Para mostrarle al cliente el mensaje
            })
        })
    })
})
