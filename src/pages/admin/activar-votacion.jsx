import AdminHeader from "@/components/AdminPage/AdminHeader";
import ActivarVotacion from "@/components/AdminPage/ActivarVotacion";
import withAuth from "@/utils/withAuth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "@/components/HomePage/Modal";
import styles from "@/styles/DashBoard.module.css";
import modalStyles from "@/styles/Modal.module.css";

function ActivarVotacionPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [activated, setActivated] = useState(null);

  const handleActivated = (info) => {
    setActivated(info);
    setShowSuccess(true);
  };

  return (
    <>
      <AdminHeader />
      <section className={styles.container}>
        <div style={{ width: '100%', margin: '1rem 0' }}>
          <ActivarVotacion onVotacionActivada={handleActivated} />
        </div>
      </section>

      {showSuccess && (
        <Modal onClose={() => setShowSuccess(false)}>
          <div className={modalStyles.modalContent}>
            <h3>Votación activada</h3>
            <p>La votación se activó correctamente.</p>
            {activated && (
              <div style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                <p><strong>Evento:</strong> {activated.eventoNombre || '—'}</p>
                <p><strong>Creada:</strong> {activated.createdAt ? new Date(activated.createdAt).toLocaleString() : '—'}</p>
                <p><strong>Inicio:</strong> {activated.fechaInicio ? new Date(activated.fechaInicio).toLocaleString() : '—'}</p>
                <p><strong>Duración:</strong> {activated.duracionMinutos ?? '—'} min</p>
                <p style={{ marginTop: 8 }}><strong>ID:</strong> {activated.id}</p>
              </div>
            )}
            <div className={modalStyles.modalButtons}>
              <button className={modalStyles.cancelButton} onClick={() => router.push('/admin/dashboard')}>
                Ir al Dashboard
              </button>
              {activated?.id && (
                <button className={modalStyles.confirmButton} onClick={() => router.push(`/votar/${activated.id}`)}>
                  Ir a Votar
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default withAuth(ActivarVotacionPage);
