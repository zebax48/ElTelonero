import { useRouter } from "next/router";
import { useAuth } from "@/Auth/AuthContext";
import { useState, useEffect } from "react";
import Modal from "@/components/HomePage/Modal";
import Image from "next/image";
import { getActiveVotationId, getActiveEventId } from "@/api/serverConfig";
import { ClipLoader } from "react-spinners";
import { setVotacionStatus, setResultVotacionStatus } from "@/api/eventoApi";
import withAuth from "@/utils/withAuth";
import AdminHeader from "@/components/AdminPage/AdminHeader";
import styles from "@/styles/DashBoard.module.css";
import modalStyles from "@/styles/Modal.module.css";

function DashBoard() {
    const { auth } = useAuth();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [showModalResult, setShowModalResult] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [actionTypeResult, setActionTypeResult] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const handleVotacionAction = (type) => {
        setActionType(type);
        setShowModal(true);
    };

    const confirmAction = async () => {
        const status = actionType === 'abrir';
        try {
            setLoading(true);
            await setVotacionStatus(ACTIVE_EVENT_ID, status, auth.token);

        } catch (error) {
            console.error('Error al confirmar acción:', error);
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    const confirmActionResult = async () => {
        const status = actionTypeResult === 'mostrar';
        try {
            setLoading(true);
            await setResultVotacionStatus(ACTIVE_EVENT_ID, status, auth.token);

        } catch (error) {
            console.error('Error al confirmar acción:', error);
        } finally {
            setLoading(false);
            setShowModalResult(false);
        }
    };

    const handleResultAction = (type) => {
        setActionTypeResult(type);
        setShowModalResult(true);
    };

    return (
        <>
            <AdminHeader />

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <div className={modalStyles.modalContent}>
                        {loading ? (
                            <div className="loaderContainer" style={{ height: '10vh' }}>
                                <ClipLoader color="#fff" loading={loading} size={50} />
                            </div>
                        ) : (
                            <>
                                <Image
                                    src="/alert-icon.png"
                                    alt="Alerta"
                                    width={80}
                                    height={80}
                                    className={modalStyles.alertImage}
                                />
                                <h3>¿Estás seguro?</h3>
                                <p>
                                    Esta acción {actionType === 'abrir' ? 'abrirá' : 'cerrará'} la votación para el público en tiempo real.
                                </p>
                                <div className={modalStyles.modalButtons}>
                                    <button className={modalStyles.confirmButton} onClick={confirmAction}>
                                        Confirmar
                                    </button>
                                    <button className={modalStyles.cancelButton} onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            )}
            {showModalResult && (
                <Modal onClose={() => setShowModalResult(false)}>
                    <div className={modalStyles.modalContent}>
                        {loading ? (
                            <div className="loaderContainer" style={{ height: '10vh' }}>
                                <ClipLoader color="#fff" loading={loading} size={50} />
                            </div>
                        ) : (
                            <>
                                <Image
                                    src="/alert-icon.png"
                                    alt="Alerta"
                                    width={80}
                                    height={80}
                                    className={modalStyles.alertImage}
                                />
                                <h3>¿Estás seguro?</h3>
                                <p>
                                    Esta acción {actionTypeResult === 'mostrar' ? 'mostrará' : 'cerrará'} los resultados de la votación para el público en tiempo real.
                                    <br />
                                    Además, la votación se cerrará automáticamente.
                                </p>
                                <div className={modalStyles.modalButtons}>
                                    <button className={modalStyles.confirmButton} onClick={confirmActionResult}>
                                        Confirmar
                                    </button>
                                    <button className={modalStyles.cancelButton} onClick={() => setShowModalResult(false)}>
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            )}
            <section className={styles.container}>
                <div className={styles.backgroundWrapper}>
                    <Image
                        src="/gallery5.jpg"
                        alt="gallery"
                        fill
                        className={styles.backgroundImage}
                        priority
                    />
                </div>
                <h4 style={{ fontSize: '2.5rem', margin: '0 auto' }}>Dashboard</h4>
                <div className={styles.buttonContainer}>
                    <button className={styles.button} onClick={() => router.push('/formulario/evento')}>
                        Crear Evento
                    </button>
                    <button className={styles.button} onClick={() => router.push(`/formulario/registro`)}>
                        Crear Participante
                    </button>
                    <button className={styles.button} onClick={() => router.push(`/votar/${ACTIVE_VOTATION_ID}`)}>
                        Votar
                    </button>
                    <button className={styles.button} onClick={() => router.push('/votacion/page')}>
                        Crear Votación
                    </button>
                    <button className={styles.button} onClick={() => router.push(`/admin/participantes`)}>
                        Ver Participantes
                    </button>
                </div>
                <h4 style={{ fontSize: '2.5rem', margin: '1em auto', minWidth: '100%', textAlign:'center'}}>Control de Votación</h4>
                <div className={styles.buttonContainer}>
                    <button className={styles.button} onClick={() => handleVotacionAction('abrir')}>
                        Activar Votación
                    </button>
                    <button className={styles.button} onClick={() => handleVotacionAction('cerrar')}>
                        Cerrar Votación
                    </button>
                    <button className={styles.button} onClick={() => handleResultAction('mostrar')}>
                        Mostrar Resultados
                    </button>
                    <button className={styles.button} onClick={() => handleResultAction('cerrar')}>
                        Cerrar Resultados
                    </button>
                </div>
            </section>
        </>

    );
}

export default withAuth(DashBoard);