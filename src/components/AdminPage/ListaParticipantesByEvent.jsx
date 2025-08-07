import React, { use, useEffect, useState } from 'react';
import styles from '@/styles/ListaParticipantesByEvent.module.css';
import { BASE_URL } from '@/api/serverConfig';
import { ClipLoader } from 'react-spinners';
import { getActiveEventId } from '@/api/serverConfig';
import { useAuth } from '@/Auth/AuthContext';
import withAuth from '@/utils/withAuth';

function ListaParticipantes() {
    const [event, setEvent] = useState();
    const [eventId, setEventId] = useState(null);
    const [participantes, setParticipantes] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();

    const getEventId = async () => {
        const id = await getActiveEventId();
        setEventId(id);
    };

    useEffect(() => {
        getEventId();
        if(!eventId) {
            return;
        }
        fetchEvent();
    }, [auth, eventId]);

    const toggleExpand = (id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    if (!eventId || !participantes) {
        return <div className='loaderContainer'><ClipLoader color="#fff" loading={loading} size={100} /></div>;
    }

    async function fetchEvent() {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/eventos/${eventId}`, {
                headers: {
                    Authorization: `${auth.token}`,
                }
            });
            const data = await res.json();
            setEvent(data);
        } catch (error) {
            console.error('Error al obtener el evento:', error);
        } finally {
            fetchParticipantes();
        }
    }

    async function fetchParticipantes() {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/eventos/${eventId}/participantes`,
                {
                    headers: {
                        Authorization: `${auth.token}`,
                    }
                }
            );
            const data = await res.json();
            setParticipantes(data);
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
                <p className={styles.cargando}><ClipLoader color="#fff" loading={loading} size={100} /></p>
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
                            {Array.isArray(participantes) && participantes.length > 0 ? (
                                participantes.map((p, index) => (
                                    <tr key={p?._id}>
                                        <td>{index + 1}</td>
                                        <td>{p?.nombreCompleto}</td>
                                        <td>{p?.correo}</td>
                                        <td>{p?.documento}</td>
                                        <td>{p?.telefono}</td>
                                        <td>
                                            {p?.descripcion?.length > 100 ? (
                                                <>
                                                    {expandedRows[p?._id]
                                                        ? p?.descripcion
                                                        : p?.descripcion.slice(0, 100) + '...'}
                                                    <br />
                                                    <button
                                                        onClick={() => toggleExpand(p?._id)}
                                                        style={{
                                                            color: 'blue',
                                                            border: 'none',
                                                            background: 'none',
                                                            cursor: 'pointer',
                                                            padding: 0,
                                                        }}
                                                    >
                                                        {expandedRows[p?._id] ? 'Ver menos' : 'Ver más'}
                                                    </button>
                                                </>
                                            ) : (
                                                p?.descripcion
                                            )}
                                        </td>
                                        <td>
                                            <a
                                                href={
                                                    p?.enlaceTalento?.startsWith('http')
                                                        ? p?.enlaceTalento
                                                        : `https://${p?.enlaceTalento}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Ver
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center' }}>
                                        No hay participantes disponibles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default withAuth(ListaParticipantes);