"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getActiveVotationId } from "@/api/serverConfig";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Auth/AuthContext";

export default function Header() {
    const [open, setOpen] = useState(false);   
    const router = useRouter();
    const { logout } = useAuth();
    const [ACTIVE_VOTATION_ID, setActiveVotationId] = useState(null);
    useEffect(() => {
        const fetchActiveVotationId = async () => {
            const id = await getActiveVotationId();
            setActiveVotationId(id);
        };
        fetchActiveVotationId();
    }, []);

    const handleClick = (route) => {
        setOpen(false);
        router.push(`/${route}`);
    }

    const handleCerrarSesion = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

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
                        <li><a onClick={() => handleClick('')}>Inicio</a></li>
                        <li><a onClick={() => handleClick('admin/dashboard')}>Dashboard</a></li>
                        <li><a onClick={() => handleClick(`admin/participantes`)}>Participantes</a></li>
                        <li><a onClick={() => handleClick(`votar/${ACTIVE_VOTATION_ID}`)}>Votar</a></li>
                        <li><a onClick={() => handleClick(`votacion/resultados`)}>Resultados Votación</a></li>
                        <li><a onClick={() => handleClick('formulario/evento')}>Crear Evento</a></li>
                        <li><a onClick={() => handleClick(`formulario/${ACTIVE_VOTATION_ID}`)}>Crear Participante</a></li>
                        <li className="logout"><a onClick={() => handleCerrarSesion()}>Cerrar Sesión</a></li>
                    </ul>
                )}
            </nav>
        </header>
    );
}