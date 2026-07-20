// Estilos inyectados por JS (sin archivo CSS aparte)
const estilos = document.createElement('style');
estilos.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; background: #0a0e14; color: #f0f6fc; padding: 20px; }
    .app-shell { max-width: 900px; margin: 0 auto; }
    h1 { color: #2f81f7; margin-bottom: 2rem; }
    .card { background: #141923; border-radius: 16px; border: 1px solid #30363d; padding: 2rem; margin-bottom: 2rem; }
    .card h3 { margin-bottom: 1.5rem; color: #2f81f7; }
    #form-muestra { display: flex; flex-direction: column; gap: 1rem; }
    input, select { padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid #30363d; color: #fff; border-radius: 8px; }
    .btn-primary { padding: 15px; background: #238636; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; }
    .btn-primary:hover { background: #2ea043; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #30363d; }
    th { color: #8b949e; font-size: 0.85rem; text-transform: uppercase; }
    .status-badge { background: rgba(47,129,247,0.15); color: #2f81f7; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; }
`;
document.head.appendChild(estilos);

// ---- Lógica original (sin cambios) ----

// Simulación del estado global de las muestras del laboratorio
let registroMuestras = [
    { id: "LAB-1092", paciente: "Carlos Gómez", estudio: "Hemograma", estado: "En Proceso" },
    { id: "LAB-1093", paciente: "María Rodríguez", estudio: "Urocultivo", estado: "En Proceso" }
];
const formMuestra = document.getElementById('form-muestra');
const listaMuestras = document.getElementById('lista-muestras');

// Función para actualizar y dibujar la tabla en pantalla
function renderizarMuestras() {
    listaMuestras.innerHTML = "";

    registroMuestras.forEach(muestra => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><strong>${muestra.id}</strong></td>
            <td>${muestra.paciente}</td>
            <td>${muestra.estudio}</td>
            <td><span class="status-badge">${muestra.estado}</span></td>
        `;
        listaMuestras.appendChild(fila);
    });
}

// Escucha del evento submit para agregar una nueva muestra
formMuestra.addEventListener('submit', function(e) {
    e.preventDefault();

    const pacienteNombre = document.getElementById('paciente').value;
    const tipoEstudio = document.getElementById('tipo-analisis').value;

    // Generar un código identificador único aleatorio para la muestra
    const nuevoId = `LAB-${Math.floor(1000 + Math.random() * 9000)}`;

    const nuevaMuestra = {
        id: nuevoId,
        paciente: pacienteNombre,
        estudio: tipoEstudio,
        estado: "En Proceso"
    };

    registroMuestras.push(nuevaMuestra);
    renderizarMuestras();

    // Resetear los campos del formulario
    formMuestra.reset();
});

// Carga inicial al iniciar la pantalla
document.addEventListener('DOMContentLoaded', () => {
    renderizarMuestras();
});
