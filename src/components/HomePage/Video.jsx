export default function Video({ url, title }) {
  return (
    <section className="video" id="videos">
      <div className="video-wrapper">
        <h4>{title}</h4>
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