import AdminHeader from "@/components/AdminPage/AdminHeader";
import SeleccionarEventoActivo from "@/components/AdminPage/SeleccionarEventoActivo";
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/router";
import styles from "@/styles/DashBoard.module.css";

function SeleccionarEventoPage() {
  const router = useRouter();

  return (
    <>
      <AdminHeader />
      <section className={styles.container}>
        <h4
          style={{
            fontSize: '2rem',
            margin: '0.5rem auto 1.5rem',
            minWidth: '100%',
            textAlign: 'center',
          }}
        >
          Seleccionar Evento Activo
        </h4>
        <p
          style={{
            textAlign: 'center',
            opacity: 0.75,
            marginBottom: '1.5rem',
            fontSize: '1rem',
          }}
        >
          El evento marcado como <strong>Activo</strong> es al que apuntará el formulario de inscripción público.
        </p>

        <div style={{ width: '100%', margin: '0 0 2rem' }}>
          <SeleccionarEventoActivo />
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            className={styles.button}
            onClick={() => router.push('/admin/dashboard')}
          >
            ← Volver al Dashboard
          </button>
        </div>
      </section>
    </>
  );
}

export default withAuth(SeleccionarEventoPage);
