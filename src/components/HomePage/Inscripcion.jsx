import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getActiveVotacion } from "@/api/eventoApi";
import { getActiveEventId, getActiveVotationId } from '@/api/serverConfig';
import { ClipLoader } from 'react-spinners';

export default function Inscripcion() {
  const [votacionStatus, setVotacionStatus] = useState(null);
  const [showVotingResults, setShowVotingResults] = useState(false);
  const router = useRouter();
  const [ACTIVE_VOTATION_ID, setActiveVotationId] = useState(null);
  useEffect(() => {
    const fetchActiveVotationId = async () => {
      const id = await getActiveVotationId();
      setActiveVotationId(id);
    };
    fetchActiveVotationId();
  }, []);
  const [ACTIVE_EVENT_ID, setActiveEventId] = useState(null);

  useEffect(() => {
    const fetchActiveEventId = async () => {
      const id = await getActiveEventId();
      setActiveEventId(id);
    };
    fetchActiveEventId();
  }, []);

  const getVotacionStatus = async () => {
    try {
      if (!ACTIVE_EVENT_ID) {
        return;
      }

      const res = await getActiveVotacion(ACTIVE_EVENT_ID);
      const isActive = res.votacionActiva;
      const showResults = res.mostrarResultadosVotacion;
      setShowVotingResults(showResults);
      setVotacionStatus(isActive);
      console.log('Votacion activa:', isActive);
    } catch (error) {
      console.error('Error fetching votacion status:', error);
    } finally {
      setTimeout(getVotacionStatus, 10000);
    }
  };

  useEffect(() => {
    getVotacionStatus();
  }, [ACTIVE_EVENT_ID]);

  const handleClick = (type) => {
    switch (type) {
      case 'resultados':
        router.push(`/votacion/resultados`);
        break;
      case 'votar':
        router.push(`/votar/${ACTIVE_VOTATION_ID}`);
        break;
      case 'inscripcion':
        router.push(`/formulario/registro`);
        break;
      default:
        break;
    }
  }

  return (
    <section id="inscripcion" className="inscripcion">
      <p>"El Telonero Soy Yo" es un concurso musical y motivador que busca descubrir y promover nuevos talentos en diferentes géneros.</p>
      {votacionStatus === null ? (
        <ClipLoader color="#fff" loading={true} size={50} />
      )
        : showVotingResults === true ? (
          <button className='inscribirse-button' onClick={() => handleClick('resultados')}>¡VER RESULTADOS!</button>
        )
          : votacionStatus === true ? (
            <button className="inscribirse-button" onClick={() => handleClick('votar')}>¡VOTA AHORA!</button>
          ) : votacionStatus === false && showVotingResults === false ? (
            <button className="inscribirse-button" onClick={() => handleClick('inscripcion')}>¡INSCRIBETE AHORA!</button>
          ) : (
            <p></p>
          )}

    </section>
  );
}