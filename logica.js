function iniciar() {
    document.getElementById('pantallaLogin').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}

// ---- Lógica original de muestras (sin cambios) ----

let registroMuestras = [
    { id: "LAB-1092", paciente: "Carlos Gómez", estudio: "Hemograma", estado: "En Proceso" },
    { id: "LAB-1093", paciente: "María Rodríguez", estudio: "Urocultivo", estado: "En Proceso" }
];
const formMuestra = document.getElementById('form-muestra');
const listaMuestras = document.getElementById('lista-muestras');

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

formMuestra.addEventListener('submit', function(e) {
    e.preventDefault();

    const pacienteNombre = document.getElementById('paciente').value;
    const tipoEstudio = document.getElementById('tipo-analisis').value;
    const nuevoId = `LAB-${Math.floor(1000 + Math.random() * 9000)}`;

    const nuevaMuestra = {
        id: nuevoId,
        paciente: pacienteNombre,
        estudio: tipoEstudio,
        estado: "En Proceso"
    };

    registroMuestras.push(nuevaMuestra);
    renderizarMuestras();
    formMuestra.reset();
});

document.addEventListener('DOMContentLoaded', () => {
    renderizarMuestras();
});
