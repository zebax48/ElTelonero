export default function Galeria() {
  return (
    <section id="galeria" className="galeria">
      {Array.from({ length: 6 }, (_, i) => (
        <img key={i} src={`/gallery${i + 1}.jpg`} alt={`img-${i}`} className="imagen-galeria" />
      ))}
    </section>
  );
}