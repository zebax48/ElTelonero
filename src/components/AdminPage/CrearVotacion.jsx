import React, { useState, useEffect } from 'react';
import { getParticipantes } from '@/api/participanteApi';
import { createVotacion } from '@/api/votacionApi';
import { ClipLoader } from 'react-spinners';
import { useRouter } from 'next/router';
import { useAuth } from '@/Auth/AuthContext';
import { getActiveEventId } from '@/api/serverConfig';
import withAuth from '@/utils/withAuth';
import Modal from '@/components/HomePage/Modal';
import styles from '@/styles/FormularioRegistro.module.css';

function CrearVotacion() {
    const { auth } = useAuth();
    const router = useRouter();
    const [participantes, setParticipantes] = useState([]);
    const [participantesSeleccionados, setParticipantesSeleccionados] = useState([]);
    const [duracionMinutos, setDuracionMinutos] = useState(10);
    const [mensaje, setMensaje] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [ACTIVE_EVENT_ID, setActiveEventId] = useState(null);
    useEffect(() => {
        const fetchActiveEventId = async () => {
            const id = await getActiveEventId();
            setActiveEventId(id);
        };
        fetchActiveEventId();
    }, []);

    useEffect(() => {
        fetchParticipantes();
    }, [ACTIVE_EVENT_ID]);


    const fetchParticipantes = async () => {
        try {
            setLoading(true);
            if (!ACTIVE_EVENT_ID) {
                return;
            }
            const res = await getParticipantes(ACTIVE_EVENT_ID, auth.token);
            setParticipantes(res);
        } catch (error) {
            console.error('Error fetching participantes:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSeleccion = (id) => {
        setParticipantesSeleccionados(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    if (loading) {
        return <div className='loaderContainer' style={{ height: '100vh' }}><ClipLoader color="#fff" loading={true} size={50} /></div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const obj = {
                evento: ACTIVE_EVENT_ID,
                participantes: participantesSeleccionados,
                duracionMinutos: Number(duracionMinutos)
            };
            const res = await createVotacion(obj, auth.token);

            if (res.ok) {
                setMensaje('✅ Votación creada exitosamente');
                setParticipantesSeleccionados([]);
                setDuracionMinutos(10);
            } else {
                setMensaje(`❌ Error: ${res.error}`);
            }
        } catch (error) {
            setMensaje('❌ Error al conectar con el servidor');
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setMensaje(null);
        router.push(`/`);
    };

    return (
        <section className={styles.registroContainer}>
            <h4 className={styles.registroTitulo}>Crear Nueva Votación</h4>
            <form className={styles.registroForm} onSubmit={handleSubmit}>
                {participantes.length > 0 && (
                    <div>
                        <h4 style={{ minWidth: '100%', padding: 0}}>Selecciona los participantes para la votación:</h4>
                        <div className={styles.participantes}>
                            {participantes.map(p => (
                                <label key={p._id} style={{ display: 'block', marginBottom: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={participantesSeleccionados.includes(p._id)}
                                        onChange={() => toggleSeleccion(p._id)}
                                    />{' '}
                                    {p.nombreCompleto}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
                <h4 style={{ minWidth: '100%', padding: 0 }}>Duración de la votación en minutos:</h4>
                <input
                    type="number"
                    min="1"
                    value={duracionMinutos}
                    onChange={(e) => setDuracionMinutos(e.target.value)}
                    placeholder="Duración de la votación en minutos"
                    required
                />

                <button type="submit" className={styles.inscribirseButton}>Crear Votación</button>
            </form>

            {showModal && (
                <Modal onClose={() => handleCloseModal()}>
                    <p className={styles.registroMensaje}>{mensaje}</p>
                </Modal>
            )}
        </section>
    );
}

export default withAuth(CrearVotacion);