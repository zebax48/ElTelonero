import React, { useState } from 'react';
import Modal from '@/components/AdminPage/Modal';
import { BASE_URL } from '@/api/serverConfig';
import AdminHeader from '@/components/AdminPage/AdminHeader';
import styles from '@/styles/CrearEvento.module.css';

export default function CrearEvento() {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    lugar: '',
    descripcion: '',
    estado: 'abierto',
    capacidad: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok) {
      setMensaje('✅ Evento creado exitosamente.');
      setFormData({
        nombre: '',
        fecha: '',
        lugar: '',
        descripcion: '',
        estado: 'abierto',
        capacidad: ''
      });
    } else {
      setMensaje(`❌ Error: ${data.error || 'No se pudo crear el evento.'}`);
    }

    setShowModal(true);
  };

  return (
    <>
      <AdminHeader />
      <section className={styles.container}>
        <h2 className={styles.titulo}>Crear Nuevo Evento</h2>
        <form className={styles.formulario} onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del evento"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lugar"
            placeholder="Lugar"
            value={formData.lugar}
            onChange={handleChange}
          />
          <textarea
            name="descripcion"
            placeholder="Descripción del evento"
            value={formData.descripcion}
            onChange={handleChange}
          />
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="abierto">Abierto</option>
            <option value="cerrado">Cerrado</option>
          </select>
          <input
            type="number"
            name="capacidad"
            placeholder="Capacidad máxima"
            value={formData.capacidad}
            onChange={handleChange}
          />
          <button type="submit" className={styles.boton}>Crear Evento</button>
        </form>

        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <p>{mensaje}</p>
          </Modal>
        )}
      </section>
    </>

  );
}