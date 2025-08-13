'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.play().catch(err =>
        console.warn('Autoplay prevented:', err.message)
      );
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Video de fondo con fallback a imagen */}
      <video
        ref={videoRef}
        src="/Video_Listo_Biopiscina_Ecobrutalista.webm"
        poster="/gallery/IMG_20210525_153434.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Capa de contraste */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Contenido centrado */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-4 text-center">
        {/* Logo en círculo con enlace */}
        <Link href="/products" className="bg-white rounded-full overflow-hidden p-2 w-28 h-28 sm:w-32 sm:h-32 mb-4 flex items-center justify-center hover:scale-105 transition-transform duration-300">
          <Image
            src="/logo_blue-garden.webp"
            alt="Logo Blue Garden"
            width={96}
            height={96}
            className="object-contain"
          />
        </Link>

        {/* Título */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
          Blue Garden
        </h1>

        {/* Subtítulo */}
        <p className="max-w-xl text-sm sm:text-base md:text-lg lg:text-xl text-white drop-shadow-lg">
          Estanques · BioPiscinas · Ecosistemas Acuáticos
        </p>
      </div>
    </section>
  );
}
