import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/Auth/AuthContext';
import { getEventos } from '@/api/eventoApi';
import { getActiveEventId, setActiveEventId } from '@/api/serverConfig';
import styles from '@/styles/CrearEvento.module.css';
import { ClipLoader } from 'react-spinners';

const SeleccionarEventoActivo = () => {
  const { auth } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [data, currentId] = await Promise.all([
          getEventos(auth.token),
          getActiveEventId(),
        ]);
        setEventos(Array.isArray(data) ? data : []);
        setActiveId(currentId || null);
      } catch (err) {
        setError('Error al cargar los eventos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [auth.token]);

  const filtered = useMemo(() => {
    const sorted = [...eventos].sort((a, b) => {
      const da = a.fecha ? new Date(a.fecha).getTime() : 0;
      const db = b.fecha ? new Date(b.fecha).getTime() : 0;
      return db - da;
    });
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter(
      (e) =>
        (e.nombre || '').toLowerCase().includes(q) ||
        (e.lugar || '').toLowerCase().includes(q) ||
        (e._id || '').toLowerCase().includes(q)
    );
  }, [eventos, query]);

  const handleActivar = async (id) => {
    try {
      setLoadingId(id);
      setError('');
      const result = await setActiveEventId(id, auth.token);
      if (result?.error) throw new Error(result.error);
      setActiveId(id);
      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (err) {
      setError('Error al activar el evento');
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="loaderContainer" style={{ height: '30vh' }}>
        <ClipLoader color="#C265FF" loading size={50} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {error && (
        <p style={{ color: '#ff6b6b', fontWeight: 600, marginBottom: '1rem' }}>{error}</p>
      )}

      {successId && (
        <p style={{ color: '#A78BFA', fontWeight: 600, marginBottom: '1rem' }}>
          ✅ Evento activo actualizado correctamente.
        </p>
      )}

      {/* Buscador */}
      <div className={styles.formulario} style={{ maxWidth: '100%', margin: '0 0 1.5rem 0' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, lugar o ID del evento…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
          }}
        >
          <thead>
            <tr style={{ textAlign: 'left', opacity: 0.7, fontSize: '0.9rem' }}>
              <th style={{ padding: '0.75rem 0.5rem' }}>Nombre</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Fecha</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Lugar</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Estado</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Capacidad</th>
              <th style={{ padding: '0.75rem 0.5rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((evento) => {
              const isActive = activeId && evento._id === activeId;
              const fechaLabel = evento.fecha
                ? new Date(evento.fecha).toLocaleDateString()
                : '—';

              return (
                <tr
                  key={evento._id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    background: isActive
                      ? 'rgba(194, 101, 255, 0.12)'
                      : 'transparent',
                    transition: 'background 0.3s',
                  }}
                >
                  <td style={{ padding: '0.7rem 0.5rem', fontWeight: isActive ? 700 : 400 }}>
                    {evento.nombre || '—'}
                    {isActive && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 11,
                          color: '#C265FF',
                          border: '1px solid #C265FF',
                          borderRadius: 12,
                          padding: '2px 8px',
                          verticalAlign: 'middle',
                        }}
                      >
                        Activo
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.7rem 0.5rem' }}>{fechaLabel}</td>
                  <td style={{ padding: '0.7rem 0.5rem' }}>{evento.lugar || '—'}</td>
                  <td style={{ padding: '0.7rem 0.5rem', textTransform: 'capitalize' }}>
                    {evento.estado || '—'}
                  </td>
                  <td style={{ padding: '0.7rem 0.5rem' }}>{evento.capacidad ?? '—'}</td>
                  <td style={{ padding: '0.7rem 0.5rem', textAlign: 'right' }}>
                    <button
                      className={styles.boton}
                      onClick={() => handleActivar(evento._id)}
                      disabled={!!loadingId || isActive}
                      style={{ opacity: isActive ? 0.45 : 1, minWidth: 90 }}
                    >
                      {loadingId === evento._id ? 'Activando…' : isActive ? 'Activo' : 'Activar'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '1rem 0.5rem', opacity: 0.7 }}>
                  No hay eventos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeleccionarEventoActivo;
