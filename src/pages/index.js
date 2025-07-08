"use client";

import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Inscripcion from "@/components/Inscripcion";
import Acerca from "@/components/Acerca";
import Galeria from "@/components/Galeria";
import Video from "@/components/Video";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

export default function Home() {
  return (
    <main className="main">
      <Header />
      <Banner />
      <Inscripcion />
      <Acerca />
      <Galeria />
      <Video url="https://www.youtube.com/embed/video1" />
      <Video url="https://www.youtube.com/embed/video2" />
      <Footer />
    </main>
  );
}