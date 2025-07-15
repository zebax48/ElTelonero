import React, { useEffect, useState } from 'react';
import styles from '@/styles/ListaParticipantesByEvent.module.css';
import { BASE_URL } from '@/api/serverConfig';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';

export default function ListaParticipantes() {
    const router = useRouter();
    const { eventId } = router.query;
    const [event, setEvent] = useState();
    const [participantes, setParticipantes] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!eventId) return;
        fetchEvent();
    }, [eventId]);

    const toggleExpand = (id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    if (!eventId) {
        return <div className='loaderContainer' style={{ height: '100vh' }}><ClipLoader color="#fff" loading={loading} size={50} /></div>;
    }

    async function fetchEvent() {
        try {
            const res = await fetch(`${BASE_URL}/eventos/${eventId}`);
            const data = await res.json();
            setEvent(data);
            console.log('Evento:', data);
        } catch (error) {
            console.error('Error al obtener el evento:', error);
        } finally {
            fetchParticipantes();
        }
    }

    async function fetchParticipantes() {
        try {
            const res = await fetch(`${BASE_URL}/eventos/${eventId}/participantes`);
            const data = await res.json();
            setParticipantes(data);
            console.log('Participantes:', data);
        } catch (error) {
            console.error('Error al obtener los participantes:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className={styles.container}>
            <h2 className={styles.titulo}>{event?.nombre}</h2>
            <div className={styles.eventoInfo}>
                <p><strong>Fecha:</strong> {new Date(event?.fecha).toLocaleDateString()}</p>
                <p><strong>Lugar:</strong> {event?.lugar}</p>
                <p><strong>Número maximo de participantes:</strong> {event?.capacidad}</p>
            </div>
            {loading ? (
                <p className={styles.cargando}>Cargando...</p>
            ) : participantes.length === 0 ? (
                <p className={styles.sinDatos}>No hay participantes registrados aún.</p>
            ) : (
                <div className={styles.tablaResponsive}>
                    <table className={styles.tabla}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Documento</th>
                                <th>Teléfono</th>
                                <th>Descripción</th>
                                <th>Enlace</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participantes.map((p, index) => (
                                <tr key={p._id}>
                                    <td>{index + 1}</td>
                                    <td>{p.nombreCompleto}</td>
                                    <td>{p.correo}</td>
                                    <td>{p.documento}</td>
                                    <td>{p.telefono}</td>
                                    <td>
                                        {p.descripcion.length > 100 ? (
                                            <>
                                                {expandedRows[p._id]
                                                    ? p.descripcion
                                                    : p.descripcion.slice(0, 100) + '...'}
                                                <br />
                                                <button
                                                    onClick={() => toggleExpand(p._id)}
                                                    style={{ color: 'blue', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                                                >
                                                    {expandedRows[p._id] ? 'Ver menos' : 'Ver más'}
                                                </button>
                                            </>
                                        ) : (
                                            p.descripcion
                                        )}
                                    </td>

                                    <td>
                                        <a
                                            href={
                                                p.enlaceTalento.startsWith('http')
                                                    ? p.enlaceTalento
                                                    : `https://${p.enlaceTalento}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Ver
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}