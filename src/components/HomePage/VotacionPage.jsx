import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getVotacion, enviarVoto as enviarVotoApi } from '@/api/votacionApi';
import { ClipLoader } from 'react-spinners';
import Modal from '@/components/HomePage/Modal';
import styles from '@/styles/FormularioRegistro.module.css';

export default function VotacionPage() {
  const router = useRouter();
  const { id } = router.query;
  const GRACE_MS = 2000; // margen de 2s para evitar desfasajes
  const [votacion, setVotacion] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [yaVoto, setYaVoto] = useState(false);
  // Usaremos el estado del backend para decidir qué mostrar
  const [tiempoParaIniciar, setTiempoParaIniciar] = useState('');
  const [tiempoParaFinalizar, setTiempoParaFinalizar] = useState('');
  const hasRefetchedAfterStart = useRef(false);

  useEffect(() => {
    if (id) {
      const votoAnterior = localStorage.getItem(`voto-${id}`);
      if (votoAnterior) setYaVoto(true);
      fetchVotacion(id);
    }
  }, [id]);

  useEffect(() => {
    if (!votacion) return;

    const interval = setInterval(() => {
      const ahora = new Date();
      const fechaInicio = new Date(votacion.fechaInicio);
      const startMs = fechaInicio.getTime();
      const nowMs = ahora.getTime();
      const fechaFin = new Date(startMs + votacion.duracionMinutos * 60 * 1000);

      const diffMsInicioWithGrace = (startMs + GRACE_MS) - nowMs;

      if (diffMsInicioWithGrace > 0) {
        const horas = Math.floor(diffMsInicioWithGrace / (1000 * 60 * 60));
        const minutos = Math.floor((diffMsInicioWithGrace % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diffMsInicioWithGrace % (1000 * 60)) / 1000);
        const formatoInicio = horas > 0
          ? `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
          : `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        setTiempoParaIniciar(formatoInicio);
        return;
      }

      // Ya pasó el margen de gracia: considerar iniciada
      {
        // Asegurar que la UI cambie a activa aunque el backend tarde en reflejarlo
        if (votacion.estado === 'pendiente') {
          setVotacion(prev => prev ? { ...prev, estado: 'activa' } : prev);
        }

        // Reconsultar una vez tras el inicio para sincronizar con el backend
        if (!hasRefetchedAfterStart.current) {
          hasRefetchedAfterStart.current = true;
          setTimeout(() => fetchVotacion(id), 1500);
        }

        const diffMsFin = fechaFin - ahora;
        if (diffMsFin <= 0) {
          setTiempoParaFinalizar('00:00');
          clearInterval(interval);
          router.push('/');
          return;
        }
        const horas = Math.floor(diffMsFin / (1000 * 60 * 60));
        const minutos = Math.floor((diffMsFin % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diffMsFin % (1000 * 60)) / 1000);
        const formatoFin = horas > 0
          ? `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
          : `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        setTiempoParaFinalizar(formatoFin);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [votacion, id, router]);

  const fetchVotacion = async (id, options = {}) => {
    try {
      const res = await getVotacion(id);
      if (res.error) {
        setMensaje(`❌ ${res.error}`);
        return;
      }
  const ahora = res.serverNowMs ? new Date(res.serverNowMs) : new Date();
  const fechaInicio = new Date(res.fechaInicio);
  const fechaFin = new Date(fechaInicio.getTime() + res.duracionMinutos * 60 * 1000);
  // Si el backend aún reporta pendiente pero localmente ya pasó la hora de inicio, tratamos como activa para la UI
  const yaInicioLocal = ahora >= fechaInicio;
  const estadoUI = res.estado === 'pendiente' && yaInicioLocal ? 'activa' : res.estado;
  setVotacion({ ...res, estado: estadoUI });

      const diffMsInicio = fechaInicio - ahora;
      if (diffMsInicio > 0) {
        const horas = Math.floor(diffMsInicio / (1000 * 60 * 60));
        const minutos = Math.floor((diffMsInicio % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diffMsInicio % (1000 * 60)) / 1000);
        const formatoInicio = horas > 0
          ? `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
          : `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        setTiempoParaIniciar(formatoInicio);
      } else {
        setTiempoParaIniciar('00:00');
      }

  if (ahora >= fechaInicio) {
        const diffMsFin = fechaFin - ahora;
        if (diffMsFin > 0) {
          const horas = Math.floor(diffMsFin / (1000 * 60 * 60));
          const minutos = Math.floor((diffMsFin % (1000 * 60 * 60)) / (1000 * 60));
          const segundos = Math.floor((diffMsFin % (1000 * 60)) / 1000);
          const formatoFin = horas > 0
            ? `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
            : `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
          setTiempoParaFinalizar(formatoFin);
        } else {
          setTiempoParaFinalizar('00:00');
        }
      }

      // Si llegamos al borde y el servidor aún reporta pendiente, reintentar rápidamente
  if (options.retryIfPending && res.estado === 'pendiente') {
        setTimeout(() => fetchVotacion(id), 2000);
      }
    } catch (error) {
      console.error('Error fetching votacion:', error);
      setMensaje('❌ Error al cargar la votación');
    }
  };

  const votar = async (participanteId) => {
    try {
      const res = await enviarVotoApi(id, participanteId);
      const data = await res.json();
      if (res.error) {
        setMensaje(`❌ ${data.error}`);
        return;
      }
      localStorage.setItem(`voto-${id}`, participanteId);
      setMensaje('✅ ¡Gracias por tu voto!');
      setYaVoto(true);
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al procesar el voto');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMensaje(null);
    router.push(`/`);
  };

  if (!votacion) return <div className='loaderContainer'><ClipLoader color="#fff" loading={true} size={100} /></div>

  // Si el backend indica 'pendiente', mostrar la espera aunque el cliente esté justo en el borde
  if (votacion.estado === 'pendiente') {
    return (
      <div className='loaderContainer' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
        <p>
          🕒 Esta votación comenzará en <strong>{tiempoParaIniciar || '00:00'}</strong>
        </p>
        <button className='inscribirse-button' onClick={() => router.push(`/`)}>Volver al inicio</button>
      </div>
    );
  }

  // Si el backend indica 'finalizada', mostrar finalizada
  if (votacion.estado === 'finalizada') return (
    <p className='loaderContainer' style={{ color: 'white', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
      ⛔ Esta votación ha finalizado.
    </p>
  );

  return (
    <section className={styles.registroContainer}>
      <h4 className={styles.registroTitulo} style={{ minWidth: '100%' }}>El Telonero Soy Yo: {votacion.evento.nombre}</h4>
      <p style={{ color: 'var(--color-texto-secundario)', marginBottom: '1rem' }}>
        Tiempo restante: <strong>{tiempoParaFinalizar || '00:00'}</strong>
      </p>
      {yaVoto ? (
        <p style={{ color: 'var(--color-texto-secundario)' }}>✅ Ya has votado. ¡Gracias!</p>
      ) : (
        <div className={styles.registroForm}>
          {votacion.participantes.map(p => (
            <div key={p._id} style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--color-caja)', marginBottom: '1rem', boxShadow: '0 0 8px var(--color-sombra)' }}>
              <p><strong>{p.nombreCompleto}</strong></p>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-texto-secundario)' }}>{p.descripcion}</p>
              <a href={
                p.enlaceTalento.startsWith('http')
                  ? p.enlaceTalento
                  : `https://${p.enlaceTalento}`}
                target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-acento)' }}>Ver talento</a>
              <button
                className={styles.inscribirseButton}
                style={{ marginTop: '1rem' }}
                onClick={() => votar(p._id)}>
                Votar por {p.nombreCompleto}
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal onClose={() => handleCloseModal()}>
          <p className={styles.registroMensaje}>{mensaje}</p>
        </Modal>
      )}
    </section>
  );
}