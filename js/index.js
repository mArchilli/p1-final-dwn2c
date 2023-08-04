'use strict';

/**
 * ARCHILLI, MATIAS
 * SANCHEZ LIPORACE, ANDREA
*/

let aCatalogo = [];
let aCarrito = [];
let aCategorias = [];
let aPublicidades = [];
let precioTotal = 0;
let contadorProductos = 0;
let cuotas = 1;
let precioEnCuotas = precioTotal;

/** 
 * Mostramos el catalogo en l aprimer vista del sitio
 * Buscamos la etiqueta section del HTML con el ID "contenedorProductos", section donde mostraremos la estructura creada con DOM para cada articulo de aCatalogo.
*/
fetch("js/productos.json").then(response => response.json()).then(jsonCatalogo => {

    jsonCatalogo.forEach(productoJson => {

    let nuevoProducto = new producto(
        productoJson.nombre,
        productoJson.imagen,
        productoJson.altImagen,
        productoJson.id,
        productoJson.categoria,
        productoJson.precio,
        productoJson.descripcion,
    );

    aCatalogo.push(nuevoProducto);

    }); 

    /** 
     * Con un for of, se recorre cada objeto en aProductos.
     * Se agrega el artículo del producto al elemento del DOM con el ID "contenedorProductos".
    */
    for (const producto of aCatalogo) {
        sectionPrincipal.append(producto.mostrarProducto());
    } 

});

fetch("js/publicidades.json").then(response => response.json()).then(jsonPublicidades => {

    jsonPublicidades.forEach(publicidadJson => {

    let nuevaPublicidad = new publicidad(
        publicidadJson.nombre,
        publicidadJson.imagenMobile,
        publicidadJson.imagenTablet,
        publicidadJson.imagenPC,
        publicidadJson.altImagen,
        publicidadJson.id,
    );

    aPublicidades.push(nuevaPublicidad);

    }); 

});


let divPublicidad = document.getElementById("publicidad");

let btnPublicidad = document.createElement("button");
btnPublicidad.addEventListener('click', () => {
    verPublicidades();
});

let sectionPrincipal = document.getElementById("contenedorProductos");

let divMiniCarrito = document.getElementById("minicarrito");

let divDetalleCarrito = document.createElement("div");
divDetalleCarrito.classList.add("detalleCarrito");

//LOCAL STORAGE

let localStorageItems;

let pItemsAgregados = document.createElement("p");
pItemsAgregados.innerText = "ítems agregados ";
let spanItemsAgregados = document.createElement("span");
spanItemsAgregados.setAttribute("id","itemsCarrito");

if(localStorage.getItem("itemsCarrito")){
    localStorageItems = localStorage.getItem("itemsCarrito");
    contadorProductos = parseInt(localStorageItems);
    spanItemsAgregados.innerText = parseInt(localStorageItems);
}else{
    spanItemsAgregados.innerText = " 0";
}
pItemsAgregados.append(spanItemsAgregados);

let localStorageTotalPagar;

let pTotalPagar = document.createElement("p");
pTotalPagar.innerText = "es el total ";
let spanTotalPagar = document.createElement("span");
spanTotalPagar.setAttribute("id","totalPagar");

if(localStorage.getItem("totalPagar")){
    localStorageTotalPagar =  localStorage.getItem("totalPagar");
    console.log(parseFloat(localStorageTotalPagar));
    precioTotal = parseFloat(localStorageTotalPagar);
    spanTotalPagar.innerText = mostrarPrecioEnPesos(parseFloat(localStorageTotalPagar));
}else{
    precioTotal = 0;
    spanTotalPagar.innerText = " 0"; 
}

let localStorageCarrito;

if(localStorage.getItem("aCarrito")){
    localStorageCarrito = localStorage.getItem("aCarrito");
    
    for (const productoLocalStorage of JSON.parse(localStorageCarrito)) {
        let nuevoProducto = new producto(
            productoLocalStorage.nombre,
            productoLocalStorage.imagen,
            productoLocalStorage.altImagen,
            productoLocalStorage.id,
            productoLocalStorage.categoria,
            productoLocalStorage.precio,
            productoLocalStorage.descripcion,
            productoLocalStorage.cantidad,
        );
        aCarrito.push(nuevoProducto);
    }
}else{
    aCarrito = [];
}

//LOCAL STORAGE

pTotalPagar.append(spanTotalPagar);

let btnVerCarrito = document.createElement("button");
btnVerCarrito.setAttribute("id","btnVerCarrito");
btnVerCarrito.innerText = "Ver carrito";
btnVerCarrito.addEventListener("click", () => {
    verCarrito();
})

divDetalleCarrito.append(pItemsAgregados,pTotalPagar,btnVerCarrito);

let divFiltros = document.createElement("div");
divFiltros.classList.add("filtros");

let pFiltro = document.createElement("p");
pFiltro.innerText = "Filtrar por";

let btnFiltroLapices = document.createElement("button");
btnFiltroLapices.innerText = "Lápices";
btnFiltroLapices.addEventListener("click", () => {
    filtrarPorCategoria('Lápices');
})

let btnFiltroOleos = document.createElement("button");
btnFiltroOleos.innerText = "Óleos";
btnFiltroOleos.addEventListener("click", () => {
    filtrarPorCategoria('Óleos');
})

let btnFiltroPasteles = document.createElement("button");
btnFiltroPasteles.innerText = "Pasteles";
btnFiltroPasteles.addEventListener("click", () => {
    filtrarPorCategoria('Pasteles');
})

divFiltros.append(pFiltro,btnFiltroLapices,btnFiltroOleos,btnFiltroPasteles);

divMiniCarrito.append(divDetalleCarrito, divFiltros);


/**
 * Filtra los productos por una categoría específica y muestra los resultados en la página.
 * @param {string} categoriaElegida - La categoría por la cual filtrar los productos.
 */
function filtrarPorCategoria(categoriaElegida) {
    // Limpiamos la section de productos
    sectionPrincipal.innerHTML = "";

    divPublicidad.innerHTML = "";

    
    
    btnPublicidad.innerHTML = "";

    let numeroAleatorio = Math.ceil(Math.random() * 4);
    console.log(numeroAleatorio);

    for (const publicidad of aPublicidades) {
        if(publicidad.getId() == numeroAleatorio){
            btnPublicidad.append(publicidad.mostrarPublicidad());
            divPublicidad.append(btnPublicidad);  
            setTimeout(function() { btnPublicidad.innerHTML = "";}, 10000); 
        }
    }
    
    // Creamos un array para guardar los productos filtrados e indicamos como realizar el filtro por categoría
    let aCatalogoFiltrado = aCatalogo.filter((producto) => producto.getCategoria().includes(categoriaElegida));

    // Buscamos el div donde se encuentran los botones para filtrar la categoria
    let divFiltros = document.querySelector('.filtros');
    // Guardamos en una variable el boton EliminarFiltro
    let buttonEliminarFiltro = document.querySelector('.btn-eliminar');

    // Analizamos si ya hay un boton EliminarFiltro y lo eliminamos antes de agregar uno nuevo
    if (buttonEliminarFiltro) {
        buttonEliminarFiltro.remove();
    }

    // Creamos un botón para eliminar el filtro aplicado por el cliente
    buttonEliminarFiltro = document.createElement("button");
    buttonEliminarFiltro.innerText = 'Eliminar filtro';
    buttonEliminarFiltro.classList.add("btn-eliminar");
    buttonEliminarFiltro.addEventListener('click', () => {
        // Quitamos el botón directamente del divFiltros
        divFiltros.removeChild(buttonEliminarFiltro); 
        // Limpiamos la sección de productos
        sectionPrincipal.innerHTML = "";
        divPublicidad.innerHTML = "";
        // Recorro aCatalogo para mostrar el catalogo completo nuevamente
        for (const producto of aCatalogo) {
            sectionPrincipal.append(producto.mostrarProducto());
        }
    });
    
    // Appendeo el boton EliminarFiltro al divFiltros
    divFiltros.append(buttonEliminarFiltro);
    // Recorro arrayFiltrado para mostrar los productos filtrados
    for (const producto of aCatalogoFiltrado) {
        sectionPrincipal.append(producto.mostrarProducto());
    }
}

/**
 * CARRITO *
*/
/** 
 * aCarrito: Lo uso para almacenar los productos que el cliente desea agregar a su carrito de compras.
*/
/**
 * Agrega un producto al carrito.
 * @param {Object} producto - El producto que se va a agregar al carrito.
*/
function agregarAlCarrito(producto){
    let itemCarrito = document.querySelector("#itemsCarrito");
    let precioFinal = document.querySelector("#totalPagar");
    let itemCarritoModal = document.querySelector("#pCantProductosModal");
    let precioFinalModal = document.querySelector("#pPrecioTotalModal");

    precioTotal += producto.getPrecio();
    if (aCarrito.length == 0) {
        producto.cantidad = 1;

        aCarrito.push(producto);
    } else {
        let productoExistente = false;
        for (let i = 0; i < aCarrito.length; i++) {
            if (aCarrito[i].getId() == producto.getId()) {
                aCarrito[i].cantidad += 1;
                productoExistente = true;
                break;
            }
        }
        if (!productoExistente) {
            producto.cantidad = 1;
            aCarrito.push(producto);
        }
    }

    contadorProductos++;
    if(itemCarritoModal || precioFinalModal != null){
        itemCarritoModal.innerText = "Cantidad de productos: " + contadorProductos;
        precioFinalModal.innerText = "Total a pagar: " + mostrarPrecioEnPesos(parseFloat(precioTotal));
    }
    itemCarrito.innerText = contadorProductos;
    precioFinal.innerText = mostrarPrecioEnPesos(parseFloat(precioTotal));

    localStorage.setItem("itemsCarrito", contadorProductos);
    localStorage.setItem("totalPagar", precioTotal);
    localStorage.setItem("aCarrito", JSON.stringify(aCarrito));
}

/**
 * Elimina un producto del carrito de compras.
 * @param {Producto} producto - El producto a eliminar.
 * @param {number} indice - El índice del producto en el carrito.
*/
function eliminarDelCarrito(producto, contenedorProducto, indice){
    let itemCarrito = document.querySelector("#itemsCarrito");
    let precioFinal = document.querySelector("#totalPagar");
    let itemCarritoModal = document.querySelector("#pCantProductosModal");
    let precioFinalModal = document.querySelector("#pPrecioTotalModal");

    console.log('precio sin convertir:' + precioTotal);
    parseFloat(precioTotal);
    console.log(precioTotal);

    if(producto.cantidad > 1){
        precioTotal -= producto.getPrecio();
        console.log(precioTotal);
        for (let i = 0; i < aCarrito.length; i++) {
            if (aCarrito[i].getId() == producto.getId()) {
                aCarrito[i].cantidad -= 1;
                break;
            }
        }
    } else {
        precioTotal -= producto.precio;
        aCarrito.splice(indice, 1);
        contenedorProducto.remove();
    }

    contadorProductos--;
        if(itemCarritoModal || precioFinalModal != null){
            itemCarritoModal.innerText = "Cantidad de productos: " + contadorProductos;
            precioFinalModal.innerText = "Total a pagar: " + mostrarPrecioEnPesos(parseFloat(precioTotal));
        }
        itemCarrito.innerText = contadorProductos;
        precioFinal.innerText = mostrarPrecioEnPesos(parseFloat(precioTotal));

        localStorage.setItem("itemsCarrito", contadorProductos);
        localStorage.setItem("totalPagar", precioTotal);
        localStorage.setItem("aCarrito", JSON.stringify(aCarrito));
}

/**
 * Muestra el carrito de compras en una ventana modal.
 * @returns {Element} El elemento HTML que contiene los productos del carrito.
 * Se crea la siguiente estructura:
 * <div class="modalCarrito">
 *      <a href="javascript:void(0)"></a>
 *      <h3>Mi Carrito</h3>
 *          <div class="productosCarrito">Ejecuta el metodo producto.mostrarMiniProducto()</div>
 *          <div class="totalesCarrito">
 *              <p>Total a Pagar: pPrecioTotalModal</p>
 *              <p>Cantidad de productos: contadorProductos</p>
 *          </div>
 *          <div class="botonesCarrito">
 *              <button>Iniciar compra</button>
 *              <button>Vaciar carrito</button>
 *          </div>
 * </div>
*/
function verCarrito () {
    let modalDetalle = document.querySelector("#modalProducto");
    let modalCarrito = document.querySelector("#modalCarrito");
    if(modalDetalle){
        modalDetalle.remove();
    }
    if (modalCarrito) {
        modalCarrito.remove();
    }

    modalCarrito = document.createElement("div");
    modalCarrito.classList.add("modalCarrito");
    modalCarrito.setAttribute("id", "modalCarrito");
        const aCerrar = document.createElement("a");
        aCerrar.setAttribute("href", "javascript:void(0)");
        aCerrar.innerText = "X";
        aCerrar.addEventListener('click', () => {
            let cerrar = document.querySelector("#modalCarrito");
            cerrar.remove();
        });
        let h3Carrito = document.createElement("h3");
            h3Carrito.innerText = "Mi Carrito";

        let totalesCarrito = document.createElement("div");
            totalesCarrito.classList.add("totalesCarrito");

            let pPrecioTotal = document.createElement("p");
                pPrecioTotal.setAttribute('id','pPrecioTotalModal');
                if(localStorage.getItem("totalPagar")){
                    localStorageTotalPagar =  localStorage.getItem("totalPagar");
                    pPrecioTotal.innerText = "Total a pagar: " + mostrarPrecioEnPesos(parseFloat(localStorageTotalPagar));
                }else{
                    pPrecioTotal.innerText = "Total a pagar: 0"; 
                }

            let pCantProductos = document.createElement("p");
                pCantProductos.setAttribute('id','pCantProductosModal');
                if(localStorage.getItem("itemsCarrito")){
                    localStorageItems = localStorage.getItem("itemsCarrito");
                    pCantProductos.innerText = "Cantidad de productos: " + parseInt(localStorageItems);
                }else{
                    pCantProductos.innerText = "0"; 
                }
                
            let divProductosCarrito = document.createElement("div");
                divProductosCarrito.classList.add("productosCarrito");
                for (const producto of aCarrito) {
                        divProductosCarrito.append(producto.mostrarMiniProducto());
                }

        let botonesCarrito = document.createElement("div");
            botonesCarrito.classList.add("botonesCarrito");
            let buttonVaciar = document.createElement("button");
                buttonVaciar.innerText = "Vaciar carrito";
                buttonVaciar.classList.add("btn-vaciarCarrito");
                buttonVaciar.addEventListener('click', () => {
                    aCarrito = [];
                    precioTotal = 0;
                    contadorProductos = 0;
                    divProductosCarrito.innerHTML = "";
                    pPrecioTotal.innerText = "Total a pagar: " + precioTotal;
                    pCantProductos.innerText = "Cantidad de productos: " + contadorProductos;

                    let itemCarrito = document.querySelector("#itemsCarrito");
                    let precioFinal = document.querySelector("#totalPagar");
                    precioFinal.innerText = precioTotal;
                    itemCarrito.innerText = contadorProductos;

                    localStorage.setItem("itemsCarrito", contadorProductos);
                    localStorage.setItem("totalPagar", precioTotal);
                    localStorage.setItem("aCarrito", JSON.stringify(aCarrito));
                });
            let buttonComprar = document.createElement("button");
                buttonComprar.innerText = "Iniciar Compra";
                buttonComprar.classList.add("btn-compra");
                buttonComprar.addEventListener('click', () => {
                    realizarCompra();
                });
    
    totalesCarrito.append(pPrecioTotal, pCantProductos)
    botonesCarrito.append(buttonComprar, buttonVaciar)
    modalCarrito.append(aCerrar, h3Carrito, divProductosCarrito, totalesCarrito, botonesCarrito);

    // Traemos el div que esta al mismo nivel de la seccion de productos
    const sectionProductos = document.querySelector("#contenedorProductos");
    sectionProductos.parentNode.appendChild(modalCarrito);
    return sectionProductos;
}

/**
 * Muestra un modal con form de compra.
 * @returns {Element} Una ventana modal con el form de compra
*/
function realizarCompra() {
    cuotas = 1;
    
    let modalDetalle = document.querySelector("#modalProducto");
    let modalCarrito = document.querySelector("#modalCarrito");
    if(modalDetalle){
        modalDetalle.remove();
    }
    if (modalCarrito) {
        modalCarrito.remove();
    }

    if(aCarrito.length > 0){
    
    let modalCompra = document.createElement("div");
        modalCompra.classList.add("modalCompra");
        modalCompra.setAttribute("id", "modalCompra");

    let aCerrar = document.createElement("a");
        aCerrar.setAttribute("href", "javascript:void(0)");
        aCerrar.innerText = "X";
        aCerrar.addEventListener('click', () => {
            let cerrar = document.querySelector("#modalCompra");
            cerrar.remove();
        });

    let h3Compra = document.createElement("h3");
        h3Compra.innerText = "Finalizar compra";

    let pCompra1 = document.createElement("p");
        pCompra1.innerText = "Completá el formulario con los tus datos y con los datos del medio de pago que utilizarás";

    let formCompra = document.createElement("form");
        formCompra.setAttribute("id","formularioCompra");

    let fieldsetCliente = document.createElement("fieldset");
    let legendCliente = document.createElement("legend");
        legendCliente.innerText = "Tus datos: ";

    let spanNombreCompleto = document.createElement("span");
        spanNombreCompleto.innerText = "Nombre completo";

    let inputNombreCompleto = document.createElement("input");
        inputNombreCompleto.setAttribute("type", "text");
        inputNombreCompleto.setAttribute("placeholder", "Ingrese su nombre y apellido");
        inputNombreCompleto.setAttribute("required", "true");

    let spanDireccion = document.createElement("span");
        spanDireccion.innerText = "Direccion completa de entrega";

    let inputDireccion = document.createElement("input");
        inputDireccion.setAttribute("type", "text");
        inputDireccion.setAttribute("placeholder", "Ingrese la direccion de entrega");
        inputDireccion.setAttribute("required", "true");

    let spanTelefono = document.createElement("span");
        spanTelefono.innerText = "Telefono";
    
    let inputTelefono = document.createElement("input");
        inputTelefono.setAttribute("type", "number");
        inputTelefono.setAttribute("placeholder", "Ingrese su telefono");
        inputTelefono.setAttribute("required", "true");
        inputTelefono.setAttribute("minlength", 7);
        
    let spanFecha = document.createElement("span");
        spanFecha.innerText = "Indique una fecha de entrega a partir de mañana";

    // Obtener el año actual
    const añoActual = new Date().getFullYear();
    const fechaActual = new Date().getDate() + 1;
    const mesActual = new Date().getMonth() + 1;
    
    let inputFecha = document.createElement("input");
        inputFecha.setAttribute("type", "date");
        inputFecha.setAttribute("required", "true");
        // Establecer el atributo "min" para limitar el año de partida
        inputFecha.setAttribute('min', `${añoActual}-${mesActual.toString().padStart(2, '0')}-${fechaActual.toString().padStart(2, '0')}`);

    fieldsetCliente.append(legendCliente, spanNombreCompleto, inputNombreCompleto, spanDireccion, inputDireccion, spanTelefono, inputTelefono, spanFecha, inputFecha);

    let fieldsetMetodoPago = document.createElement("fieldset");
    let legendMetodoPago = document.createElement("legend");
        legendMetodoPago.innerText = "Metodo de pago: ";

    let divTipoTarjetas = document.createElement("div");
        divTipoTarjetas.classList.add("divTipoTarjetas");
    let inputTarjetaDebito = document.createElement("input");
        inputTarjetaDebito.classList.add("radioInput");
        inputTarjetaDebito.setAttribute('type', "radio");
        inputTarjetaDebito.setAttribute('id', "radioDebito");
        inputTarjetaDebito.setAttribute('name', "radioPago");
        inputTarjetaDebito.setAttribute('value', "debito");
    let labelTarjetaDebito = document.createElement("label");
        labelTarjetaDebito.setAttribute("for", "radioDebito");
        labelTarjetaDebito.innerText = "Tarjeta de Débito";

    let divInfoTarjetas = document.createElement("div");
        divInfoTarjetas.classList.add("divInfoTarjetas");
    let inputTarjetaCredito = document.createElement("input");
        inputTarjetaCredito.classList.add("radioInput");
        inputTarjetaCredito.setAttribute('type', "radio");
        inputTarjetaCredito.setAttribute('id', "radioCredito");
        inputTarjetaCredito.setAttribute('name', "radioPago");
        inputTarjetaCredito.setAttribute('value', "credito");

    let labelTarjetaCredito = document.createElement("label");
        labelTarjetaCredito.setAttribute("for", "radioCredito");
        labelTarjetaCredito.innerText = "Tarjeta de Crédito";

    let spanNombre = document.createElement("span");
        spanNombre.innerText = "Nombre completo";

    let inputNombre = document.createElement("input");
        inputNombre.setAttribute("type", "text");
        inputNombre.setAttribute("placeholder", "Ingrese el nombre que figura en la tarjeta");
        inputNombre.setAttribute("required", "true");
        
    let spanNumeroTarjeta = document.createElement("span");
        spanNumeroTarjeta.innerText = "Numero de tarjeta";
    
    let inputNumeroTarjeta = document.createElement("input");
        inputNumeroTarjeta.setAttribute("type", "number");
        inputNumeroTarjeta.setAttribute("placeholder", "Ingrese el numero de la tarjeta");
        inputNumeroTarjeta.setAttribute("required", "true");  
        inputNumeroTarjeta.setAttribute("minlength", 1);
        inputNumeroTarjeta.setAttribute("maxlength", 16);

    let spanFechaVencimiento = document.createElement("span");
        spanFechaVencimiento.innerText = "Fecha de vencimiento";

    let inputFechaVencimiento = document.createElement("input");
        inputFechaVencimiento.setAttribute("type", "text");
        inputFechaVencimiento.setAttribute("placeholder", "MM/YY");
        inputFechaVencimiento.setAttribute("required", "true");  

    let spanCodigoSeguridad = document.createElement("span");
        spanCodigoSeguridad.innerText = "Codigo de seguridad";
    
    let inputCodigoSeguridad = document.createElement("input");
        inputCodigoSeguridad.setAttribute("type", "number");
        inputCodigoSeguridad.setAttribute("placeholder", "Ingrese el codigo de seguridad");
        inputCodigoSeguridad.setAttribute("required", "true");  
        inputCodigoSeguridad.setAttribute("minlength", 3);
        inputCodigoSeguridad.setAttribute("maxlength", 4);


    let divCuotas = document.createElement("div");
    divCuotas.classList.add("divCuotas");
    let spanCuotas = document.createElement("span");
        spanCuotas.innerText = "¿En cuántas cuotas pagarás?";

    precioEnCuotas = precioTotal;

    let precioCuotas = document.createElement("p");
        precioCuotas.innerText = "Total a pagar por cuota: ";

    let spanPrecioFinalCuotas = document.createElement("span");
        spanPrecioFinalCuotas.innerText = mostrarPrecioEnPesos(parseFloat(precioEnCuotas));

    let selectCuotas = document.createElement("select");
        selectCuotas.setAttribute("name","Cuotas");
        selectCuotas.setAttribute("id","cantCuotas");
        selectCuotas.addEventListener("change", () => {
            cuotas = selectCuotas.value;
            precioEnCuotas = precioTotal / cuotas;
            spanPrecioFinalCuotas.innerText = mostrarPrecioEnPesos(parseFloat(precioEnCuotas));
        });
    
    let optionDefault = document.createElement("option");
        optionDefault.setAttribute("value", "1");
        optionDefault.innerText = "Pagar en 1 cuota";
    
    let option3ctas = document.createElement("option");
        option3ctas.setAttribute("value", "3");
        option3ctas.innerText = "Pagar en 3 cuotas";
    
    let option6ctas = document.createElement("option");
        option6ctas.setAttribute("value", "6");
        option6ctas.innerText = "Pagar en 6 cuotas";

    let option9ctas = document.createElement("option");
        option9ctas.setAttribute("value", "9");
        option9ctas.innerText = "Pagar en 9 cuotas";
    
    let option12ctas = document.createElement("option");
        option12ctas.setAttribute("value", "12");
        option12ctas.innerText = "Pagar en 12 cuotas";

    selectCuotas.append(optionDefault, option3ctas, option6ctas, option9ctas, option12ctas);

    let buttonComprar = document.createElement("button");
        buttonComprar.setAttribute("type", "submit");
        buttonComprar.innerText = "Comprar";
        buttonComprar.classList.add("btn-finCompra");

    inputNombreCompleto.addEventListener("input", (e) => {
            e.target.setCustomValidity("");
          });

    inputNombre.addEventListener("input", (e) => {
            e.target.setCustomValidity("");
          });

    inputNumeroTarjeta.addEventListener("input", (e) => {
        e.target.setCustomValidity("");
        }); 

    inputCodigoSeguridad.addEventListener("input", (e) => {
        e.target.setCustomValidity("");
        }); 
    
    inputFechaVencimiento.addEventListener("input", (e) => {
        e.target.setCustomValidity("");
        }); 

    inputTelefono.addEventListener("input", (e) => {
        e.target.setCustomValidity("");
        });

    formCompra.addEventListener('submit', (e) => {
        e.preventDefault();

        validarForm();

    });

    window.addEventListener("keydown", (e) => {
  
        if(e.key == 'Enter')
        {
         let formCompra = document.querySelector("#formularioCompra");
          if(formCompra){
            validarForm();
          }
        }
     })

    function validarForm() {
        const regexNombreCompleto = new RegExp('^[A-Z]+$', 'i');

        const regexNombreTarjeta = new RegExp('^[A-Z]+$');

        const regexNumeroTarjeta = new RegExp('^\\d{16}$');

        const regexCodigoSeguridadMin = new RegExp('^\\d{3}$');

        const regexCodigoSeguridadMax = new RegExp('^\\d{4}$');

        const regexFechaVencimiento = new RegExp ('^(0[1-9]|1[012])\\/\\d{2}$');

        const regexTelefono = new RegExp('^\\d{7,20}$');

        if (!(inputNombreCompleto.value.trim())){
            console.log("ENTRE AL IF CAMPO VACIO - NOMBRE COMPLETO");
            inputNombreCompleto.setCustomValidity("Campo vacio");
            inputNombreCompleto.reportValidity();
        } else if(!regexNombreCompleto.test(inputNombreCompleto.value.trim())){
            console.log("ENTRE AL IF SOLO LETRAS - NOMBRE COMPLETO");
            inputNombreCompleto.setCustomValidity("Campo solo letras");
            inputNombreCompleto.reportValidity();
        } else if (!(inputNombre.value.trim())){
            console.log("ENTRE AL IF CAMPO VACIO - NOMBRE TARJETA");
            inputNombre.setCustomValidity("Campo vacio");
            inputNombre.reportValidity();
        } else if(!regexNombreTarjeta.test(inputNombre.value.trim())){
            console.log("ENTRE AL IF SOLO LETRAS - NOMBRE TARJETA");
            inputNombre.setCustomValidity("Campo solo mayusculas");
            inputNombre.reportValidity();
        } else if (!(inputNumeroTarjeta.value.trim())) {
            inputNumeroTarjeta.setCustomValidity("Campo vacio");
            inputNumeroTarjeta.reportValidity();
        } else if (!regexNumeroTarjeta.test(inputNumeroTarjeta.value)) {
            inputNumeroTarjeta.setCustomValidity("El campo acepta como minimo y maximo 16 números");
            inputNumeroTarjeta.reportValidity();
        } else if (!regexCodigoSeguridadMin.test(inputCodigoSeguridad.value) && !regexCodigoSeguridadMax.test(inputCodigoSeguridad.value)){
            inputCodigoSeguridad.setCustomValidity("El campo acepta de 3 a 4 números");
            inputCodigoSeguridad.reportValidity();
        } else if (!regexFechaVencimiento.test(inputFechaVencimiento.value)) {
            inputFechaVencimiento.setCustomValidity("Ingrese dos números para el mes y dos para el año separados por /");
            inputFechaVencimiento.reportValidity();
        }
        else if (!regexTelefono.test(inputTelefono.value)){
            inputTelefono.setCustomValidity("Ingrese un numero de telefono valido, sin guiones ni espacios");
            inputTelefono.reportValidity();
        } else {
            compraRealizada();
        }
    }

    divTipoTarjetas.append(inputTarjetaDebito, labelTarjetaDebito, inputTarjetaCredito, labelTarjetaCredito);
    divInfoTarjetas.append(spanNombre, inputNombre, spanNumeroTarjeta, inputNumeroTarjeta, spanFechaVencimiento, inputFechaVencimiento, spanCodigoSeguridad, inputCodigoSeguridad);
    divCuotas.append(spanCuotas, selectCuotas, precioCuotas, spanPrecioFinalCuotas);  
    fieldsetMetodoPago.append(legendMetodoPago, divTipoTarjetas, divInfoTarjetas, divCuotas);

    formCompra.append(fieldsetCliente, fieldsetMetodoPago, buttonComprar);

    modalCompra.append(aCerrar, h3Compra, pCompra1, formCompra);
    // Traemos el div que esta al mismo nivel de la seccion de productos
    // No termino de darme cuenta como crear un hijo de la modal carrito
    let sectionProductos = document.querySelector("#contenedorProductos");
        sectionProductos.parentNode.appendChild(modalCompra);
    return sectionProductos;
    } else {
        let modalCompra = document.createElement("div");
            modalCompra.classList.add("modalCompra");
            modalCompra.setAttribute("id", "modalCompra");

        let aCerrar = document.createElement("a");
            aCerrar.setAttribute("href", "javascript:void(0)");
            aCerrar.innerText = "X";
            aCerrar.addEventListener('click', () => {
                let cerrar = document.querySelector("#modalCompra");
                cerrar.remove();
            });

        let pCompra = document.createElement("p");
            pCompra.innerText = "Para iniciar una compra debe agregar productos al carrito";

        let buttonVolver = document.createElement("Button");
            buttonVolver.classList.add("btnVolver");
            buttonVolver.setAttribute("href", "javascript:void(0)");
            buttonVolver.innerText = "Volver al catalogo";
            buttonVolver.addEventListener('click', () => {
                let cerrar = document.querySelector("#modalCompra");
                cerrar.remove();
            });

        modalCompra.append(aCerrar, pCompra, buttonVolver);
        let sectionProductos = document.querySelector("#contenedorProductos");
        sectionProductos.parentNode.appendChild(modalCompra);
        return sectionProductos;
    }
}

/**
 * Muestra un modal de confirmación de compra.
 * @returns {Element} Una ventana modal con un mensaje de compra exitosa
*/
function compraRealizada(){
    let modalDetalle = document.querySelector("#modalProducto");
    let modalCarrito = document.querySelector("#modalCarrito");
    let modalCompra = document.querySelector("#modalCompra");
    if(modalDetalle){
        modalDetalle.remove();
    }
    if (modalCarrito) {
        modalCarrito.remove();
    }
    if (modalCompra) {
        modalCompra.remove();
    }

    let modalCompraRealizada = document.createElement("div");
        modalCompraRealizada.classList.add("modalCompraRealizada");
        modalCompraRealizada.setAttribute("id", "modalCompraRealizada");

    let h3CompraRealizada = document.createElement("h3");
        h3CompraRealizada.innerText = "Compra Exitosa";

    let pCompraRealizada1 = document.createElement("h4");
        pCompraRealizada1.innerText = "Tu transacción se realizó con éxito";

    let pCompraRealizada2 = document.createElement("h5");
        pCompraRealizada2.innerText = "Acabas de adquirir los siguientes productos:";

    let divProductosCarrito = document.createElement("div");
        divProductosCarrito.classList.add("productosCarrito");
        for (const producto of aCarrito) {
                divProductosCarrito.append(producto.productoResumenCompra());
        }

    let pCantProductos = document.createElement("p");
        pCantProductos.setAttribute('id','pCantProductosModal');
        pCantProductos.innerText = "Cantidad de productos: " + parseInt(contadorProductos);

    // let pPrecioTotal = document.createElement("p");
    //     pPrecioTotal.setAttribute('id','pPrecioTotalModal');
    //     pPrecioTotal.innerText = "Total a pagar: " + mostrarPrecioEnPesos(parseFloat(precioTotal));

    let pCantCuotas = document.createElement("p");
    pCantCuotas.innerText = `Total cuotas: ${cuotas}`;

    let pPrecioEnCuotas = document.createElement("p");
    pPrecioEnCuotas.innerText = `Precio de cada cuota: ${mostrarPrecioEnPesos(parseFloat(precioEnCuotas))}`;

    let pCompraRealizada3 = document.createElement("p");
        pCompraRealizada3.innerText = "¡¡Gracias por elegirnos!!";

    let buttonVolver = document.createElement("Button");
        buttonVolver.classList.add("btnVolver");
        buttonVolver.setAttribute("href", "javascript:void(0)");
        buttonVolver.innerText = "Volver al catalogo";
        buttonVolver.addEventListener('click', () => {
            let cerrar = document.querySelector("#modalCompraRealizada");
            
            aCarrito = [];
            precioTotal = 0;
            contadorProductos = 0;

            let itemCarrito = document.querySelector("#itemsCarrito");
            let precioFinal = document.querySelector("#totalPagar");

            precioFinal.innerText = precioTotal;
            itemCarrito.innerText = contadorProductos;

            localStorage.setItem("itemsCarrito", contadorProductos);
            localStorage.setItem("totalPagar", precioTotal);
            localStorage.setItem("aCarrito", JSON.stringify(aCarrito));

            cerrar.remove();
        });

    modalCompraRealizada.append(h3CompraRealizada, pCompraRealizada1, pCompraRealizada2, divProductosCarrito, pCantCuotas, pPrecioEnCuotas, pCantProductos, pCompraRealizada3, buttonVolver);
    // Traemos el div que esta al mismo nivel de la seccion de productos
    // No termino de darme cuenta como crear un hijo de la modal carrito
    let sectionProductos = document.querySelector("#contenedorProductos");
        sectionProductos.parentNode.appendChild(modalCompraRealizada);
    return sectionProductos;
}

/**
     * Mostrar todas las publicidadades juntas en una modal.
    */
function verPublicidades() {
    let modalDetalle = document.querySelector("#modalProducto");
    let modalCarrito = document.querySelector("#modalCarrito");
    let modalCompra = document.querySelector("#modalCompra");
    if(modalDetalle){
        modalDetalle.remove();
    }
    if (modalCarrito) {
        modalCarrito.remove();
    }
    if (modalCompra) {
        modalCompra.remove();
    }

    let modalPublicidades = document.createElement("div");
    modalPublicidades.setAttribute("id", "modalPublicidades")
    modalPublicidades.classList.add("modalPublicidades");
    
    let aCerrar = document.createElement("a");
        aCerrar.setAttribute("href", "javascript:void(0)");
        aCerrar.innerText = "X";
        aCerrar.addEventListener('click', () => {
            let cerrar = document.querySelector("#modalPublicidades");
            cerrar.remove();
        });

    let h3Publicidades = document.createElement("h3");
    h3Publicidades.innerText = "Promociones vigentes";

    modalPublicidades.append(aCerrar, h3Publicidades);

    for (const publicidad of aPublicidades) {
         modalPublicidades.append(publicidad.mostrarPublicidad());
    }

     // Traemos el div que esta al mismo nivel de la seccion de productos
     const sectionProductos = document.querySelector("#contenedorProductos");
     sectionProductos.parentNode.appendChild(modalPublicidades);
     return sectionProductos;
}