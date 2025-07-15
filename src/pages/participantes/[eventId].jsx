import ListaParticipantes from "@/components/AdminPage/ListaParticipantesByEvent";
import { useRouter } from "next/router";

export default function ParticipantesPage() {
    const router = useRouter();
    const { eventId } = router.query;

    return (
        <div>
            <ListaParticipantes eventId={eventId} />
        </div>
    );
}