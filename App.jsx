import React, { useState } from 'react';
import './App.css';

export default function App() {
  // --- Estados de la Aplicación ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rolActual, setRolActual] = useState('Médico');
  const [paciente, setPaciente] = useState('');
  const [tipoAnalisis, setTipoAnalisis] = useState('');
  const [textoNota, setTextoNota] = useState({}); // Controla los textos de notas por ID de muestra

  const [registroMuestras, setRegistroMuestras] = useState([
    {
      id: "LAB-1092", 
      paciente: "Carlos Gómez", 
      estudio: "Hemograma",
      estado: "En Proceso", 
      aRepetir: false,
      notas: [ { autor: "Bioquímico", texto: "Valores de hemoglobina fuera de rango, verificar muestra.", hora: "09:14" } ]
    },
    {
      id: "LAB-1093", 
      paciente: "María Rodríguez", 
      estudio: "Urocultivo",
      estado: "En Proceso", 
      aRepetir: false,
      notas: []
    }
  ]);

  // --- Funciones de los Botones ---
  const manejarLogin = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setIsLoggedIn(true); // Cambia el estado para mostrar la app
  };

  const registrarMuestra = (e) => {
    e.preventDefault();
    if (!paciente || !tipoAnalisis) return;

    const nuevoId = `LAB-${Math.floor(1000 + Math.random() * 9000)}`;
    const nuevaMuestra = {
      id: nuevoId,
      paciente,
      estudio: tipoAnalisis,
      estado: "En Proceso",
      aRepetir: false,
      notas: []
    };

    setRegistroMuestras([...registroMuestras, nuevaMuestra]);
    setPaciente(''); // Limpia el input de paciente
    setTipoAnalisis(''); // Limpia el selector
  };

  const agregarNota = (id) => {
    const texto = textoNota[id]?.trim();
    if (!texto) return;

    const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setRegistroMuestras(registroMuestras.map(muestra => {
      if (muestra.id === id) {
        return {
          ...muestra,
          notas: [...muestra.notas, { autor: rolActual, texto, hora: horaActual }]
        };
      }
      return muestra;
    }));

    // Limpia el input específico de esta muestra
    setTextoNota({ ...textoNota, [id]: '' });
  };

  const toggleRepetir = (id) => {
    setRegistroMuestras(registroMuestras.map(muestra => {
      if (muestra.id === id) {
        return { ...muestra, aRepetir: !muestra.aRepetir };
      }
      return muestra;
    }));
  };

  // --- RENDERIZADO 1: Vista de Login ---
  if (!isLoggedIn) {
    return (
      <div className="login-overlay">
        {/* Usamos onSubmit para que funcione tanto al hacer click como al dar Enter */}
        <form className="login-card" onSubmit={manejarLogin}>
          <h2>Terminal Lab</h2>
          <input type="text" defaultValue="medico@hospital.com" />
          <input type="password" placeholder="Contraseña" required />
          <button type="submit" className="btn-login">Entrar</button>
        </form>
      </div>
    );
  }

  // --- RENDERIZADO 2: Aplicación Principal (Si isLoggedIn es true) ---
  return (
    <div className="app-shell">
      <div className="top-bar">
        <h1>🧪 Terminal Lab</h1>
        <div className="rol-selector">
          Actuando como:
          <select value={rolActual} onChange={(e) => setRolActual(e.target.value)}>
            <option value="Médico">Médico</option>
            <option value="Bioquímico">Bioquímico</option>
          </select>
        </div>
      </div>

      {/* Formulario de Registro */}
      <section className="card">
        <h3>Registro de Nueva Muestra</h3>
        <form id="form-muestra" onSubmit={registrarMuestra}>
          <input 
            type="text" 
            placeholder="Nombre del paciente" 
            value={paciente}
            onChange={(e) => setPaciente(e.target.value)}
            required 
          />
          <select 
            value={tipoAnalisis} 
            onChange={(e) => setTipoAnalisis(e.target.value)}
            required
          >
            <option value="">Seleccionar estudio...</option>
            <option value="Hemograma">Hemograma</option>
            <option value="Urocultivo">Urocultivo</option>
            <option value="Glucemia">Glucemia</option>
            <option value="Hepatograma">Hepatograma</option>
          </select>
          <button type="submit" className="btn-primary">Registrar</button>
        </form>
      </section>

      {/* Muestras */}
      <section className="card">
        <h3>Muestras en Laboratorio</h3>
        <div id="lista-muestras">
          {registroMuestras.map((muestra) => (
            <div 
              key={muestra.id} 
              className={`muestra ${muestra.aRepetir ? 'a-repetir' : ''}`}
            >
              <div className="muestra-header">
                <div>
                  <strong>{muestra.paciente}</strong>
                  <div className="muestra-id">{muestra.id} — {muestra.estudio}</div>
                </div>
                <span className={`badge ${muestra.aRepetir ? 'repetir' : ''}`}>
                  {muestra.aRepetir ? 'A REPETIR' : muestra.estado}
                </span>
              </div>

              {/* Notas de la muestra */}
              <div className="notas-lista">
                {muestra.notas.length > 0 ? (
                  muestra.notas.map((n, index) => (
                    <div key={index} className="nota">
                      <span className="autor">{n.autor}:</span>{n.texto}
                      <span className="hora">{n.hora}</span>
                    </div>
                  ))
                ) : (
                  <span className="sin-notas">Sin notas todavía.</span>
                )}
              </div>

              {/* Acciones y Formulario de Notas */}
              <div className="nota-form">
                <input 
                  type="text" 
                  placeholder={`Agregar nota para ${muestra.id}...`}
                  value={textoNota[muestra.id] || ''}
                  onChange={(e) => setTextoNota({ ...textoNota, [muestra.id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && agregarNota(muestra.id)}
                />
                <button type="button" className="btn-small" onClick={() => agregarNota(muestra.id)}>
                  Enviar
                </button>
                <button 
                  type="button"
                  className={`btn-repetir ${muestra.aRepetir ? 'activo' : ''}`} 
                  onClick={() => toggleRepetir(muestra.id)}
                >
                  {muestra.aRepetir ? '✓ Marcada para repetir' : 'Marcar para repetir'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
