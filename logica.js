function iniciar() {
    document.getElementById('pantallaLogin').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}

// ---- Estado ----
let registroMuestras = [
    {
        id: "LAB-1092", paciente: "Carlos Gómez", estudio: "Hemograma",
        estado: "En Proceso", aRepetir: false,
        notas: [ { autor: "Bioquímico", texto: "Valores de hemoglobina fuera de rango, verificar muestra.", hora: "09:14" } ]
    },
    {
        id: "LAB-1093", paciente: "María Rodríguez", estudio: "Urocultivo",
        estado: "En Proceso", aRepetir: false,
        notas: []
    }
];

const formMuestra = document.getElementById('form-muestra');
const listaMuestras = document.getElementById('lista-muestras');
const rolActual = document.getElementById('rolActual');

function renderizarMuestras() {
    listaMuestras.innerHTML = "";

    registroMuestras.forEach(muestra => {
        const div = document.createElement('div');
        div.className = "muestra" + (muestra.aRepetir ? " a-repetir" : "");

        const notasHtml = muestra.notas.map(n => `
            <div class="nota">
                <span class="autor">${n.autor}:</span>${n.texto}
                <span class="hora">${n.hora}</span>
            </div>
        `).join("");

        div.innerHTML = `
            <div class="muestra-header">
                <div>
                    <strong>${muestra.paciente}</strong>
                    <div class="muestra-id">${muestra.id} — ${muestra.estudio}</div>
                </div>
                <span class="badge ${muestra.aRepetir ? 'repetir' : ''}">${muestra.aRepetir ? 'A REPETIR' : muestra.estado}</span>
            </div>

            <div class="notas-lista">${notasHtml || '<span style="color:var(--text-secondary); font-size:0.85rem;">Sin notas todavía.</span>'}</div>

            <div class="nota-form">
                <input type="text" placeholder="Agregar nota para ${muestra.id}..." id="nota-${muestra.id}">
                <button class="btn-small" onclick="agregarNota('${muestra.id}')">Enviar</button>
                <button class="btn-repetir ${muestra.aRepetir ? 'activo' : ''}" onclick="toggleRepetir('${muestra.id}')">
                    ${muestra.aRepetir ? '✓ Marcada para repetir' : 'Marcar para repetir'}
                </button>
            </div>
        `;
        listaMuestras.appendChild(div);
    });
}

function agregarNota(id) {
    const input = document.getElementById(`nota-${id}`);
    const texto = input.value.trim();
    if (!texto) return;

    const muestra = registroMuestras.find(m => m.id === id);
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    muestra.notas.push({ autor: rolActual.value, texto, hora });

    renderizarMuestras();
}

function toggleRepetir(id) {
    const muestra = registroMuestras.find(m => m.id === id);
    muestra.aRepetir = !muestra.aRepetir;
    renderizarMuestras();
}

formMuestra.addEventListener('submit', function (e) {
    e.preventDefault();
    const pacienteNombre = document.getElementById('paciente').value;
    const tipoEstudio = document.getElementById('tipo-analisis').value;
    const nuevoId = `LAB-${Math.floor(1000 + Math.random() * 9000)}`;

    registroMuestras.push({
        id: nuevoId, paciente: pacienteNombre, estudio: tipoEstudio,
        estado: "En Proceso", aRepetir: false, notas: []
    });

    renderizarMuestras();
    formMuestra.reset();
});

document.addEventListener('DOMContentLoaded', renderizarMuestras);
