"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Header() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
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
                        <li><a href="#inscripcion" onClick={() => setOpen(false)}>Inscripción</a></li>
                        <li><a href="#acerca" onClick={() => setOpen(false)}>Acerca</a></li>
                        <li><a href="#galeria" onClick={() => setOpen(false)}>Galería</a></li>
                        <li><a href="#videos" onClick={() => setOpen(false)}>Videos</a></li>
                        <li><a onClick={() => router.push('/admin/dashboard')}>Admin</a></li>
                    </ul>
                )}
            </nav>
        </header>
    );
}