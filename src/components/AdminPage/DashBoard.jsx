import { useRouter } from "next/router";
import Image from "next/image";
import { ACTIVE_EVENT_ID, ACTIVE_VOTATION_ID } from "@/api/serverConfig";
import AdminHeader from "@/components/AdminPage/AdminHeader";
import styles from "@/styles/DashBoard.module.css";

export default function DashBoard() {
    const router = useRouter();
    const votacionId = ACTIVE_VOTATION_ID;
    const eventId = ACTIVE_EVENT_ID;
    return (
        <>
            <AdminHeader />
            <section className={styles.container}>
                <h4>Dashboard</h4>
                <div className={styles.buttonContainer}>
                    <button className={styles.button} onClick={() => router.push('/formulario/evento')}>
                        Crear Evento
                    </button>
                    <button className={styles.button} onClick={() => router.push(`/formulario/${votacionId}`)}>
                        Crear Participante
                    </button>
                    <button className={styles.button} onClick={() => router.push(`/votar/${votacionId}`)}>
                        Votar
                    </button>
                    <button className={styles.button} onClick={() => router.push(`/admin/${eventId}`)}>
                        Ver Participantes
                    </button>
                </div>
                <Image src="/gallery5.jpg" alt="gallery" width={500} height={250} className="image" />
            </section>
        </>

    );
}