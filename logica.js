// BASE DE DATOS SIMULADA
let ordenesPendientes = [
    { id: "2026-09482", paciente: "Juan Pérez", medico: "Dr. Gastón Rodríguez", estudio: "Ionograma Plasmático", sodio: 138, potasio: 6.2 },
    { id: "2026-09483", paciente: "Marta Gómez", medico: "Dra. Ana Milone", estudio: "Ionograma Plasmático", sodio: 142, potasio: 4.1 },
    { id: "2026-09484", paciente: "Carlos Rossi", medico: "Dr. Gastón Rodríguez", estudio: "Ionograma Plasmático", sodio: 130, potasio: 3.6 }
];

let usuarioAutenticado = "";
let indexOrdenActiva = null;

// 1. LÓGICA DE INGRESO (LOGIN)
function ejecutarLogin() {
    const usuario = document.getElementById("inputUsuario").value;
    if (usuario.trim() === "") {
        alert("Por favor, ingresá tu usuario o número de matrícula.");
        return;
    }
    usuarioAutenticado = usuario;
    document.getElementById("nombreProfesional").innerText = `🧪 Bioquímico: ${usuarioAutenticado}`;
    
    // Mostramos el sistema
    document.getElementById("pantallaLogin").classList.add("oculto");
    document.getElementById("pantallaSistema").classList.remove("oculto");
    
    // 🔥 LE AVISAMOS AL NAVEGADOR QUE AVANZAMOS: Activamos su flecha de atrás
    history.pushState({ pantalla: "sistema" }, "Panel Principal", "#panel");

    cargarListaPedidos();
}

// 2. CARGAR LA LISTA DE PEDIDOS
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

// 3. SELECCIONAR UNA ORDEN
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

    // 🔥 LE AVISAMOS AL NAVEGADOR QUE LLEGAMOS AL DETALLE DEL PACIENTE
    history.pushState({ pantalla: "detalle" }, "Detalle Protocolo", `#protocolo-${orden.id}`);
}

// 4. GENERAR EL PDF LIMPIO PARA EL PACIENTE
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

// 5. VALIDAR Y ENVIAR AL MÉDICO
function finalizarYEnviarProtocolo() {
    if (indexOrdenActiva === null) return;
    
    const orden = ordenesPendientes[indexOrdenActiva];
    const requiereRepeticion = document.getElementById("selectRepeticion").value;
    const comentarios = document.getElementById("comentariosBioq").value;

    if (requiereRepeticion === "SI" && comentarios.trim() === "") {
        alert("Pusiste que se sugiere repetir. Por favor, escribí en los comentarios cuál es la causa técnica para informarle al médico.");
        return;
    }

    let despachoClinico = {
        protocolo: orden.id,
        bioquimicoFirmante: usuarioAutenticado,
        resultadosValidados: {
            sodio: document.getElementById("valSodio").value,
            potasio: document.getElementById("valPotasio").value
        },
        enlaceInteroperableMedico: {
            alertaRepeticion: requiereRepeticion,
            observacionesInternas: comentarios
        }
    };

    console.log("=== DESPACHANDO PROTOCOLO VALIDADO A LA HISTORIA CLÍNICA ===");
    console.log(despachoClinico);
    console.log("==========================================================");

    alert(`Protocolo ${orden.id} validado con éxito.\nEl PDF formal se guardó en el portal del paciente y se despachó el metadato interoperable al consultorio.`);
    
    ordenesPendientes.splice(indexOrdenActiva, 1);
    indexOrdenActiva = null;
    
    cargarListaPedidos();
    
    // Como terminamos este reingreso, le decimos al navegador que borre ese historial y vuelva al panel
    history.replaceState({ pantalla: "sistema" }, "Panel Principal", "#panel");
    renderizarSegunEstado({ pantalla: "sistema" });
}

// FUNCIONES DE NAVEGACIÓN MANUAL (LOS BOTONES INTERNOS)
function volverAListaPendientes() {
    history.pushState({ pantalla: "sistema" }, "Panel Principal", "#panel");
    renderizarSegunEstado({ pantalla: "sistema" });
}

function volverAlLogin() {
    history.pushState({ pantalla: "login" }, "Ingreso", "#login");
    renderizarSegunEstado({ pantalla: "login" });
}

// ========================================================
// 🚨 LA MAGIA: CONTROLADOR DE LAS FLECHAS DEL NAVEGADOR
// ========================================================

// Esta función es el "Cerebro Visual" que oculta o muestra pantallas según donde esté parado el historial
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
        // Si vuelve usando las flechas al detalle, el panel derecho ya se encarga de mostrar la orden activa.
        document.getElementById("mensajeSeleccion").classList.add("oculto");
        document.getElementById("areaTrabajo").classList.remove("oculto");
    }
}

// Este evento "escucha" cada vez que hacés clic en la flecha de ATRÁS o ADELANTE de tu navegador
window.onpopstate = function(event) {
    // Cuando toques las flechas de tu navegador, se ejecuta esto automáticamente:
    renderizarSegunEstado(event.state);
};

// Registramos el estado inicial (el Login) apenas se carga la página web por primera vez
history.replaceState({ pantalla: "login" }, "Ingreso", "#login");