'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const videoRef = useRef(null);
  const popWrapRef = useRef(null);   // wrapper que contiene logo + popover
  const panelRef = useRef(null);     // panel para medir altura
  const [open, setOpen] = useState(false);
  const [panelH, setPanelH] = useState(0); // altura dinámica del panel

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) vid.play().catch(err => console.warn('Autoplay prevented:', err?.message));
  }, []);

  // Medir altura del panel cuando se abre o al redimensionar
  useEffect(() => {
    function measure() {
      if (panelRef.current) {
        const h = panelRef.current.getBoundingClientRect().height || 0;
        setPanelH(Math.ceil(h) + 12); // +12px de respiro
      }
    }
    if (open) {
      // esperar a que el panel se pinte
      requestAnimationFrame(measure);
      window.addEventListener('resize', measure);
    }
    return () => window.removeEventListener('resize', measure);
  }, [open]);

  // Cerrar al hacer click fuera o con ESC
  useEffect(() => {
    function onClickOutside(e) {
      if (open && popWrapRef.current && !popWrapRef.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Video de fondo */}
      <video
        ref={videoRef}
        src="/Video_Listo_Biopiscina_Ecobrutalista.webm"
        poster="/gallery/IMG_20210525_153434.webp"
        autoPlay muted loop playsInline preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Capa de contraste */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* Contenido */}
      <div className="relative z-[2] w-full h-full flex flex-col items-center justify-center px-4 text-center">
        {/* Logo + Popover */}
        <div className="relative" ref={popWrapRef}>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="bg-white rounded-full overflow-hidden p-2 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center ring-2 ring-transparent hover:ring-fuchsia-600 focus:outline-none focus:ring-4 focus:ring-fuchsia-300 transition-all duration-200"
          >
            <Image
              src="/logo_blue-garden.webp"
              alt="Logo Blue Garden"
              width={96} height={96}
              className="object-contain" priority
            />
          </button>

          {/* Ventana de opciones (absoluta) */}
          {open && (
            <div
              ref={panelRef}
              role="menu"
              aria-label="Accesos rápidos"
              className="absolute left-1/2 -translate-x-1/2 mt-3 w-[min(92vw,22rem)] rounded-2xl backdrop-blur bg-white/10 border border-white/20 shadow-xl p-3"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/servicios"
                  className="flex-1 text-center rounded-full px-5 py-3 text-sm sm:text-base font-semibold ring-2 ring-green-600 text-white hover:bg-fuchsia-600 hover:ring-fuchsia-600 transition-colors duration-200"
                  onClick={() => setOpen(false)}
                >
                  Servicios
                </Link>
                <Link
                  href="/products"
                  className="flex-1 text-center rounded-full px-5 py-3 text-sm sm:text-base font-semibold ring-2 ring-green-600 text-white hover:bg-fuchsia-600 hover:ring-fuchsia-600 transition-colors duration-200"
                  onClick={() => setOpen(false)}
                >
                  Productos
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Espaciador dinámico que empuja el título cuando el panel está abierto */}
        <div
          aria-hidden="true"
          className="transition-[height] duration-300 ease-out"
          style={{ height: open ? panelH : 16 }} // 16px cuando está cerrado
        />

        {/* Título */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
          Blue Garden
        </h1>

        {/* Subtítulo */}
        <p className="max-w-xl text-sm sm:text-base md:text-lg lg:text-xl text-white/95 drop-shadow-lg">
          Estanques · BioPiscinas · Ecosistemas Acuáticos
        </p>
      </div>
    </section>
  );
}
