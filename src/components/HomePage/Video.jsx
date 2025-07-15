export default function Video({ url }) {
  return (
    <section className="video" id="videos">
      <div className="video-wrapper">
        <h4>PROMO 2025</h4>
        <iframe
          src={url}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}