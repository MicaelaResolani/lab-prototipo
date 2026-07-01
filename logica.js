let ordenesPendientes = [
    { id: "2026-09482", paciente: "Juan Pérez", medico: "Dr. Gastón Rodríguez", estudio: "Ionograma Plasmático", sodio: 138, potasio: 6.2 },
    { id: "2026-09483", paciente: "Marta Gómez", medico: "Dra. Ana Milone", estudio: "Ionograma Plasmático", sodio: 142, potasio: 4.1 },
    { id: "2026-09484", paciente: "Carlos Rossi", medico: "Dr. Gastón Rodríguez", estudio: "Ionograma Plasmático", sodio: 130, potasio: 3.6 }
];

let usuarioAutenticado = "";
let indexOrdenActiva = null;

function ejecutarLogin() {
    const usuario = document.getElementById("inputUsuario").value;
    if (usuario.trim() === "") {
        alert("Por favor, ingresá tu usuario o número de matrícula.");
        return;
    }
    usuarioAutenticado = usuario.trim();
    
    // Identificamos dinámicamente el rol del usuario para corregir el error del badge
    let rolDetectado = "Profesional";
    if (usuarioAutenticado.includes("medico")) {
        rolDetectado = "Médico";
    } else if (usuarioAutenticado.includes("lab") || usuarioAutenticado.includes("bioq")) {
        rolDetectado = "Bioquímico";
    }
    
    document.getElementById("nombreProfesional").innerText = `👤 ${rolDetectado}: ${usuarioAutenticado}`;
    
    document.getElementById("pantallaLogin").classList.add("oculto");
    document.getElementById("pantallaSistema").classList.remove("oculto");
    
    history.pushState({ pantalla: "sistema" }, "Panel Principal", "#panel");

    cargarListaPedidos();
}

function cargarListaPedidos() {
    const contenedor = document.getElementById("contenedorPedidos");
    contenedor.innerHTML = ""; 
    
    ordenesPendientes.forEach((orden, index) => {
        let tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-pedido-link";
        tarjeta.innerHTML = `
            <p><strong>Nro: ${orden.id}</strong></p>
            <p>Pac: ${orden.paciente}</p>
            <small>Origen: ${orden.medico}</small>
        `;
        tarjeta.onclick = () => seleccionarOrden(index);
        contenedor.appendChild(tarjeta);
    });
}

function seleccionarOrden(index) {
    indexOrdenActiva = index;
    let orden = ordenesPendientes[index];
    
    document.getElementById("mensajeSeleccion").classList.add("oculto");
    document.getElementById("areaTrabajo").classList.remove("oculto");
    
    document.getElementById("protocoloActivo").innerText = orden.id;
    document.getElementById("pacienteActivo").innerText = orden.paciente;
    document.getElementById("medicoActivo").innerText = orden.medico;
    document.getElementById("estudioActivo").innerText = orden.estudio;
    
    document.getElementById("valSodio").value = orden.sodio;
    document.getElementById("valPotasio").value = orden.potasio;
    
    document.getElementById("selectRepeticion").value = "NO";
    document.getElementById("comentariosBioq").value = "";

    history.pushState({ pantalla: "detalle" }, "Detalle Protocolo", `#protocolo-${orden.id}`);
}

function generarPdfPaciente() {
    if (indexOrdenActiva === null) return;
    let orden = ordenesPendientes[indexOrdenActiva];
    
    const sodioHallado = document.getElementById("valSodio").value;
    const potasioHallado = document.getElementById("valPotasio").value;

    document.getElementById("pdfPaciente").innerText = orden.paciente;
    document.getElementById("pdfProtocolo").innerText = orden.id;
    document.getElementById("pdfFirmaProfesional").innerText = `Mat. Profesional Nro: ${usuarioAutenticado}`;
    
    const cuerpoTabla = document.getElementById("pdfCuerpoTabla");
    cuerpoTabla.innerHTML = `
        <tr>
            <td>Sodio Plasmático (Na+)</td>
            <td><strong>${sodioHallado} mEq/L</strong></td>
            <td>135 - 145 mEq/L</td>
        </tr>
        <tr>
            <td>Potasio Plasmático (K+)</td>
            <td><strong>${potasioHallado} mEq/L</strong></td>
            <td>3.5 - 5.0 mEq/L</td>
        </tr>
    `;
    
    document.getElementById("modalPdf").classList.remove("oculto");
}

function cerrarPdf() {
    document.getElementById("modalPdf").classList.add("oculto");
}

function finalizarYEnviarProtocolo() {
    if (indexOrdenActiva === null) return;
    
    const orden = ordenesPendientes[indexOrdenActiva];
    const requiereRepeticion = document.getElementById("selectRepeticion").value;
    const comentarios = document.getElementById("comentariosBioq").value;

    if (requiereRepeticion === "SI" && comentarios.trim() === "") {
        alert("Pusiste que se sugiere repetir. Por favor, agregá observaciones técnicas sobre la muestra.");
        return;
    }

    let despachoClinico = {
        protocolo: orden.id,
        profesionalFirmante: usuarioAutenticado,
        resultadosValidados: {
            sodio: document.getElementById("valSodio").value,
            potasio: document.getElementById("valPotasio").value
        },
        enlaceInteroperable: {
            alertaRepeticion: requiereRepeticion,
            observacionesInternas: comentarios
        }
    };

    console.log("=== DESPACHANDO PROTOCOLO VALIDADO A LA HISTORIA CLÍNICA ===");
    console.log(despachoClinico);
    console.log("==========================================================");

    alert(`Protocolo ${orden.id} validado con éxito.\nEl documento formal se guardó en el portal del paciente y se despachó el metadato interoperable al sistema central.`);
    
    ordenesPendientes.splice(indexOrdenActiva, 1);
    indexOrdenActiva = null;
    
    cargarListaPedidos();
    
    history.replaceState({ pantalla: "sistema" }, "Panel Principal", "#panel");
    renderizarSegunEstado({ pantalla: "sistema" });
}

function volverAListaPendientes() {
    history.pushState({ pantalla: "sistema" }, "Panel Principal", "#panel");
    renderizarSegunEstado({ pantalla: "sistema" });
}

function volverAlLogin() {
    history.pushState({ pantalla: "login" }, "Ingreso", "#login");
    renderizarSegunEstado({ pantalla: "login" });
}

function renderizarSegunEstado(estado) {
    if (!estado || estado.pantalla === "login") {
        indexOrdenActiva = null;
        usuarioAutenticado = "";
        document.getElementById("inputUsuario").value = "";
        document.getElementById("inputPassword").value = "";
        
        document.getElementById("pantallaSistema").classList.add("oculto");
        document.getElementById("pantallaLogin").classList.remove("oculto");
    } 
    else if (estado.pantalla === "sistema") {
        indexOrdenActiva = null;
        document.getElementById("pantallaLogin").classList.add("oculto");
        document.getElementById("pantallaSistema").classList.remove("oculto");
        document.getElementById("areaTrabajo").classList.add("oculto");
        document.getElementById("mensajeSeleccion").classList.remove("oculto");
    } 
    else if (estado.pantalla === "detalle") {
        document.getElementById("mensajeSeleccion").classList.add("oculto");
        document.getElementById("areaTrabajo").classList.remove("oculto");
    }
}

window.onpopstate = function(event) {
    renderizarSegunEstado(event.state);
};

history.replaceState({ pantalla: "login" }, "Ingreso", "#login");
