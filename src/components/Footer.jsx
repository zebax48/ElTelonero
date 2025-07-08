export default function Footer() {
  return (
    <footer className="footer">
      <nav className="footer-nav">
        <a href="#inscripcion">Inscripción</a>
        <a href="#acerca">Acerca</a>
        <a href="#galeria">Galería</a>
        <a href="#videos">Videos</a>
      </nav>
      <p className="copyright">&copy; Copyright {new Date().getFullYear()} El Telonero Soy Yo - Todos los derechos reservados.</p>
    </footer>
  );
}