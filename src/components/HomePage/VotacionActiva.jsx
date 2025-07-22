import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getVotacionActiva, enviarVoto } from '@/api/votacionApi';
import Modal from '@/components/AdminPage/Modal';
import styles from '@/styles/FormularioRegistro.module.css';

export default function VotacionActiva() {
  const router = useRouter();
  const { id: eventoId } = router.query;

  const [votacion, setVotacion] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [showModal, setShowModal] = useState(false);

  const localStorageKey = `votacion-${eventoId}`;

  useEffect(() => {
    if (eventoId) {
      getVotacion();
    }
  }, [eventoId]);

  const getVotacion = async () => {
    const data = await getVotacionActiva(eventoId);
    setVotacion(data);
  };

  const handleVotar = async (participanteId) => {
    const yaVoto = localStorage.getItem(localStorageKey);
    if (yaVoto) {
      setMensaje('❌ Ya has votado en esta votación.');
      setShowModal(true);
      return;
    }

    try {
      const res = await enviarVoto(votacion._id, participanteId);
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(localStorageKey, participanteId);
        setMensaje('✅ ¡Voto registrado correctamente!');
      } else {
        setMensaje(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMensaje('❌ No se pudo registrar el voto. Intenta más tarde.');
    }

    setShowModal(true);
  };

  if (!votacion || !votacion.participantes) {
    return <p className={styles.registroMensaje}>No hay votaciones activas en este momento.</p>;
  }

  return (
    <section className={styles.registroContainer}>
      <h4 className={styles.registroTitulo}>Votación Activa</h4>
      <p>Vota por tu participante favorito del evento</p>
      <div className={styles.registroForm}>
        {votacion.participantes.map((p) => (
          <button
            key={p._id}
            className={styles.inscribirseButton}
            onClick={() => handleVotar(p._id)}
          >
            {p.nombreCompleto}
          </button>
        ))}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <p className={styles.registroMensaje}>{mensaje}</p>
        </Modal>
      )}
    </section>
  );
}
