import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getVotacion } from '@/api/votacionApi';
import { enviarVoto } from '@/api/participanteApi';
import { ClipLoader } from 'react-spinners';
import Modal from '@/components/AdminPage/Modal';
import styles from '@/styles/FormularioRegistro.module.css';

export default function VotacionPage() {
  const router = useRouter();
  const { id } = router.query;
  const [votacion, setVotacion] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [yaVoto, setYaVoto] = useState(false);

  useEffect(() => {
    if (id) {
      const votoAnterior = localStorage.getItem(`voto-${id}`);
      if (votoAnterior) setYaVoto(true);
      fetchVotacion(id);
    }
  }, [id]);

  const fetchVotacion = async (id) => {
    try {
      const res = await getVotacion(id);
      if (res.error) {
        setMensaje(`❌ ${res.error}`);
      } else {
        setVotacion(res);
      }
    } catch (error) {
      console.error('Error fetching votacion:', error);
      setMensaje('❌ Error al cargar la votación');
    }
  };

  const votar = async (participanteId) => {
    try {
      const res = await enviarVoto(id, participanteId);
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

  if (!votacion) return <ClipLoader color="#fff" loading={true} size={50} />;
  if (!votacion.activa) return <p style={{ color: 'white', textAlign: 'center' }}>⛔ Esta votación ha finalizado.</p>;

  const handleCloseModal = () => {
    setShowModal(false);
    setMensaje(null);
    router.push(`/`);
  };

  return (
    <section className={styles.registroContainer}>
      <h4 className={styles.registroTitulo} style={{ minWidth: '100%' }}>El Telonero Soy Yo: {votacion.evento.nombre}</h4>
      <p style={{ color: 'var(--color-texto-secundario)', marginBottom: '1rem' }}>
        Tiempo restante: <strong>{votacion.minutosRestantes}</strong> minutos
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