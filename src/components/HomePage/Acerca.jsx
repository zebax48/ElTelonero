import Image from "next/image";

export default function Acerca() {
    return (
        <div className="acerca-container">
            <h2>Acerca de El Telonero Soy Yo</h2>
            <section id="acerca" className="acerca">
                {[1, 2].map(i => (
                    <div key={i} className="columna">
                        <Image src={`/img${i}.png`} alt="img" height={150} width={100} className="imagenAcerca" priority/>
                        {i === 1 && (
                            <>
                                <h4 className="subtitulo">PRESENTACIÓN</h4>
                                <p><strong style={{ color: "#fff", fontSize: "bold" }}>¡El Telonero Soy Yo - Los Enanitos Verdes!</strong>
                                    <br /><br />¿Sientes el rock en la sangre? Esta es tu oportunidad de brillar. Participa en "El Telonero Soy Yo", el concurso que te puede llevar a abrir el concierto “Los Enanitos Verdes”, este 30 de agosto de 2025, compartiendo escenario con artistas de gran trayectoria y frente a una multitud apasionada por este ritmo.<br /></p>
                                <h4 className="subtitulo">¿Cómo participar?</h4>
                                <p>
                                    <strong>Regístrate en nuestro formulario.</strong> Envíanos un video con tu mejor interpretación o una canción original en género rock.
                                    <br /><br />
                                    <strong>Un jurado de expertos seleccionará a los finalistas.</strong>
                                    <br /><br />
                                    💵 La inscripción no tiene ningún costo.
                                    <br /><br />
                                    ¡Anímate y que no se quede nadie sin bailar contigo en la tarima!</p>
                            </>
                        )
                        }
                        {i === 2 && (
                            <>
                                <h4 className="subtitulo">PREMIACIÓN</h4>
                                <p><strong style={{ color: "#fff", fontSize: "bold" }}>Premiación – El Telonero Soy Yo</strong>
                                    <br />
                                    ¡El ritmo se premia en grande!
                                    <br /><br />
                                </p>
                                <h4 className="subtitulo">Primer Lugar</h4>
                                <p>
                                    - Se convierte en el telonero oficial del concierto Los Enanitos Verdes
                                    <br />
                                    - Presentación con 3 canciones en tarima
                                    <br />
                                    - Entrevista exclusiva en radio
                                    <br />
                                    - Asesoría artística profesional para potenciar su carrera
                                    <br />
                                    - Palco VIP para 10 personas en el concierto
                                </p>
                                <h4 className="subtitulo">Segundo Lugar</h4>
                                <p>
                                    - Disfruta el concierto desde un palco con 5 entradas VIP
                                </p>
                                <h4 className="subtitulo">Tercer Lugar</h4>
                                <p>
                                    - También vibra con el rock desde un palco con 5 entradas VIP
                                </p>
                            </>
                        )
                        }
                    </div>
                ))}
            </section>
            <section className="acerca">
                <div className="columna-info">
                    <h4 className="subtitulo">INFORMACIÓN</h4>
                    <p>
                        <strong style={{ color: "#fff", fontSize: "bold" }}>Fecha limite de inscripción:</strong> Domingo 10 de agosto de 2025 o cierre por cupos.
                        <br /><br />

                        <strong style={{ color: "#fff", fontSize: "bold" }}>Eliminatorias:</strong>  Jueves 14 de agosto de 2025.
                        <br /><br />
                        <strong style={{ color: "#fff", fontSize: "bold" }}>Final:</strong> Jueves 21 de agosto de 2025.
                        <br /><br />
                        <strong style={{ color: "#fff", fontSize: "bold" }}>Hora:</strong> Desde las 6:00 p.m.
                        <br /><br />
                        <strong style={{ color: "#fff", fontSize: "bold" }}>Lugar:</strong> Dopamina ROCK - BAR
                        <br />
                        Calle 44 # 80-31 - Laureles
                    </p>
                </div>
            </section>
        </div>

    );
}