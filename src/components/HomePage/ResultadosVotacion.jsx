'use client';

import { useEffect, useState } from "react";
import { getVotacion } from "@/api/votacionApi";
import { ACTIVE_VOTATION_ID } from "@/api/serverConfig";
import ConfettiExplosion from "react-confetti-explosion";
import { ClipLoader } from "react-spinners";
import styles from "@/styles/ResultadosVotacion.module.css";

const ResultadosScreen = () => {

  const [participantes, setParticipantes] = useState([]);
  const [ganador, setGanador] = useState(null);
  const [segundo, setSegundo] = useState(null);
  const [tercero, setTercero] = useState(null);
  const [eventoNombre, setEventoNombre] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetchData();

    const interval = setInterval(() => {
      setShowConfetti(false);
      setTimeout(() => setShowConfetti(true), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, [ACTIVE_VOTATION_ID]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const votacion = await getVotacion(ACTIVE_VOTATION_ID);
      if (votacion && votacion._id && Array.isArray(votacion.participantes)) {
        setEventoNombre(votacion.evento?.nombre || '');
        const ordenados = [...votacion.participantes].sort((a, b) => (b.votos || 0) - (a.votos || 0));
        setParticipantes(ordenados);
        setGanador(ordenados[0]);
        setSegundo(ordenados[1]);
        setTercero(ordenados[2]);
      }
    } catch (error) {
      console.error('Error al obtener los resultados de la votación:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className='loaderContainer'><ClipLoader color="#fff" loading={true} size={100} /></div>;
  }

  return (
    <div className={styles.resultadosContainer}>
      <h1 className={styles.titulo}>
        🏆 Resultados de la votación {eventoNombre && `– ${eventoNombre}`}
      </h1>

      {isClient &&showConfetti && (
        <div className={styles.confettiContainer}>
          <ConfettiExplosion />
          <ConfettiExplosion />
          </div>)}

      {ganador && (
        <div className={styles.cardGanador}>
          <div className={styles.medalla}>🥇</div>
          <h2 className={styles.nombreGanador}>{ganador.nombreCompleto}</h2>
          <p className={styles.votos}><strong>Votos: </strong>{ganador.votos || 0}</p>
        </div>
      )}

      <div className={styles.segundoTerceroContainer}>
        {segundo && (
          <div className={styles.cardSegundo}>
            <div className={styles.medalla}>🥈</div>
            <h4>{segundo.nombreCompleto}</h4>
            <p className={styles.votos}><strong>Votos: </strong>{segundo.votos || 0}</p>
          </div>
        )}

        {tercero && (
          <div className={styles.cardTercero}>
            <div className={styles.medalla}>🥉</div>
            <h4>{tercero.nombreCompleto}</h4>
            <p className={styles.votos}><strong>Votos: </strong>{tercero.votos || 0}</p>
          </div>
        )}
      </div>

      {participantes.length > 3 && (
        <div className={styles.restantes}>
          <h2>🏅 Participantes restantes</h2>
          {participantes.slice(3).map((p) => (
            <p key={p._id}>
              {p.nombreCompleto} - {p.votos || 0} votos
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultadosScreen;