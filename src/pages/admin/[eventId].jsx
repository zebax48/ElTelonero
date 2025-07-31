import ListaParticipantes from "@/components/AdminPage/ListaParticipantesByEvent";
import AdminHeader from "@/components/AdminPage/AdminHeader";
import { useRouter } from "next/router";
import { useAuth } from "@/Auth/AuthContext";
import { useEffect } from "react";

export default function ParticipantesPage() {
    const { auth } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!auth.token) {
            router.push('/auth/login');
        }
    }, [auth, router]);

    const { eventId } = router.query;

    return (
        <div>
            <AdminHeader />
            <ListaParticipantes eventId={eventId} />
        </div>
    );
}