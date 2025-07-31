import Image from "next/image";

export default function Galeria() {
  return (
    <section id="galeria" className="galeria">
      {Array.from({ length: 6 }, (_, i) => (
        i === 4 ?(
          <Image key={i} src={`/gallery${i + 1}.jpg`} alt={`img-${i}`} height={150} width={150} className="imagen-galeria" />
        ) :
        <Image key={i} src={`/gallery${i + 1}.jpg`} alt={`img-${i}`} height={300} width={150} className="imagen-galeria" />
      ))}
    </section>
  );
}