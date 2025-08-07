import ListaParticipantes from "@/components/AdminPage/ListaParticipantesByEvent";
import AdminHeader from "@/components/AdminPage/AdminHeader";

export default function ParticipantesPage() {

    return (
        <div>
            <AdminHeader />
            <ListaParticipantes/>
        </div>
    );
}