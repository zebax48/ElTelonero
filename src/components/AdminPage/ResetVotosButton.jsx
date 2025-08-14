import React, { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/HomePage/Modal';
import { ClipLoader } from 'react-spinners';
import { resetVotosPorEvento } from '@/api/participanteApi';
import modalStyles from '@/styles/Modal.module.css';

export default function ResetVotosButton({ eventId, token, className }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const onConfirm = async () => {
    try {
      setLoading(true);
      const res = await resetVotosPorEvento(eventId, token);
      if (res?.error) {
        setMensaje(`❌ ${res.error}`);
      } else {
        setMensaje(`✅ ${res.mensaje} (${res.modificados} participantes actualizados)`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCerrarAfter = () => {
    setOpen(false);
    setMensaje('');
  };

  return (
    <>
      <button className={className} onClick={() => setOpen(true)} disabled={!eventId}>
        Resetear Votos del Evento
      </button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className={modalStyles.modalContent}>
            {loading ? (
              <div className="loaderContainer" style={{ height: '10vh' }}>
                <ClipLoader color="#fff" loading={loading} size={50} />
              </div>
            ) : (
              <>
                <Image src="/alert-icon.png" alt="Alerta" width={80} height={80} className={modalStyles.alertImage} />
                <h3>¿Estás absolutamente seguro?</h3>
                <p>
                  Esta acción reiniciará los votos de todos los participantes asociados al evento actual. No se puede deshacer.
                </p>
                {mensaje && <p style={{ marginTop: '0.5rem' }}>{mensaje}</p>}
                {!mensaje ? (
                  <div className={modalStyles.modalButtons}>
                    <button className={modalStyles.confirmButton} onClick={onConfirm}>
                      Confirmar
                    </button>
                    <button className={modalStyles.cancelButton} onClick={() => setOpen(false)}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button className={modalStyles.cancelButton} onClick={() => handleCerrarAfter()}>
                    Cerrar
                  </button>
                )}

              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
