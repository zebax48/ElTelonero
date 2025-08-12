import React, { useState, useEffect, useMemo } from 'react';
import styles from '@/styles/CrearEvento.module.css';
import votacionApi from '@/api/votacionApi';
import { useAuth } from '@/Auth/AuthContext';
import { getActiveVotationId } from '@/api/serverConfig';

const ActivarVotacion = ({ onVotacionActivada }) => {
  const { auth } = useAuth();
  const [votaciones, setVotaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const fetchVotaciones = async () => {
      try {
        setLoading(true);
        const data = await votacionApi.getAll(auth.token);
        setVotaciones(data);
      } catch (err) {
        setError('Error al cargar las votaciones');
      } finally {
        setLoading(false);
      }
    };
    const fetchActive = async () => {
      try {
        const id = await getActiveVotationId();
        setActiveId(id || null);
      } catch {}
    };
    fetchVotaciones();
    fetchActive();
  }, [auth.token]);

  const filtered = useMemo(() => {
    const ordered = [...votaciones].sort((a, b) => {
      const ca = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const cb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return cb - ca;
    });
    if (!query.trim()) return ordered;
    const q = query.toLowerCase();
    return ordered.filter(v =>
      (v?.evento?.nombre || '').toLowerCase().includes(q)
      || (v?._id || '').toLowerCase().includes(q)
    );
  }, [votaciones, query]);

  const handleActivar = async (id) => {
    try {
      setLoading(true);
      setLoadingId(id);
      await votacionApi.activarVotacion(id, auth.token);
      const v = votaciones.find(x => x._id === id);
      if (onVotacionActivada && v) {
        onVotacionActivada({
          id: v._id,
          eventoNombre: v?.evento?.nombre || '',
          createdAt: v.createdAt || null,
          fechaInicio: v.fechaInicio || null,
          duracionMinutos: v.duracionMinutos || null,
          participantesCount: Array.isArray(v.participantes) ? v.participantes.length : 0
        });
      } else if (onVotacionActivada) {
        onVotacionActivada({ id });
      }
      setActiveId(id);
      setError('');
    } catch (err) {
      setError('Error al activar la votación');
    } finally {
      setLoading(false);
      setLoadingId(null);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header y búsqueda con estilo de tarjeta */}
      <div className={styles.formulario} style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
        <h3 className={styles.titulo} style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Seleccionar votación activa</h3>
        <p style={{ opacity: 0.85, marginTop: 0, marginBottom: '1rem' }}>Busca por evento o ID, revisa la fecha de creación y activa.</p>
        {error && <p style={{ color: '#ff6b6b', fontWeight: 600 }}>{error}</p>}

        <input
          type="text"
          placeholder="Buscar por nombre de evento o ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Tabla a ancho completo */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 0.5rem' }}>Evento</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Participantes</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Creada</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Inicio</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Duración</th>
              <th style={{ padding: '0.75rem 0.5rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => {
              const created = v.createdAt ? new Date(v.createdAt) : (v.fechaInicio ? new Date(v.fechaInicio) : null);
              const createdLabel = created ? created.toLocaleString() : '—';
              const inicioLabel = v.fechaInicio ? new Date(v.fechaInicio).toLocaleString() : '—';
              const isActive = activeId && v._id === activeId;
              return (
                <tr key={v._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: isActive ? 'rgba(0, 255, 127, 0.08)' : 'transparent' }}>
                  <td style={{ padding: '0.6rem 0.5rem' }}>
                    {v?.evento?.nombre || '—'}
                    {isActive && <span style={{ marginLeft: 8, fontSize: 12, color: '#00ffa0', border: '1px solid #00ffa0', borderRadius: 12, padding: '2px 8px' }}>Activa</span>}
                  </td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>{v?.participantes?.length ?? 0}</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>{createdLabel}</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>{inicioLabel}</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>{v?.duracionMinutos ?? '—'} min</td>
                  <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>
                    <button className={styles.boton} onClick={() => handleActivar(v._id)} disabled={!!loadingId}>
                      {loadingId === v._id ? 'Activando…' : 'Activar'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '1rem 0.5rem', opacity: 0.8 }}>No hay votaciones para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivarVotacion;
