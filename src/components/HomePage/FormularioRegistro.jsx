import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';
import { BASE_URL } from '@/api/serverConfig';
import { ACTIVE_EVENT_ID } from '@/api/serverConfig';
import Modal from '@/components/HomePage/Modal';
import styles from '@/styles/FormularioRegistro.module.css';

export default function FormularioRegistro() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const eventId = ACTIVE_EVENT_ID

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!eventId) {
                throw new Error('Falta el eventId del evento');
            }
            const res = await fetch(`${BASE_URL}/eventos/${eventId}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
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
            } else {
                setMensaje(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            console.log(error);
            return;
        } finally {
            setLoading(false);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setMensaje(null);
        router.push(`/`);
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
                            onChange={handleChange}
                        />

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