// components/ProjectShowcase.jsx
'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

function cx(...c) { return c.filter(Boolean).join(' '); }

/** === Visor A/D (Antes/Después) === */
function BeforeAfter({ before, after }) {
  const [slider, setSlider] = useState(50);
  return (
    <div className="relative w-full h-full">
      <Image src={after} alt="Después" fill className="object-contain select-none pointer-events-none" />
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - slider}% 0 0)` }}
      >
        <Image src={before} alt="Antes" fill className="object-contain select-none" />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={slider}
        onChange={(e) => setSlider(parseInt(e.target.value, 10))}
        aria-label="Comparar antes y después"
        className="absolute left-0 right-0 bottom-4 mx-auto w-[70%] md:w-[50%] accent-white"
      />
      <div
        className="absolute inset-y-0 w-1 bg-white/80 mix-blend-difference pointer-events-none"
        style={{ left: `${slider}%`, transform: 'translateX(-50%)' }}
      />
    </div>
  );
}

/** === Modal: Grid Izq (thumbnails) + Visor Der + Info + Nav Proyectos === */
function ProjectSheet({ open, onClose, project, onPrevProject, onNextProject, hasPrev, hasNext }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [showCompare, setShowCompare] = useState(false);

  // Normaliza imágenes: string[] o {src,alt}[]
  const images = useMemo(() => {
    const raw = project?.images || [];
    const arr = raw.map((it) => (typeof it === 'string' ? { src: it } : it)).filter(Boolean);
    const before = arr.find((i) => /(?:^|\/)(before|antes)[^/]*\.(webp|jpg|jpeg|png)$/i.test(i.src));
    const after  = arr.find((i) => /(?:^|\/)(after|despues|despu[eé]s)[^/]*\.(webp|jpg|jpeg|png)$/i.test(i.src));
    const rest   = arr.filter((i) => i !== before && i !== after);
    return [before, after, ...rest].filter(Boolean);
  }, [project]);

  const hasCompare = !!project?.beforeAfter?.before && !!project?.beforeAfter?.after;

  // Cerrar con ESC + bloquear scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (!showCompare && images.length > 1) {
        if (e.key === 'ArrowRight') setImgIdx((i) => (i + 1) % images.length);
        if (e.key === 'ArrowLeft')  setImgIdx((i) => (i - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, images.length, showCompare]);

  if (!open || !project) return null;

  const title     = project.title || project.nombre || 'Proyecto';
  const location  = project.location || project.ubicacion || '';
  const date      = project.date || project.fecha || '';
  const summary   = project.summary || project.descripcion || '';
  const dimension = project.dimension || '';
  const status    = project.status || project.estado || '';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-[96vw] max-w-6xl h-[86vh] rounded-2xl ring-1 ring-white/10 bg-neutral-900 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="min-w-0">
            <h3 className="text-white font-semibold truncate">{title}</h3>
            {(location || date) && (
              <p className="text-xs text-white/60 truncate">
                {location}{location && date ? ' · ' : ''}{date}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Nav de proyectos con hover fucsia-700 */}
            {hasPrev && (
              <button
                onClick={onPrevProject}
                className="px-3 py-1.5 rounded-md bg-white/10 text-white ring-1 ring-white/15 hover:bg-fuchsia-700 transition-colors"
                title="Proyecto anterior"
              >
                ‹ Anterior
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNextProject}
                className="px-3 py-1.5 rounded-md bg-white/10 text-white ring-1 ring-white/15 hover:bg-fuchsia-700 transition-colors"
                title="Proyecto siguiente"
              >
                Siguiente ›
              </button>
            )}

            {/* Toggle A/D si existe */}
            {hasCompare && (
              <button
                onClick={() => setShowCompare((v) => !v)}
                className={cx(
                  'px-3 py-1.5 rounded-md text-sm font-medium ring-1 transition-colors',
                  showCompare
                    ? 'bg-emerald-500/20 text-emerald-200 ring-emerald-400/40'
                    : 'bg-white/10 text-white ring-white/15 hover:bg-fuchsia-700'
                )}
                title="Alternar Antes/Después"
              >
                {showCompare ? 'Salir A/D' : 'Ver A/D'}
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="px-3 py-1.5 rounded-md bg-white/10 text-white ring-1 ring-white/15 hover:bg-fuchsia-700 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cuerpo: izquierda info + thumbnails, derecha visor */}
        <div className="h-[calc(86vh-56px)] grid grid-cols-1 md:grid-cols-5">
          {/* Izquierda: ***INFO PRIMERO***, luego miniaturas */}
          <aside className="md:col-span-2 border-r border-white/10 overflow-y-auto p-3">
            {/* Información (arriba del todo) */}
            {(summary || location || dimension || status) && (
              <div className="space-y-3">
                {summary && <p className="text-sm text-white/80">{summary}</p>}

                {(location || dimension || status) && (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {location && (
                      <div className="rounded-md bg-white/5 ring-1 ring-white/10 p-2">
                        <dt className="text-white/60">Ubicación</dt>
                        <dd className="text-white">{location}</dd>
                      </div>
                    )}
                    {dimension && (
                      <div className="rounded-md bg-white/5 ring-1 ring-white/10 p-2">
                        <dt className="text-white/60">Dimensión</dt>
                        <dd className="text-white">{dimension}</dd>
                      </div>
                    )}
                    {status && (
                      <div className="rounded-md bg-white/5 ring-1 ring-white/10 p-2">
                        <dt className="text-white/60">Estado</dt>
                        <dd className="text-white">{status}</dd>
                      </div>
                    )}
                  </dl>
                )}
              </div>
            )}

            {!!project.features?.length && (
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white/80">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            {project.testimonial && (
              <figure className="mt-4 border-l-4 border-emerald-400/60 pl-3">
                <blockquote className="italic text-white">
                  “{project.testimonial.comment}”
                </blockquote>
                <figcaption className="text-xs text-white/60 mt-1">
                  — {project.testimonial.author}{project.testimonial.date ? ` · ${project.testimonial.date}` : ''}
                </figcaption>
              </figure>
            )}

            {/* Conteo + Grid de miniaturas (abajo) */}
            <p className="mt-5 text-xs text-white/60">{images.length} imágenes</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <button
                  key={`${project.id}-${i}`}
                  onClick={() => { setImgIdx(i); setShowCompare(false); }}
                  className={cx(
                    'relative aspect-square rounded-lg overflow-hidden ring-1 transition',
                    imgIdx === i ? 'ring-fuchsia-700' : 'ring-white/10 hover:ring-fuchsia-700'
                  )}
                  title={`Imagen ${i + 1}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt || `${title} - ${i + 1}`}
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </aside>

          {/* Derecha: visor */}
          <main className="md:col-span-3 relative bg-black">
            <div className="absolute inset-0">
              {!showCompare && images.length > 0 && (
                <Image
                  src={images[imgIdx]?.src || project.cover}
                  alt={images[imgIdx]?.alt || title}
                  fill
                  className="object-contain"
                  priority={false}
                />
              )}

              {showCompare && hasCompare && (
                <BeforeAfter
                  before={project.beforeAfter.before}
                  after={project.beforeAfter.after}
                />
              )}
            </div>

            {/* Prev/Next imagen con hover fucsia-700 */}
            {!showCompare && images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-md bg-white/10 text-white ring-1 ring-white/15 hover:bg-fuchsia-700 transition-colors"
                  aria-label="Anterior imagen"
                >
                  ‹
                </button>
                <button
                  onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-md bg-white/10 text-white ring-1 ring-white/15 hover:bg-fuchsia-700 transition-colors"
                  aria-label="Siguiente imagen"
                >
                  ›
                </button>
              </>
            )}

            {!showCompare && (
              <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-white/70">
                {images.length ? `${imgIdx + 1} / ${images.length}` : null}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/** Tarjeta de proyecto (con carrusel suave; click abre modal) */
function ProjectCard({ project, onOpen }) {
  const railRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const orderedImages = useMemo(() => {
    const raw = project.images || [];
    const arr = raw.map((it) => (typeof it === 'string' ? { src: it } : it)).filter(Boolean);
    const before = arr.find((i) => /(?:^|\/)(before|antes)[^/]*\.(webp|jpg|jpeg|png)$/i.test(i.src));
    const after  = arr.find((i) => /(?:^|\/)(after|despues|despu[eé]s)[^/]*\.(webp|jpg|jpeg|png)$/i.test(i.src));
    const rest   = arr.filter((i) => i !== before && i !== after);
    const base   = [project.cover ? { src: project.cover } : null, ...rest].filter(Boolean);
    return base.length ? base : arr;
  }, [project.images, project.cover]);

  // Auto-slide
  useEffect(() => {
    if (paused || orderedImages.length < 2) return;
    const id = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % orderedImages.length;
        const rail = railRef.current;
        if (rail) rail.scrollTo({ left: next * rail.clientWidth, behavior: 'smooth' });
        return next;
      });
    }, 3500);
    return () => clearInterval(id);
  }, [paused, orderedImages.length]);

  // Drag-to-scroll
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
      setTimeout(() => setPaused(false), 800);
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

  const onCardClick = () => {
    if (drag.current.moved) return;
    onOpen(project);
  };

  const title     = project.title || project.nombre || 'Proyecto';
  const location  = project.location || project.ubicacion || '';
  const date      = project.date || project.fecha || '';
  const summary   = project.summary || project.descripcion;

  return (
    <article
      className="group rounded-2xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition overflow-hidden cursor-pointer"
      onClick={onCardClick}
      role="button"
      tabIndex={0}
    >
      <div
        className="relative h-52 md:h-56 overflow-hidden"
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
                  alt={img.alt || title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  priority={i === 0}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </div>

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

      <div className="p-5">
        <h4 className="text-white font-semibold">{title}</h4>
        {(location || date) && (
          <p className="text-xs text-white/60">
            {location}{location && date ? ' · ' : ''}{date}
          </p>
        )}
        {summary && <p className="mt-2 text-sm text-white/80 line-clamp-2">{summary}</p>}
      </div>
    </article>
  );
}

/** === Listado + Modal === */
export default function ProjectShowcase({ projects = [], title = 'Proyectos de BioPiscinas' }) {
  const [open, setOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const current = currentIdx >= 0 ? projects[currentIdx] : null;

  const openSheet = useCallback((p) => {
    const i = projects.findIndex((x) => x.id === p.id);
    setCurrentIdx(i >= 0 ? i : 0);
    setOpen(true);
  }, [projects]);

  const closeSheet = useCallback(() => { setOpen(false); setCurrentIdx(-1); }, []);
  const goPrevProject = useCallback(() => { setCurrentIdx((i) => (i - 1 + projects.length) % projects.length); }, [projects.length]);
  const goNextProject = useCallback(() => { setCurrentIdx((i) => (i + 1) % projects.length); }, [projects.length]);

  const hasPrev = projects.length > 1;
  const hasNext = projects.length > 1;

  return (
    <section className="relative py-12 bg-black/30 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm text-white/70">
            Haz clic en un proyecto para ver su galería completa. En la ventana podrás navegar imagen por imagen,
            activar la comparativa <em>Antes/Después</em> y revisar la información del proyecto.
          </p>
        </header>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={openSheet} />
          ))}
        </div>
      </div>

      <ProjectSheet
        open={open}
        onClose={closeSheet}
        project={current}
        onPrevProject={goPrevProject}
        onNextProject={goNextProject}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />
    </section>
  );
}
