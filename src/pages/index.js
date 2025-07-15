"use client";

import Header from "@/components/HomePage/Header";
import Banner from "@/components/HomePage/Banner";
import Inscripcion from "@/components/HomePage/Inscripcion";
import Acerca from "@/components/HomePage/Acerca";
import Galeria from "@/components/HomePage/Galeria";
import Video from "@/components/HomePage/Video";
import Footer from "@/components/HomePage/Footer";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-animate, .scroll-left, .scroll-right");

    const handleScroll = () => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add("animate");
        } else {
          el.classList.remove("animate");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="main">
      <Header />
      <Banner />
      <section className="scroll-animate"><Inscripcion /></section>
      <section className="scroll-left"><Acerca /></section>
      <section className="scroll-right"><Galeria /></section>
      <section className="scroll-animate"><Video url="https://www.youtube.com/embed/v7pyxHOHunk" /></section>
      <Footer />
    </main>
  );
}