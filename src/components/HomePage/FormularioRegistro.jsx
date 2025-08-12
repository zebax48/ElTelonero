import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';
import { BASE_URL } from '@/api/serverConfig';
import { getActiveEventId } from '@/api/serverConfig';
import Modal from '@/components/HomePage/Modal';
import styles from '@/styles/FormularioRegistro.module.css';

export default function FormularioRegistro() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [eventId, setEventId] = useState(null);

    useEffect(() => {
        fetchEventId();
    }, []);

    const fetchEventId = async () => {
        try {
            setLoading(true);
            const id = await getActiveEventId();
            setEventId(id);
        } catch (error) {
            console.error('Error fetching event ID:', error);
        } finally {
            setLoading(false);
        }
    };

    const [formData, setFormData] = useState({
        correo: '',
        nombreCompleto: '',
        documento: '',
        telefono: '',
        descripcion: '',
        enlaceTalento: ''
    });

    const [mensaje, setMensaje] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [success, setSuccess] = useState(false);
    const [linkError, setLinkError] = useState('');

    const normalizeUrlIfValid = (value) => {
        if (!value || value.trim() === '') return { valid: true, url: '' };
        const v = value.trim();
        // Rechazar formatos tipo @usuario o con espacios
        if (v.startsWith('@') || /\s/.test(v)) return { valid: false };
        const tryBuild = (raw) => {
            try {
                const u = new URL(raw);
                const protocolOk = u.protocol === 'http:' || u.protocol === 'https:';
                const hostOk = !!u.hostname && u.hostname.includes('.');
                return protocolOk && hostOk ? u.toString() : null;
            } catch {
                return null;
            }
        };
        let normalized = v.startsWith('http://') || v.startsWith('https://') ? tryBuild(v) : tryBuild(`https://${v}`);
        if (!normalized) return { valid: false };
        return { valid: true, url: normalized };
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    setLoading(true);
        try {
            if (!eventId) {
        setMensaje('❌ No hay un evento activo para registrar.');
        setSuccess(false);
        setShowModal(true);
        return;
            }
            // Validación del enlace de talento si se proporcionó
            setLinkError('');
            const { valid, url } = normalizeUrlIfValid(formData.enlaceTalento);
            if (!valid) {
                setLoading(false);
                setLinkError('Por favor ingresa un enlace válido (ejemplo: https://youtu.be/tu-video).');
                return;
            }
            const payload = { ...formData, enlaceTalento: url };
            const res = await fetch(`${BASE_URL}/eventos/${eventId}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                setMensaje('✅ Registro exitoso. ¡Gracias por participar!');
                setFormData({
                    correo: '',
                    nombreCompleto: '',
                    documento: '',
                    telefono: '',
                    descripcion: '',
                    enlaceTalento: ''
                });
                setLinkError('');
        setSuccess(true);
        setShowModal(true);
            } else {
                setMensaje(`❌ Error: ${data.error}`);
        setSuccess(false);
        setShowModal(true);
            }
        } catch (error) {
        console.log(error);
        setMensaje('❌ Error al conectar con el servidor');
        setSuccess(false);
        setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        const wasSuccess = success;
        setSuccess(false);
        setMensaje(null);
        if (wasSuccess) {
            router.push(`/`);
        }
    };

    return (
        <section className={styles.registroContainer}>
            {loading ? (
                <div className='loaderContainer' style={{ height: '100vh' }}><ClipLoader color="#fff" loading={loading} size={50} /></div>
            ) :
                <>
                    <h4 className={styles.registroTitulo}>Formulario de Registro</h4>

                    <form className={styles.registroForm} onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="correo"
                            placeholder="Correo electrónico"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="nombreCompleto"
                            placeholder="Nombre completo"
                            value={formData.nombreCompleto}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="documento"
                            placeholder="Número de documento"
                            value={formData.documento}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="tel"
                            name="telefono"
                            placeholder="Teléfono de contacto"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="descripcion"
                            placeholder="Comparte una breve descripción sobre ti y tu música."
                            value={formData.descripcion}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="enlaceTalento"
                            placeholder="Pega un enlace, como muestra de tu música o video en línea."
                            value={formData.enlaceTalento}
                            onChange={(e) => { setLinkError(''); handleChange(e); }}
                        />
                        {linkError && (
                            <div className={styles.warning} style={{ color: '#ffaaaa' }}>
                                {linkError}
                            </div>
                        )}

                        <div className={styles.warning}>
                            ⚠️ Asegúrate de que el enlace sea público y accesible sin restricciones. Solo se permite un enlace directo.
                        </div>

                        <button type="submit" className={styles.inscribirseButton}>
                            Inscribirme
                        </button>
                    </form>
                </>
            }


            {showModal && (
                <Modal onClose={handleCloseModal}>
                    <p className={styles.registroMensaje}>{mensaje}</p>
                </Modal>
            )}
        </section>
    );
}