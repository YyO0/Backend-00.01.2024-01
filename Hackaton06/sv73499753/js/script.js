console.log("Inicio del Programa")
//creamos la clase Dispositivo
class Dispositivo {
    constructor(iMei, nroSerie) {
        this.iMei = iMei;
        this.nroSerie = nroSerie;
        this.revision = false;
        this.diagnostico = "";
        this.pago = false;
        this.valorReparacion = 0;
        this.autorizacion = true;
        this.repuestos = null;
        this.estado = "";
    }
    toJson() {
        return JSON.stringify({ iMei: this.iMei, nroSerie: this.nroSerie });
    }
    revisarReporteRobo() {
        
        return Math.random() > 0.5 ? true : false;
    }
    iniciarDiagnostico() {
        
        if (this.autorizacion && this.pago) {
            this.diagnostico = prompt("Escribe el Diagnostico");
            this.estado = "En Diagnostico";
        }
        else {
            alert("La autorizacion o el pago no esta realizado")
        }
    }
    recibirPago() {
       
        this.pago = true;
    }

}

 
class Persona {
    constructor(nombre, apellido, nroIdentificacion) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.nroIdentificacion = nroIdentificacion;
    }
}

 
class Cliente extends Persona {
    constructor(nombre, apellido, nroIdentificacion, nroTelefono, direccion, dispositivo) {
        super(nombre, apellido, nroIdentificacion);
        this.nroTelefono = nroTelefono;
        this.direccion = direccion;

        this.dispositivo = dispositivo;
    }
    toJson() {
        return JSON.stringify({
            nombre: this.nombre,
            apellido: this.apellido,
            nroIdentificacion: this.nroIdentificacion,
            nroTelefono: this.nroTelefono,
            direccion: this.direccion
        })
    }
    // no implementado aun pero confirma la autorizacion del clente para la reparacion
    autorizar(telefono) {
        telefono.autorizacion = confirm("Auroriza la reparacion del Telefono");
    }

}


 
class Tecnico extends Persona {
    constructor(nombre, apellido, nroIdentificacion, skills) {
        super(nombre, apellido, nroIdentificacion);
        this.skills = skills;
    }
    toJson() {
        return JSON.stringify({
            nombre: this.nombre,
            apellido: this.apellido,
            nroIdentificacion: this.nroIdentificacion,
            skills: this.skills
        })
    }
}

 
class Administrador extends Persona {
    constructor(nombre, apellido, nroIdentificacion, tienda) {
        super(nombre, apellido, nroIdentificacion);
        this.tienda = tienda;
    }
    toJson() {
        return JSON.stringify({
            nombre: this.nombre,
            apellido: this.apellido,
            nroIdentificacion: this.nroIdentificacion,
            tienda: this.tienda
        })
    }
   
    recibirDispositivo() {
        let imei = prompt("Ingresa el IMEI");
        let nroSerie = prompt("Ingresa el numero de Serie");
        let objDispositivo = new Dispositivo(imei, nroSerie);
        let nombre = prompt("Escribe el nombre del cliente");
        let apellido = prompt("Escribe el apellido del clente");
        let nroIdentificacion = prompt("Escribe el DNI del cliente");
        let nroTelefono = prompt("Escribe el numero de telefono del cliente")
        let direccion = prompt("Escribe la direccion decl cleinte");
        let cliente = new Cliente(nombre, apellido, nroIdentificacion, nroTelefono, direccion, objDispositivo);
        arrCliente.push(cliente);
    }
}

let arrDispositivos = [];
let arrCliente = [];


let admin = new Administrador("Roberto", "Pineda", "CE 001575291", "Principal")

 
document.getElementById("recibirDispositivo").addEventListener("click", recibirDispositivo);
document.getElementById("borrarData").addEventListener("click", borrarData);


 
function recibirDispositivo() {
    admin.recibirDispositivo();
  
    guardarData("cliente", arrCliente);
    console.log(arrCliente)
    arrCliente.forEach(element => {
        arrDispositivos.push(element.dispositivo)
    });
   
    $table.bootstrapTable('load', arrDispositivos)
}

function guardarData(nombre, data) {
  
    localStorage.setItem(nombre, JSON.stringify(data));
}

function borrarData() {

 
    guardarData("cliente", null);
    arrCliente = [];
    arrDispositivos = [];

    $table.bootstrapTable('load', arrDispositivos)
}

 
function init() {
    let jsonCliente = null;
    let localData = localStorage.getItem("cliente");
    console.log(localData);
    if (localData !== null && localData !== "null") {
        jsonCliente = JSON.parse(localData);
    }
    else {
        jsonCliente = [];
    }

    jsonCliente.forEach(element => {
        let arrJsonDispositivo = element.dispositivo;
        console.log(arrJsonDispositivo)
        objDispositivo = new Dispositivo(arrJsonDispositivo.iMei, arrJsonDispositivo.nroSerie)
        arrCliente.push(new Cliente(
            element.nombre,
            element.apellido,
            element.nroIdentificacion,
            element.nroTelefono,
            element.direccion,
            objDispositivo))
    });


    arrCliente.forEach(element => {
        arrDispositivos.push(element.dispositivo)
    });

    $table.bootstrapTable({ data: arrDispositivos })


}

var $table = $('#tblDispositivos');

 
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    init();
});

 
$table.on('click-row.bs.table', function (row, $element, field) {

    console.log($element);
    if (confirm(`Desea modificar el estado del dispositivo ${$element.iMei}???`)) {

        let objDispositivo = buscarDispositivo($element.iMei);
        if (objDispositivo.revisarReporteRobo()) {
            alert("El dispositivo esta reportado como robado")
        } else {
            console.log("No esta robado")
            objDispositivo.recibirPago();
            objDispositivo.iniciarDiagnostico()

        }
    }
    $table.bootstrapTable('load', arrDispositivos)
})

 

function buscarDispositivo(imei) {

    for (let index = 0; index < arrDispositivos.length; index++) {
        const element = arrDispositivos[index];
        if (element.iMei === imei) {
            return element;
        }

    }
}
function mostrarDataAlmacenada() {
    let datosAlmacenadosDiv = document.getElementById('datosAlmacenados');
    datosAlmacenadosDiv.innerHTML = ""; // Limpiar el contenido previo

    // Obtener la información del cliente almacenada en el localStorage
    let localData = localStorage.getItem("cliente");

    if (localData !== null && localData !== "null") {
        let jsonCliente = JSON.parse(localData);

        jsonCliente.forEach(element => {
            datosAlmacenadosDiv.innerHTML += "<p>Nombre: " + element.nombre + "</p>";
            datosAlmacenadosDiv.innerHTML += "<p>Apellido: " + element.apellido + "</p>";
            datosAlmacenadosDiv.innerHTML += "<p>Número de Identificación: " + element.nroIdentificacion + "</p>";
            // Agrega más líneas según necesites para mostrar otros datos
            datosAlmacenadosDiv.innerHTML += "<hr>"; // Separador entre clientes
            datosAlmacenadosDiv.innerHTML += "<>"; // Separador entre clientes
        });
    } else {
        datosAlmacenadosDiv.innerHTML = "<p>No hay datos almacenados en el localStorage.</p>";
    }
}
mostrarDataAlmacenada();