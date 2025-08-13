// components/ProjectShowcase.jsx
'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

function cx(...c) { return c.filter(Boolean).join(' '); }

/** Ficha modal: Imagen Izq / Info Der (responsive) con auto-slide */
function ProjectSheet({ open, onClose, project }) {
  const railRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const images = useMemo(() => {
    const arr = project?.images || [];
    const before = arr.find((i) => /before/i.test(i.src));
    const after = arr.find((i) => /after/i.test(i.src));
    const rest = arr.filter((i) => i !== before && i !== after);
    return [before, after, ...rest].filter(Boolean);
  }, [project]);

  // Cerrar con ESC y bloquear scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Auto-slide (solo cuando está abierto)
  useEffect(() => {
    if (!open || paused || images.length < 2) return;
    const id = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % images.length;
        const rail = railRef.current;
        if (rail) {
          rail.scrollTo({ left: next * rail.clientWidth, behavior: 'smooth' });
        }
        return next;
      });
    }, 3500);
    return () => clearInterval(id);
  }, [open, paused, images.length]);

  // Drag-to-scroll en la ficha
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onDown = (e) => {
      drag.current.down = true;
      drag.current.moved = false;
      setPaused(true);
      drag.current.x = e.touches ? e.touches[0].pageX : e.pageX;
      drag.current.left = rail.scrollLeft;
      rail.classList.add('cursor-grabbing');
    };
    const onUp = () => {
      if (!drag.current.down) return;
      drag.current.down = false;
      rail.classList.remove('cursor-grabbing');
      const current = Math.round(rail.scrollLeft / rail.clientWidth);
      setIdx(current);
      setTimeout(() => setPaused(false), 1000);
    };
    const onMove = (e) => {
      if (!drag.current.down) return;
      const pageX = e.touches ? e.touches[0].pageX : e.pageX;
      const delta = pageX - drag.current.x;
      if (Math.abs(delta) > 4) drag.current.moved = true;
      rail.scrollLeft = drag.current.left - delta;
    };

    rail.addEventListener('mousedown', onDown);
    rail.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mouseup', onUp);
    rail.addEventListener('mouseleave', onUp);
    rail.addEventListener('mousemove', onMove);
    rail.addEventListener('touchmove', onMove, { passive: true });
    rail.addEventListener('touchend', onUp);
    return () => {
      rail.removeEventListener('mousedown', onDown);
      rail.removeEventListener('touchstart', onDown);
      window.removeEventListener('mouseup', onUp);
      rail.removeEventListener('mouseleave', onUp);
      rail.removeEventListener('mousemove', onMove);
      rail.removeEventListener('touchmove', onMove);
      rail.removeEventListener('touchend', onUp);
    };
  }, [open]);

  if (!open || !project) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/10 px-3 py-1.5 text-black hover:bg-black/20"
        >
          ✕
        </button>

        {/* Grid principal: Izq imagen (rail), Der info */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Rail de imágenes con auto-slide + drag */}
          <div
            className="relative h-72 md:h-[70vh] bg-slate-100 overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              ref={railRef}
              className="h-full w-full overflow-x-auto overflow-y-hidden whitespace-nowrap snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab"
            >
              <div className="flex h-full">
                {images.map((img, i) => (
                  <div key={img.src + i} className="relative min-w-full h-full snap-center">
                    <Image
                      src={img.src}
                      alt={img.alt || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority={i === 0}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={cx(
                      'h-1.5 w-4 rounded-full transition',
                      i === idx ? 'bg-white/90' : 'bg-white/40'
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Información derecha */}
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-semibold text-slate-900">{project.title}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {project.location} · {project.date}
            </p>

            {project.summary && (
              <p className="mt-4 text-slate-700 leading-relaxed">{project.summary}</p>
            )}

            {!!project.features?.length && (
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-700">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            {project.testimonial && (
              <figure className="mt-6 border-l-4 border-emerald-400 pl-3">
                <blockquote className="italic text-slate-800">
                  “{project.testimonial.comment}”
                </blockquote>
                <figcaption className="text-sm text-slate-500 mt-1">
                  — {project.testimonial.author} · {project.testimonial.date}
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Tarjeta: rail con auto-slide + drag; click (si no hubo drag) abre ficha */
function ProjectCard({ project, onOpen }) {
  const railRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const orderedImages = useMemo(() => {
    const before = project.images.find((i) => /before/i.test(i.src));
    const after = project.images.find((i) => /after/i.test(i.src));
    const rest = project.images.filter((i) => i !== before && i !== after);
    return [before, after, ...rest].filter(Boolean);
  }, [project.images]);

  // Auto-slide
  useEffect(() => {
    if (paused || orderedImages.length < 2) return;
    const id = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % orderedImages.length;
        const rail = railRef.current;
        if (rail) {
          rail.scrollTo({ left: next * rail.clientWidth, behavior: 'smooth' });
        }
        return next;
      });
    }, 3500);
    return () => clearInterval(id);
  }, [paused, orderedImages.length]);

  // Drag-to-scroll SOLO en el área de imagen
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onDown = (e) => {
      drag.current.down = true;
      drag.current.moved = false;
      setPaused(true);
      drag.current.x = e.touches ? e.touches[0].pageX : e.pageX;
      drag.current.left = rail.scrollLeft;
      rail.classList.add('cursor-grabbing');
    };
    const onUp = () => {
      if (!drag.current.down) return;
      drag.current.down = false;
      rail.classList.remove('cursor-grabbing');
      const current = Math.round(rail.scrollLeft / rail.clientWidth);
      setIdx(current);
      setTimeout(() => setPaused(false), 1000);
    };
    const onMove = (e) => {
      if (!drag.current.down) return;
      const pageX = e.touches ? e.touches[0].pageX : e.pageX;
      const delta = pageX - drag.current.x;
      if (Math.abs(delta) > 4) drag.current.moved = true;
      rail.scrollLeft = drag.current.left - delta;
    };

    rail.addEventListener('mousedown', onDown);
    rail.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mouseup', onUp);
    rail.addEventListener('mouseleave', onUp);
    rail.addEventListener('mousemove', onMove);
    rail.addEventListener('touchmove', onMove, { passive: true });
    rail.addEventListener('touchend', onUp);
    return () => {
      rail.removeEventListener('mousedown', onDown);
      rail.removeEventListener('touchstart', onDown);
      window.removeEventListener('mouseup', onUp);
      rail.removeEventListener('mouseleave', onUp);
      rail.removeEventListener('mousemove', onMove);
      rail.removeEventListener('touchmove', onMove);
      rail.removeEventListener('touchend', onUp);
    };
  }, []);

  // Click en la tarjeta: ignora si hubo drag
  const onCardClick = () => {
    if (drag.current.moved) return;
    onOpen(project);
  };

  return (
    <article
      className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
      onClick={onCardClick}
      role="button"
      tabIndex={0}
    >
      {/* Área de imagen con scroll horizontal (auto + drag + snap) */}
      <div
        className="relative h-56 md:h-64 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={railRef}
          className="h-full w-full overflow-x-auto overflow-y-hidden whitespace-nowrap snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab"
        >
          <div className="flex h-full">
            {orderedImages.map((img, i) => (
              <div key={img.src + i} className="relative min-w-full h-full snap-center">
                <Image
                  src={img.src}
                  alt={img.alt || project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  priority={i === 0}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {orderedImages.length > 1 && (
          <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {orderedImages.map((_, i) => (
              <span
                key={i}
                className={cx(
                  'h-1.5 w-4 rounded-full transition',
                  i === idx ? 'bg-white/90' : 'bg-white/40'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h4 className="text-xl font-semibold text-slate-900">{project.title}</h4>
        <p className="text-sm text-slate-500">
          {project.location} · {project.date}
        </p>

        {project.summary && (
          <p className="mt-3 text-slate-700 line-clamp-3">{project.summary}</p>
        )}

        {!!project.features?.length && (
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700">
            {project.features.slice(0, 4).map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span className="truncate">{f}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

/** Grilla + ficha modal */
export default function ProjectShowcase({ projects = [] }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const openSheet = useCallback((p) => { setCurrent(p); setOpen(true); }, []);
  const closeSheet = useCallback(() => { setOpen(false); setCurrent(null); }, []);

  return (
    <section id="featured-projects" className="pt-20 md:pt-24 pb-12 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <header className="mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-emerald-700">
            Proyectos destacados
          </h2>
          <p className="mt-2 text-slate-600">
            Antes y después, características clave y testimonios reales.
          </p>
        </header>

        {/* Grilla responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={openSheet} />
          ))}
        </div>
      </div>

      <ProjectSheet open={open} onClose={closeSheet} project={current} />
    </section>
  );
}
