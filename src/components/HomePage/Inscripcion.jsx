import { useRouter } from 'next/router';

export default function Inscripcion() {
    const router = useRouter();
    let id = "68765d7100a1498512be8880";
    const handleClick = () => {
        router.push(`/formulario/${id}`);
    };
    return (
        <section id="inscripcion" className="inscripcion">
            <p>"El Telonero Soy Yo" es un concurso musical y motivador que busca descubrir y promover nuevos talentos en diferentes géneros.</p>
                <button className="inscribirse-button" onClick={handleClick}>¡INSCRIBETE AHORA!</button>
        </section>
    );
}