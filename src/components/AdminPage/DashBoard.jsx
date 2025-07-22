import { useRouter } from "next/router";
import styles from "@/styles/DashBoard.module.css";

export default function DashBoard() {
    const router = useRouter();
    const votacionId = "6876ceb92e572e65c4d6121c";
    const eventId = "68765d7100a1498512be8880";
    return (
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
        </section>
    );
}