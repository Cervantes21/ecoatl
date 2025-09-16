// components/ServicioCategory.jsx
'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronRight, CheckCircle2, X, Images, PhoneCall, MessageCircle,
  ChevronDown, Play, ChevronLeft
} from 'lucide-react';

function cx(...c) { return c.filter(Boolean).join(' '); }

/**
 * Props esperadas:
 * - slug: 'estanques' | 'biopool' | 'eco-aqua'
 * - title: string
 * - subtitle?: string
 * - videoBg?: { src: string, poster?: string, overlayOpacity?: number }
 * - heroImage?: string
 * - tagline?: string
 * - description?: string
 * - bullets?: string[]
 * - includes?: string[]   // NUEVO: reemplaza visualmente a bullets si se pasa
 * - features?: Array<{ title: string, desc: string }>
 * - process?: Array<{ title: string, desc: string }>
 * - gallery?: string[]
 * - beforeAfter?: Array<{ before: string, after: string, label?: string }>
 * - projects?: Array<{
 *     id?: string,
 *     title: string,
 *     subtitle?: string,
 *     cover?: string,
 *     description?: string,
 *     images: string[],
 *     meta?: { ubicacion?: string, anio?: number|string, volumen?: string, dimensiones?: string }
 *   }>
 * - faqs?: Array<{ q: string, a: string }>
 * - ctas?: { whatsapp?: string, diagnostic?: string, portfolioHref?: string }
 */
export default function ServicioCategory({
  slug,
  title,
  subtitle,
  videoBg,
  heroImage,
  tagline,
  description,
  bullets = [],
  includes = [],      // NUEVO
  features = [],
  process = [],
  gallery = [],
  beforeAfter = [],
  projects = [],      // NUEVO
  faqs = [],
  ctas = {
    whatsapp: 'https://wa.me/527772568821',
    diagnostic: '#contacto',
    portfolioHref: '/gallery',
  },
}) {
  // ------- Modal para imágenes (centrado, no fullscreen) -------
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  // ------- Carrusel horizontal con arrastre + autoplay -------
  const scrollerRef = useRef(null);
  const rafRef = useRef(null);
  const pauseRef = useRef(false);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!scrollerRef.current) return;
    const el = scrollerRef.current;
    const SPEED = 0.7; // px/frame ~42 px/s

    const step = () => {
      if (!pauseRef.current && !draggingRef.current) {
        const max = el.scrollWidth - el.clientWidth;
        if (max > 0) {
          el.scrollLeft = el.scrollLeft + SPEED;
          if (el.scrollLeft >= max - 1) el.scrollLeft = 0;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    const onEnter = () => (pauseRef.current = true);
    const onLeave = () => (pauseRef.current = false);
    const onVisibility = () => (pauseRef.current = document.hidden);

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('touchstart', onEnter, { passive: true });
    el.addEventListener('touchend', onLeave, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('touchstart', onEnter);
      el.removeEventListener('touchend', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Arrastre con mouse
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let isDown = false, startX = 0, scrollStart = 0;

    const onMouseDown = (e) => {
      isDown = true; draggingRef.current = true;
      el.classList.add('cursor-grabbing');
      startX = e.pageX - el.offsetLeft;
      scrollStart = el.scrollLeft;
    };
    const end = () => {
      isDown = false; draggingRef.current = false;
      el.classList.remove('cursor-grabbing');
    };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollStart - (x - startX);
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', end);
    el.addEventListener('mouseup', end);
    el.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', end);
      el.removeEventListener('mouseup', end);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // --------- Estado para PROYECTOS (modal + carrusel) ---------
  const [openProjectIdx, setOpenProjectIdx] = useState(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const openProject = useCallback((idx) => {
    setOpenProjectIdx(idx);
    setCurrentImgIdx(0);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeProject = useCallback(() => {
    setOpenProjectIdx(null);
    setCurrentImgIdx(0);
    document.body.style.overflow = '';
  }, []);

  const activeImages = useMemo(() => {
    if (openProjectIdx == null) return [];
    return projects[openProjectIdx]?.images || [];
  }, [openProjectIdx, projects]);

  const nextImg = useCallback(() => {
    if (!activeImages.length) return;
    setCurrentImgIdx((i) => (i + 1) % activeImages.length);
  }, [activeImages.length]);

  const prevImg = useCallback(() => {
    if (!activeImages.length) return;
    setCurrentImgIdx((i) => (i - 1 + activeImages.length) % activeImages.length);
  }, [activeImages.length]);

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && closeProject();
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [closeProject]);

  const overlayOpacity = (videoBg?.overlayOpacity ?? 0.5);
  const hasHeroVideo = Boolean(videoBg?.src);

  return (
    <main className="relative min-h-screen pt-20 md:pt-24">
      {/* ---------------- HERO ---------------- */}
      <section className="relative">
        {hasHeroVideo ? (
          <>
            <video
              src={videoBg.src}
              poster={videoBg.poster || heroImage}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="fixed inset-0 -z-10 w-full h-full object-cover pointer-events-none"
              aria-hidden
            />
            <div
              className="fixed inset-0 -z-10"
              style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
              aria-hidden
            />
          </>
        ) : heroImage ? (
          <>
            <Image
              src={heroImage}
              alt={title}
              fill
              priority
              className="fixed inset-0 -z-10 object-cover"
            />
            <div
              className="fixed inset-0 -z-10"
              style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
              aria-hidden
            />
          </>
        ) : null}

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-wider text-sky-300 font-semibold">
            {slug === 'biopool' ? 'BioPiscinas' : slug === 'eco-aqua' ? 'Ecosistemas Acuáticos' : 'Estanques'}
          </p>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-lg md:text-xl text-sky-200">{subtitle}</p>}

          {tagline && <p className="mt-3 text-slate-200">{tagline}</p>}
          {description && (
            <p className="mt-2 text-slate-200 max-w-3xl leading-relaxed">{description}</p>
          )}

          {/* “Qué incluye…” (si pasas includes, se usan en lugar de bullets) */}
          {(includes?.length || bullets?.length) ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {(includes?.length ? includes : bullets).map((b, i) => (
                <li key={i} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 border border-white/20">
                  <CheckCircle2 className="h-4 w-4" />
                  {b}
                </li>
              ))}
            </ul>
          ) : null}

          {/* CTAs */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={ctas.whatsapp}
              target="_blank" rel="noopener noreferrer"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700 inline-flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Cotiza por WhatsApp
            </a>
            <a
              href={ctas.diagnostic}
              className="rounded-xl bg-sky-600 px-4 py-2 text-white text-sm font-semibold hover:bg-sky-700 inline-flex items-center gap-2"
            >
              <PhoneCall className="h-4 w-4" />
              Solicitar diagnóstico
            </a>
            <Link
              href={ctas.portfolioHref}
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white text-sm font-semibold hover:bg-white/20 inline-flex items-center gap-2"
            >
              <Images className="h-4 w-4" />
              Ver portafolio
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      {features?.length ? (
        <section className="relative mt-8 md:mt-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Características clave</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <li key={i} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-1 text-slate-700 text-sm">{f.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ---------------- PROYECTOS (cards + modal) ---------------- */}
      {projects?.length ? (
        <section className="relative mt-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Proyectos</h2>
            <p className="text-white/80 mt-1 text-sm">
              Cada proyecto se ajusta al sitio, la carga orgánica y los objetivos estéticos/funcionales.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((proj, idx) => (
                <article
                  key={proj.id || idx}
                  className="group rounded-2xl overflow-hidden border border-white/15 bg-white/10 backdrop-blur-sm"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={proj.cover || proj.images?.[0]}
                      alt={proj.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      priority={idx < 3}
                    />
                  </div>
                  <div className="p-4 text-white">
                    <h3 className="font-semibold">{proj.title}</h3>
                    {proj.subtitle && <p className="text-white/75 text-sm">{proj.subtitle}</p>}

                    {proj.meta && (
                      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-white/80">
                        {proj.meta.ubicacion && (<><dt className="opacity-70">Ubicación</dt><dd>{proj.meta.ubicacion}</dd></>)}
                        {proj.meta.anio && (<><dt className="opacity-70">Año</dt><dd>{proj.meta.anio}</dd></>)}
                        {proj.meta.volumen && (<><dt className="opacity-70">Volumen</dt><dd>{proj.meta.volumen}</dd></>)}
                        {proj.meta.dimensiones && (<><dt className="opacity-70">Dimensiones</dt><dd>{proj.meta.dimensiones}</dd></>)}
                      </dl>
                    )}

                    <button
                      onClick={() => openProject(idx)}
                      className="mt-4 inline-flex items-center justify-center rounded-xl bg-white text-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-100 transition"
                    >
                      Ver proyecto
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* MODAL PROYECTO */}
          {openProjectIdx != null && (
            <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/80" onClick={closeProject} />
              <div className="absolute inset-0 p-4 sm:p-6 lg:p-10">
                <div className="relative mx-auto max-w-6xl bg-white rounded-2xl overflow-hidden grid lg:grid-cols-2 min-h-[70vh]">
                  {/* Imagen principal + controles */}
                  <div className="relative bg-black">
                    {activeImages?.[currentImgIdx] && (
                      <Image
                        src={activeImages[currentImgIdx]}
                        alt={`img-${currentImgIdx}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                    )}
                    <button
                      onClick={prevImg}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 hover:bg-white"
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 hover:bg-white"
                      aria-label="Siguiente"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Info proyecto + thumbnails */}
                  <div className="p-5 lg:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{projects[openProjectIdx]?.title}</h3>
                        {projects[openProjectIdx]?.subtitle && (
                          <p className="text-slate-600 text-sm">{projects[openProjectIdx]?.subtitle}</p>
                        )}
                      </div>
                      <button
                        onClick={closeProject}
                        className="rounded-full border border-slate-200 p-2 hover:bg-slate-50"
                        aria-label="Cerrar"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {projects[openProjectIdx]?.description && (
                      <p className="mt-3 text-slate-700 text-sm leading-relaxed">
                        {projects[openProjectIdx]?.description}
                      </p>
                    )}

                    {projects[openProjectIdx]?.meta && (
                      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        {projects[openProjectIdx].meta.ubicacion && (<><dt className="text-slate-500">Ubicación</dt><dd>{projects[openProjectIdx].meta.ubicacion}</dd></>)}
                        {projects[openProjectIdx].meta.anio && (<><dt className="text-slate-500">Año</dt><dd>{projects[openProjectIdx].meta.anio}</dd></>)}
                        {projects[openProjectIdx].meta.volumen && (<><dt className="text-slate-500">Volumen</dt><dd>{projects[openProjectIdx].meta.volumen}</dd></>)}
                        {projects[openProjectIdx].meta.dimensiones && (<><dt className="text-slate-500">Dimensiones</dt><dd>{projects[openProjectIdx].meta.dimensiones}</dd></>)}
                      </dl>
                    )}

                    {/* Thumbnails */}
                    <div className="mt-5 grid grid-cols-5 gap-2">
                      {activeImages.map((src, i) => (
                        <button
                          key={i}
                          className={cx(
                            "relative aspect-square rounded-lg overflow-hidden border",
                            i === currentImgIdx ? "border-slate-900" : "border-slate-200 hover:border-slate-300"
                          )}
                          onClick={() => setCurrentImgIdx(i)}
                          aria-label={`Imagen ${i + 1}`}
                        >
                          <Image src={src} alt={`thumb-${i}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* ---------------- GALERÍA (drag + autoplay) ---------------- */}
      {gallery?.length ? (
        <section className="relative mt-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-semibold text-white">Galería</h2>
              <Link
                href={ctas.portfolioHref}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-3 py-2 text-sm font-medium hover:bg-slate-100 transition"
              >
                <Images className="h-4 w-4" />
                Ver más fotos
              </Link>
            </div>

            {/* Gradientes de borde */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/60 to-transparent z-10 hidden md:block" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/60 to-transparent z-10 hidden md:block" />

              <div
                ref={scrollerRef}
                className="group/scroll flex gap-3 overflow-x-auto scroll-smooth cursor-grab px-1 py-1"
              >
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    className="relative shrink-0 w-[min(92vw,420px)] aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 bg-white/5 hover:scale-[1.01] transition"
                    onClick={() => { setModalImg(src); setModalOpen(true); }}
                    aria-label={`Abrir imagen ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`${title} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 420px, 420px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Modal centrado (no pantalla completa) */}
            {modalOpen && modalImg && (
              <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
                <div className="relative z-[71] w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-700">{title} — Imagen</p>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="p-2 rounded-lg hover:bg-slate-100"
                      aria-label="Cerrar"
                    >
                      <X className="h-5 w-5 text-slate-700" />
                    </button>
                  </div>
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={modalImg}
                      alt="Vista ampliada"
                      fill
                      className="object-contain bg-slate-50"
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* ---------------- ANTES / DESPUÉS ---------------- */}
      {beforeAfter?.length ? (
        <section className="relative mt-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Antes y Después</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {beforeAfter.map((pair, i) => (
                <li key={i} className="rounded-2xl overflow-hidden border border-white/20 bg-white/5">
                  <div className="relative aspect-[4/3]">
                    <Image src={pair.before} alt={`${pair.label || 'Proyecto'} - Antes`} fill className="object-cover" />
                    <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">Antes</span>
                  </div>
                  <div className="relative aspect-[4/3]">
                    <Image src={pair.after} alt={`${pair.label || 'Proyecto'} - Después`} fill className="object-cover" />
                    <span className="absolute left-2 top-2 rounded-md bg-emerald-700/80 px-2 py-1 text-xs text-white">Después</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ---------------- PROCESO ---------------- */}
      {process?.length ? (
        <section className="relative mt-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Proceso de trabajo</h2>
            <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {process.map((p, i) => (
                <li key={i} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 text-sky-700 font-semibold">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 border border-sky-200 text-xs">
                      {i + 1}
                    </span>
                    {p.title}
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{p.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* ---------------- FAQS ---------------- */}
      {faqs?.length ? (
        <section className="relative mt-10 mb-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Preguntas frecuentes</h2>
            <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/15 bg-white/5">
              {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------- CTA FINAL ---------------- */}
      <section className="border-t border-white/10 bg-black/30 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">¿Listo para comenzar?</h3>
              <p className="text-slate-700">
                Agenda un diagnóstico y recibe una propuesta clara con tiempos y alcances.
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={ctas.whatsapp}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" />
                Cotizar ahora
              </a>
              <a
                href={ctas.diagnostic}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-white font-medium hover:bg-sky-700"
              >
                <PhoneCall className="h-4 w-4" />
                Solicitar diagnóstico
              </a>
              <Link
                href={ctas.portfolioHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                <Images className="h-4 w-4" />
                Ver más fotos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- FAQ item (acordeón) ---------- */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <details className="group" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-white/90 hover:bg-white/5">
        <span className="text-sm md:text-base font-medium">{q}</span>
        <ChevronDown
          className={cx(
            'h-4 w-4 transition-transform',
            open ? 'rotate-180' : ''
          )}
        />
      </summary>
      <div className="px-4 pb-4 text-sm text-slate-200">{a}</div>
    </details>
  );
}
