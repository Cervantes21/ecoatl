// components/Testimonial.jsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import galleryData from '@/data/gallery-data.json' assert { type: 'json' };
import testimonialMeta from '@/data/testimonial.json' assert { type: 'json' };

const FALLBACK_IMG = '/gallery/goldfish.webp';

/* ===== Helpers ===== */
function getAvailableProjectIdsFromGallery(data) {
  const node = data?.testimonials || {};
  return Object.keys(node)
    .filter((k) => k !== '_files')
    .sort((a, b) => {
      const na = parseInt(a.replace(/\D/g, ''), 10);
      const nb = parseInt(b.replace(/\D/g, ''), 10);
      if (Number.isNaN(na) || Number.isNaN(nb)) return a.localeCompare(b);
      return na - nb;
    });
}

function metaById(id) {
  const defaults = testimonialMeta?.defaults || {};
  const found = testimonialMeta?.items?.find((x) => x.id === id) || {};
  return {
    id,
    comment: found.comment || defaults.comment || '“Proyecto Atl Ecosystem.”',
    author: found.author || defaults.author || 'Cliente',
    date: found.date || defaults.date || 'Reciente',
  };
}

function buildProjects(gallery, meta) {
  const ids = getAvailableProjectIdsFromGallery(gallery);
  return ids.map((id) => ({
    ...metaById(id),
    images: [
      `/gallery/testimonials/${id}/before.webp`,
      `/gallery/testimonials/${id}/after.webp`,
    ],
  }));
}

/* ===== Componente principal ===== */
export default function Testimonial({ maxItems, intervalMs = 3000 }) {
  const allProjects = useMemo(() => buildProjects(galleryData, testimonialMeta), []);
  const projects = useMemo(
    () => (maxItems ? allProjects.slice(0, maxItems) : allProjects),
    [allProjects, maxItems]
  );

  if (!projects?.length) return null;

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-teal-600">Antes / Después</h2>
          <p className="text-gray-600">Proyectos recientes de biopiscinas, estanques y ecosistemas</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((item) => (
            <FadeCarousel key={item.id} project={item} intervalMs={intervalMs} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Tarjeta con fade y controles ===== */
function FadeCarousel({ project, intervalMs }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sources, setSources] = useState(project.images);
  const containerRef = useRef(null);

  // Pausar si no está en viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setPaused(!entry.isIntersecting)),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % sources.length);
    }, Math.max(1500, intervalMs));
    return () => clearInterval(id);
  }, [paused, sources.length, intervalMs]);

  // Fallback si una imagen falla
  const handleErrorAt = (idx) => {
    setSources((prev) => prev.map((s, i) => (i === idx ? FALLBACK_IMG : s)));
  };

  // Accesibilidad con teclado
  const go = (i) => setActive(i);
  const onKey = (e) => {
    if (e.key === 'ArrowLeft') setActive((a) => (a - 1 + sources.length) % sources.length);
    if (e.key === 'ArrowRight') setActive((a) => (a + 1) % sources.length);
  };

  return (
    <article
      ref={containerRef}
      className="relative group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={onKey}
      tabIndex={0}
      aria-label={`Galería del proyecto ${project.id}`}
    >
      <div className="relative w-full h-56 md:h-64 overflow-hidden rounded-xl shadow-sm bg-gray-100">
        {sources.map((src, idx) => (
          <Image
            key={`${project.id}-${idx}`}
            src={src}
            alt={`${project.id} ${idx === 0 ? 'Antes' : 'Después'}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
              active === idx ? 'opacity-100' : 'opacity-0'
            }`}
            priority={idx === 0}
            onError={() => handleErrorAt(idx)}
          />
        ))}

        {/* Botones de alto contraste */}
        <div className="absolute top-3 left-3 flex gap-2 text-xs font-semibold">
          {['Antes', 'Después'].map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => go(i)}
              aria-pressed={active === i}
              className={[
                'px-3 py-1 rounded-full shadow-md outline-none transition',
                'focus:ring-2 focus:ring-white/80 focus:outline-none',
                active === i
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black/70 text-white hover:bg-black/80'
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Indicadores inferiores */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {sources.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir a ${i === 0 ? 'Antes' : 'Después'}`}
              onClick={() => go(i)}
              className={[
                'h-2.5 w-2.5 rounded-full transition ring-2',
                active === i
                  ? 'bg-white ring-emerald-500'
                  : 'bg-white/30 ring-white/70 hover:bg-white/60'
              ].join(' ')}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-700 italic">{project.comment}</p>
        <h4 className="mt-2 font-semibold text-teal-800">— {project.author}</h4>
        <span className="block text-sm text-gray-500">{project.date}</span>
      </div>
    </article>
  );
}
