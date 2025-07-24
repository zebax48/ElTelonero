"use client";
import { useState } from "react";
import { ACTIVE_EVENT_ID, ACTIVE_VOTATION_ID } from "@/api/serverConfig";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleClick = (route) => {
        setOpen(false);
        router.push(`/${route}`);
    }
    return (
        <header className="header">
            <h1 className="title">El Telonero Soy Yo</h1>
            <nav className="nav">
                <button onClick={() => setOpen(!open)} className="menu-button">
                    <div className="menu-image-container">
                        <Image src="/menu.png" alt="menu" width={30} height={30} className="menu-button-image" />
                    </div>
                </button>
                {open && (
                    <ul className="dropdown">
                        <li><a onClick={() => handleClick('admin/dashboard')}>Dashboard</a></li>
                        <li><a onClick={() => handleClick(`admin/${ACTIVE_EVENT_ID}`)}>Participantes</a></li>
                        <li><a onClick={() => handleClick(`votar/${ACTIVE_VOTATION_ID}`)}>Votar</a></li>
                        <li><a onClick={() => handleClick(`votacion/resultados`)}>Resultados Votación</a></li>
                        <li><a onClick={() => handleClick('formulario/evento')}>Crear Evento</a></li>
                        <li><a onClick={() => handleClick(`formulario/${ACTIVE_VOTATION_ID}`)}>Crear Participante</a></li>
                    </ul>
                )}
            </nav>
        </header>
    );
}