import React, { useState, useEffect } from 'react';
import { getEventos } from '@/api/eventoApi';
import { getParticipantes } from '@/api/participanteApi';
import { createVotacion } from '@/api/votacionApi';
import { ClipLoader } from 'react-spinners';
import { useRouter } from 'next/router';
import Modal from '@/components/AdminPage/Modal';
import styles from '@/styles/FormularioRegistro.module.css';

export default function CrearVotacion() {
    const router = useRouter();
    const [eventos, setEventos] = useState([]);
    const [participantes, setParticipantes] = useState([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState('');
    const [participantesSeleccionados, setParticipantesSeleccionados] = useState([]);
    const [duracionMinutos, setDuracionMinutos] = useState(10);
    const [mensaje, setMensaje] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchEventos();
    }, []);

    const fetchEventos = async () => {
        try {
            const res = await getEventos();
            console.log('Eventos:', res);
            setEventos(res);
        } catch (error) {
            console.error('Error fetching eventos:', error);
        }
    };

    useEffect(() => {
        if (eventoSeleccionado) {
            fetchParticipantes();
        }
    }, [eventoSeleccionado]);

    const fetchParticipantes = async () => {
        try {
            const res = await getParticipantes(eventoSeleccionado);
            setParticipantes(res);
        } catch (error) {
            console.error('Error fetching participantes:', error);
        }
    };

    const toggleSeleccion = (id) => {
        setParticipantesSeleccionados(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    if (!eventos) {
        return <div className='loaderContainer' style={{ height: '100vh' }}><ClipLoader color="#fff" loading={true} size={50} /></div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const obj = {
                evento: eventoSeleccionado,
                participantes: participantesSeleccionados,
                duracionMinutos: Number(duracionMinutos)
            };
            const res = await createVotacion(obj);

            if (res.ok) {
                setMensaje('✅ Votación creada exitosamente');
                setEventoSeleccionado('');
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
                <select
                    value={eventoSeleccionado}
                    onChange={(e) => setEventoSeleccionado(e.target.value)}
                    required
                >
                    <option value="">-- Selecciona un evento --</option>
                    {eventos.map(e => (
                        <option key={e._id} value={e._id}>{e.nombre}</option>
                    ))}
                </select>

                {participantes.length > 0 && (
                    <div>
                        <p>Selecciona los participantes para la votación:</p>
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
                )}

                <input
                    type="number"
                    min="1"
                    value={duracionMinutos}
                    onChange={(e) => setDuracionMinutos(e.target.value)}
                    placeholder="Duración en minutos"
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