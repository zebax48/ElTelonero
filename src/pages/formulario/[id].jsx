import FormularioRegistro from "@/components/AdminPage/FormularioRegistro";
import Banner from "@/components/HomePage/Banner";
import { useRouter } from "next/router";

export default function FormularioRegistroPage({ params }) {
    const router = useRouter();
    const { eventoId } = router.query;
    return (
        <>
            <Banner />
            <FormularioRegistro eventoId={eventoId} />
        </>
    );
}