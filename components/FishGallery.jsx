// components/FishGallery.jsx
'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import fishData from '@/data/fish.json';

function cx(...c) { return c.filter(Boolean).join(' '); }
function slugify(str = '') {
  return str
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
function normalize(str = '') {
  return str
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
function escapeRegExp(s = '') { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function Highlight({ text, query }) {
  if (!query) return <>{text}</>;
  const re = new RegExp(`(${escapeRegExp(query)})`, 'ig');
  const parts = String(text).split(re);
  return parts.map((p, i) =>
    re.test(p) ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>
  );
}

function CareRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-sm font-medium text-slate-900 dark:text-slate-100 text-right">{value}</dd>
    </div>
  );
}

/* ---------------- MODAL DETALLES (portal al <body> + scroll-lock) ---------------- */
function DetailsModal({ open, fish, onClose, onPrev, onNext }) {
  const contentRef = useRef(null);
  const [canPortal, setCanPortal] = useState(false);
  const prevOverflowRef = useRef('');
  const prevPaddingRef = useRef('');

  const getScrollbarWidth = () =>
    typeof window !== 'undefined'
      ? window.innerWidth - document.documentElement.clientWidth
      : 0;

  const lockScroll = useCallback(() => {
    const html = document.documentElement;
    prevOverflowRef.current = html.style.overflow;
    prevPaddingRef.current = html.style.paddingRight;
    const sbw = getScrollbarWidth();
    if (sbw > 0) html.style.paddingRight = `${sbw}px`;
    html.style.overflow = 'hidden';
  }, []);

  const unlockScroll = useCallback(() => {
    const html = document.documentElement;
    html.style.overflow = prevOverflowRef.current;
    html.style.paddingRight = prevPaddingRef.current;
  }, []);

  const escHandler = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);

  useEffect(() => {
    setCanPortal(typeof window !== 'undefined' && !!document?.body);
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    document.addEventListener('keydown', escHandler);
    if (contentRef.current) contentRef.current.scrollTop = 0;
    return () => {
      document.removeEventListener('keydown', escHandler);
      unlockScroll();
    };
  }, [open, escHandler, lockScroll, unlockScroll]);

  if (!open || !fish || !canPortal) return null;

  const {
    nombre,
    nombre_cientifico,
    otros_nombres,
    descripcion,
    imagen,
    cuidados,
    funcion, // raíz (string)
  } = fish || {};

  const navBtn =
    'inline-flex items-center rounded-xl px-3 py-2 text-sm bg-[#0e1b2b] text-white hover:bg-fuchsia-700 transition border-0 focus:outline-none focus:ring-0';
  const navBtnMobile =
    'rounded-xl px-3 py-2 text-sm bg-[#0e1b2b] text-white hover:bg-fuchsia-700 transition border-0 focus:outline-none focus:ring-0';

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog centrado */}
      <div
        className="relative z-[101] w-full max-w-4xl md:max-w-5xl my-6
                   rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl
                   overflow-hidden max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-white/10">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold truncate">{nombre || '—'}</h2>
            {nombre_cientifico && (
              <p className="text-sm italic text-slate-600 dark:text-white/80 truncate">{nombre_cientifico}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onPrev} className={`hidden sm:inline-flex ${navBtn}`}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
            </button>
            <button type="button" onClick={onNext} className={`hidden sm:inline-flex ${navBtn}`}>
              Siguiente <ChevronRight className="ml-1 h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body con scroll interno */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
            {/* Imagen */}
            <div className="relative aspect-[4/3] md:aspect-auto md:h-[42vh] bg-slate-100 dark:bg-slate-800">
              {imagen ? (
                <Image
                  src={imagen}
                  alt={nombre || nombre_cientifico || 'Pez'}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-content-center text-sm text-slate-500 dark:text-slate-300">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Texto */}
            <div className="p-4 sm:p-6">
              {Array.isArray(otros_nombres) && otros_nombres.length > 0 && (
                <p className="text-sm">
                  <span className="font-medium">También conocido como:</span> {otros_nombres.join(', ')}
                </p>
              )}

              {descripcion && <p className="mt-3 text-sm leading-6">{descripcion}</p>}

              {/* Cuidados */}
              {cuidados && (
                <section className="mt-4 rounded-2xl border border-slate-200 dark:border-white/10 p-4">
                  <h4 className="text-sm font-semibold mb-2">Parámetros y mantenimiento</h4>
                  <dl>
                    <CareRow label="Temperatura" value={cuidados.temperatura} />
                    <CareRow label="pH" value={cuidados.ph} />
                    <CareRow label="Dureza (GH)" value={cuidados.dureza} />
                    <CareRow label="Alcalinidad (KH)" value={cuidados.kh} />
                    <CareRow label="Tamaño adulto" value={cuidados.tamaño_adulto} />
                    <CareRow label="Alimentación" value={cuidados.alimentacion} />
                    <CareRow label="Comportamiento" value={cuidados.comportamiento} />
                    <CareRow label="Compatibilidad" value={cuidados.compatibilidad} />
                    <CareRow label="Mantenimiento" value={cuidados.mantenimiento} />
                  </dl>
                </section>
              )}

              {/* Función en el sistema (si existe en raíz) */}
              {funcion && (
                <section className="mt-3 rounded-xl border border-slate-200 dark:border-white/10 p-3">
                  <h4 className="text-sm font-semibold mb-1">Función en el sistema</h4>
                  <p className="text-sm">{funcion}</p>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Footer (móvil) */}
        <div className="flex sm:hidden items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-white/10">
          <button type="button" onClick={onPrev} className={navBtnMobile}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
          </button>
          <button type="button" onClick={onNext} className={navBtnMobile}>
            Siguiente <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* --------------------------------- COMPONENTE PRINCIPAL --------------------------------- */
export default function FishGallery({
  title = 'Peces',
  className = '',
  overlay = true,
  showSearch = true,
  showSort = true,
}) {
  // Normaliza arreglo
  const fishes = useMemo(() => (Array.isArray(fishData) ? fishData : []), []);

  // Búsqueda/orden
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState('nombre'); // 'nombre' | 'cientifico'

  // Modal
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  // Filtrado
  const filtered = useMemo(() => {
    if (!q) return fishes;
    const nQ = normalize(q);
    return fishes.filter((p) => {
      const campos = [
        p?.nombre,
        p?.nombre_cientifico,
        ...(Array.isArray(p?.otros_nombres) ? p.otros_nombres : []),
        p?.descripcion,
        p?.cuidados?.alimentacion,
        p?.cuidados?.comportamiento,
      ]
        .filter(Boolean)
        .map(String)
        .map(normalize);
      return campos.some((c) => c.includes(nQ));
    });
  }, [fishes, q]);

  // Orden
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortKey === 'nombre') {
      arr.sort((a, b) => normalize(a?.nombre || '').localeCompare(normalize(b?.nombre || '')));
    } else if (sortKey === 'cientifico') {
      arr.sort((a, b) =>
        normalize(a?.nombre_cientifico || '').localeCompare(normalize(b?.nombre_cientifico || ''))
      );
    }
    return arr;
  }, [filtered, sortKey]);

  // Abrir/cerrar modal
  const openModal = useCallback((fish) => {
    setCurrent(fish);
    setOpen(true);
  }, []);
  const closeModal = useCallback(() => setOpen(false), []);

  // Navegación en modal
  const goNext = useCallback(() => {
    if (!current) return;
    const i = sorted.findIndex((f) => f === current);
    const next = sorted[(i + 1) % sorted.length];
    setCurrent(next);
  }, [current, sorted]);
  const goPrev = useCallback(() => {
    if (!current) return;
    const i = sorted.findIndex((f) => f === current);
    const prev = sorted[(i - 1 + sorted.length) % sorted.length];
    setCurrent(prev);
  }, [current, sorted]);

  // ESC para cerrar
  const onKey = useCallback((e) => { if (e.key === 'Escape') closeModal(); }, [closeModal]);
  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onKey]);

  return (
    <section className={cx('relative w-full min-h-screen overflow-hidden', className)}>
      {/* Video de fondo */}
      <video
        className="pointer-events-none select-none fixed inset-0 w-full h-full object-cover z-[-2]"
        src="/Estanque_Adentro_Afuera.webm"
        autoPlay
        muted
        loop
        playsInline
        poster="/gallery/goldfish.webp"
      />
      {overlay && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-[1px] z-[-1]" aria-hidden />
      )}

      {/* Contenido */}
      <div className="relative container mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow">
              {title}
            </h1>
            <p className="text-white/90 mt-1">
              {sorted.length} {sorted.length === 1 ? 'especie' : 'especies'}
            </p>
          </div>

          {/* Controles */}
          <div className="flex flex-col sm:flex-row gap-3">
            {showSearch && (
              <div className="relative">
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar por nombre, científico o alias…"
                  className="w-full sm:w-72 rounded-xl border px-3 py-2 outline-none focus:ring-2
                             bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500
                             focus:ring-fuchsia-500"
                />
              </div>
            )}
            {showSort && (
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="rounded-xl border px-3 py-2 outline-none focus:ring-2
                           bg-white/90 border-white/30 text-slate-900 focus:ring-fuchsia-500"
              >
                <option value="nombre">Ordenar por nombre común (A–Z)</option>
                <option value="cientifico">Ordenar por nombre científico (A–Z)</option>
              </select>
            )}
          </div>
        </header>

        {/* Grid */}
        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/40 bg-white/10 p-8 text-center text-white">
            No hay peces que coincidan con tu búsqueda.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((p, idx) => {
              const key = `${slugify(p.nombre || p.nombre_cientifico || String(idx))}-${idx}`;
              const img = p.imagen || '/placeholder.webp';
              const alt = p.nombre || p.nombre_cientifico || 'Pez';
              const alias = Array.isArray(p.otros_nombres) ? p.otros_nombres : [];
              return (
                <article
                  key={key}
                  className="group rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur ring-1 ring-white/30 hover:ring-white/60 transition"
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => openModal(p)}
                    aria-label={`Ver detalles de ${p.nombre || alt}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={img}
                        alt={alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-4 flex flex-col gap-3">
                      <header className="space-y-1">
                        <h3 className="text-lg font-semibold leading-tight text-slate-900 dark:text-white">
                          {p.nombre || '—'}
                        </h3>
                        {p.nombre_cientifico && (
                          <p className="text-sm italic text-slate-700 dark:text-slate-300">
                            <Highlight text={p.nombre_cientifico} query={q} />
                          </p>
                        )}
                      </header>

                      {alias.length > 0 && (
                        <ul className="flex flex-wrap gap-2">
                          {alias.map((n) => (
                            <li
                              key={n}
                              className="text-xs bg-slate-100 text-slate-700 rounded-full px-2 py-1 dark:bg-slate-800 dark:text-slate-200"
                            >
                              <Highlight text={n} query={q} />
                            </li>
                          ))}
                        </ul>
                      )}

                      {p.descripcion && (
                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
                          <Highlight text={p.descripcion} query={q} />
                        </p>
                      )}

                      <div className="mt-1 flex items-center gap-3">
                        <span className="ml-auto text-sm font-medium text-fuchsia-50 bg-fuchsia-700 group-hover:bg-fuchsia-600 px-2.5 py-1 rounded-lg">
                          Ver detalles
                        </span>
                      </div>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      <DetailsModal
        open={open}
        fish={current}
        onClose={closeModal}
        onPrev={goPrev}
        onNext={goNext}
      />
    </section>
  );
}
