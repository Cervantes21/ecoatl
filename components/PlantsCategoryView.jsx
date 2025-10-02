// components/PlantsCategoryView.jsx
'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import plantsData from '@/data/plants.json';
import { PLANT_CATEGORIES } from '@/utils/plantsRouting';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

function classNames(...c) { return c.filter(Boolean).join(' '); }

function normalize(str = '') {
  return str
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function byCategoria(data = [], categoriaBuscada = '') {
  const target = normalize(categoriaBuscada);
  return (data || []).find((c) => normalize(c.categoria) === target)
    || { categoria: categoriaBuscada, plantas: [] };
}

/* Reutilizable para filas de cuidados */
function CareRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-sm font-medium text-slate-900 dark:text-slate-100 text-right">{value}</dd>
    </div>
  );
}

/* ---------- Nutrientes: etiquetas, orden y chip visual ---------- */
const NUTRIENT_LABELS = {
  nitrato: 'Nitrato (NO₃⁻)',
  amonio_amonio: 'Amonio (NH₄⁺)',
  fosfato: 'Fosfato (PO₄³⁻)',
  potasio: 'Potasio (K)',
  hierro: 'Hierro (Fe)',
  micronutrientes: 'Micronutrientes',
  co2: 'CO₂',
};
const NUTRIENT_ORDER = [
  'nitrato',
  'amonio_amonio',
  'fosfato',
  'potasio',
  'hierro',
  'micronutrientes',
  'co2',
];
function NutrientBadge({ name, value }) {
  if (!value) return null;
  const styles = {
    nitrato: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/40',
    amonio_amonio: 'bg-lime-50 text-lime-700 border-lime-100 dark:bg-lime-900/20 dark:text-lime-300 dark:border-lime-900/40',
    fosfato: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-900/40',
    potasio: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/40',
    hierro: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-900/40',
    micronutrientes: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-900/40',
    co2: 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-900/40',
  }[name] || 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/20 dark:text-slate-200 dark:border-slate-800';

  return (
    <span className={classNames('text-xs rounded px-2 py-0.5 border', styles)}>
      <span className="font-medium">{NUTRIENT_LABELS[name] || name}:</span>{' '}
      <span>{value}</span>
    </span>
  );
}

function PlantCard({ plant, onOpen }) {
  const {
    nombre,
    nombre_cientifico,
    otros_nombres,
    descripcion,
    imagen,
    tipo,
    tamanos_disponibles,
    ['tamaños_disponibles']: tamaños_disponibles,
  } = plant || {};

  const sizes = tamanos_disponibles || tamaños_disponibles;

  return (
    <article className="group bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 hover:shadow-md transition p-4 flex flex-col dark:bg-slate-900 dark:ring-slate-800">
      <button
        type="button"
        onClick={() => onOpen(plant)}
        className="text-left"
        aria-label={`Ver detalles de ${nombre || nombre_cientifico || 'planta'}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl mb-3 bg-slate-100">
          {imagen ? (
            <Image
              src={imagen}
              alt={nombre || nombre_cientifico || 'Planta acuática'}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 grid place-content-center text-sm text-slate-500">
              Sin imagen
            </div>
          )}
          {tipo && (
            <span className="absolute left-3 top-3 rounded-full bg-black/60 text-white text-xs px-2 py-1">
              {tipo}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {nombre || '—'}
        </h3>
        {nombre_cientifico && (
          <p className="text-sm italic text-slate-700 dark:text-slate-300">
            {nombre_cientifico}
          </p>
        )}
        {Array.isArray(otros_nombres) && otros_nombres.length > 0 && (
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Alias: {otros_nombres.join(', ')}
          </p>
        )}
        {descripcion && (
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
            {descripcion}
          </p>
        )}
      </button>

      {Array.isArray(sizes) && sizes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {sizes.map((t) => (
            <span
              key={t}
              className="text-[10px] rounded bg-fuchsia-50 text-fuchsia-700 px-1.5 py-0.5 border border-fuchsia-100"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4">
        <button
          type="button"
          onClick={() => onOpen(plant)}
          className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-white bg-teal-700 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
        >
          Ver detalles
        </button>
      </div>
    </article>
  );
}

/* ---------------- MODAL DETALLES (portal al <body> + scroll-lock en <html>) ---------------- */
function DetailsModal({ plant, open, onClose, onNext, onPrev }) {
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

  const escHandler = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );

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

  if (!open || !plant || !canPortal) return null;

  const {
    nombre,
    nombre_cientifico,
    otros_nombres,
    descripcion,
    imagen,
    tipo,
    tamanos_disponibles,
    ['tamaños_disponibles']: tamaños_disponibles,
    cuidados,
  } = plant || {};
  const sizes = tamanos_disponibles || tamaños_disponibles;

  const navBtn =
    'inline-flex items-center rounded-xl px-3 py-2 text-sm bg-[#0e1b2b] text-white hover:bg-fuchsia-700 transition border-0 focus:outline-none focus:ring-0';
  const navBtnMobile =
    'rounded-xl px-3 py-2 text-sm bg-[#0e1b2b] text-white hover:bg-fuchsia-700 transition border-0 focus:outline-none focus:ring-0';

  const nutrientes = cuidados?.consumo_nutrientes || {};

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
              <p className="text-sm italic text-slate-600 dark:text-white/80 truncate">
                {nombre_cientifico}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onPrev} className={`hidden sm:inline-flex ${navBtn}`}>Anterior</button>
            <button type="button" onClick={onNext} className={`hidden sm:inline-flex ${navBtn}`}>Siguiente</button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg白/10 transition focus:outline-none"
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
                  alt={nombre || nombre_cientifico || 'Planta'}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-content-center text-sm text-slate-500 dark:text-slate-300">
                  Sin imagen
                </div>
              )}
              {tipo && (
                <span className="absolute left-3 top-3 rounded-full bg-black/60 text-white text-xs px-2 py-1">
                  {tipo}
                </span>
              )}
            </div>

            {/* Texto */}
            <div className="p-4 sm:p-6">
              {Array.isArray(otros_nombres) && otros_nombres.length > 0 && (
                <p className="text-sm">
                  <span className="font-medium">También conocida como:</span> {otros_nombres.join(', ')}
                </p>
              )}

              {descripcion && (
                <p className="mt-3 text-sm leading-6">{descripcion}</p>
              )}

              {Array.isArray(sizes) && sizes.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Tamaños disponibles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] rounded bg-fuchsia-50 text-fuchsia-700 px-2 py-0.5 border border-fuchsia-100 dark:bg-fuchsia-900/20 dark:border-fuchsia-900/30 dark:text-fuchsia-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cuidados y necesidades */}
              {cuidados && (
                <section className="mt-4 rounded-2xl border border-slate-200 dark:border-white/10 p-4">
                  <h4 className="text-sm font-semibold mb-2">Cuidados y necesidades</h4>
                  <dl>
                    <CareRow label="Temperatura" value={cuidados.temperatura} />
                    <CareRow label="pH" value={cuidados.ph} />
                    <CareRow label="Dureza (GH)" value={cuidados.dureza} />
                    <CareRow label="Alcalinidad (KH)" value={cuidados.kh} />
                    <CareRow label="Luz" value={cuidados.luz} />
                    <CareRow label="Profundidad de plantación" value={cuidados.profundidad_plantacion} />
                    <CareRow label="Velocidad de crecimiento" value={cuidados.velocidad_crecimiento} />
                    <CareRow label="Propagación" value={cuidados.propagacion} />
                    <CareRow label="Mantenimiento" value={cuidados.mantenimiento} />
                    <CareRow label="Compatibilidad con fauna" value={cuidados.compatibilidad_fauna} />

                    {/* Nutrientes */}
                    {nutrientes && Object.keys(nutrientes).length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-slate-600 dark:text-white/70 mb-1">Consumo de nutrientes</div>
                        <div className="flex flex-wrap gap-2">
                          {NUTRIENT_ORDER.map((k) =>
                            nutrientes[k] ? <NutrientBadge key={k} name={k} value={nutrientes[k]} /> : null
                          )}
                        </div>
                      </div>
                    )}

                    {/* Función */}
                    {cuidados.funcion && (
                      <div className="mt-3">
                        <div className="text-sm text-slate-600 dark:text-white/70 mb-1">Función en el sistema</div>
                        <p className="text-sm">{cuidados.funcion}</p>
                      </div>
                    )}
                  </dl>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Footer (móvil) */}
        <div className="flex sm:hidden items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-white/10">
          <button type="button" onClick={onPrev} className={navBtnMobile}>Anterior</button>
          <button type="button" onClick={onNext} className={navBtnMobile}>Siguiente</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Props:
 * - categoria: string (nombre exacto como en plants.json)
 * - breadcrumb: [{label, href?}], opcional
 * - showSearch, showSort: boolean
 * - onDark: boolean -> estilos para fondos oscuros
 */
export default function PlantsCategoryView({
  categoria,
  breadcrumb = [],
  showSearch = true,
  showSort = true,
  onDark = false,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const categoryData = useMemo(
    () => byCategoria(plantsData, categoria),
    [categoria]
  );

  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState('nombre'); // 'nombre' | 'cientifico'

  // Modal state
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const base = Array.isArray(categoryData.plantas) ? categoryData.plantas : [];
    if (!q) return base;

    const nQ = normalize(q);
    return base.filter((p) => {
      const campos = [
        p?.nombre,
        p?.nombre_cientifico,
        ...(Array.isArray(p?.otros_nombres) ? p.otros_nombres : []),
        p?.descripcion,
        p?.tipo,
      ]
        .filter(Boolean)
        .map(String)
        .map(normalize);

      return campos.some((c) => c.includes(nQ));
    });
  }, [categoryData.plantas, q]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortKey === 'nombre') {
      arr.sort((a, b) =>
        normalize(a?.nombre || '').localeCompare(normalize(b?.nombre || ''))
      );
    } else if (sortKey === 'cientifico') {
      arr.sort((a, b) =>
        normalize(a?.nombre_cientifico || '').localeCompare(normalize(b?.nombre_cientifico || ''))
      );
    }
    return arr;
  }, [filtered, sortKey]);

  // Índice actual: por etiqueta y, si falla, por ruta actual
  const currentIdx = useMemo(() => {
    const byLabel = PLANT_CATEGORIES.findIndex(
      (c) => normalize(c.label) === normalize(categoryData.categoria)
    );
    if (byLabel !== -1) return byLabel;

    const path = (pathname || '').replace(/\/$/, '');
    const byHref = PLANT_CATEGORIES.findIndex(
      (c) => c.href.replace(/\/$/, '') === path
    );
    return byHref !== -1 ? byHref : 0;
  }, [categoryData.categoria, pathname]);

  const prevCat = currentIdx > 0 ? PLANT_CATEGORIES[currentIdx - 1] : null;
  const nextCat = currentIdx < PLANT_CATEGORIES.length - 1 ? PLANT_CATEGORIES[currentIdx + 1] : null;

  // Modal helpers
  const openModal = useCallback((plant) => {
    setSelected(plant);
    setOpen(true);
  }, []);
  const closeModal = useCallback(() => setOpen(false), []);
  const goNextPlant = useCallback(() => {
    if (!selected) return;
    const i = sorted.findIndex(p => p === selected);
    const next = sorted[(i + 1) % sorted.length];
    setSelected(next);
  }, [selected, sorted]);
  const goPrevPlant = useCallback(() => {
    if (!selected) return;
    const i = sorted.findIndex(p => p === selected);
    const prev = sorted[(i - 1 + sorted.length) % sorted.length];
    setSelected(prev);
  }, [selected, sorted]);

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      {Array.isArray(breadcrumb) && breadcrumb.length > 0 && (
        <nav className={classNames('mb-4 text-sm', onDark ? 'text-white' : 'text-slate-600')}>
          <ol className="flex flex-wrap items-center gap-1">
            {breadcrumb.map((b, idx) => (
              <li key={idx} className="flex items-center gap-1">
                {b.href ? (
                  <Link
                    href={b.href}
                    className={classNames('hover:underline', onDark ? 'hover:text-fuchsia-300' : 'hover:text-fuchsia-700')}
                  >
                    {b.label}
                  </Link>
                ) : (
                  <span>{b.label}</span>
                )}
                {idx < breadcrumb.length - 1 && <span>/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Encabezado + controles */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1
              className={classNames(
                'text-2xl md:text-3xl font-bold',
                onDark ? 'text-white' : 'text-slate-900'
              )}
            >
              {categoryData.categoria}
            </h1>
            <p className={classNames('mt-1', onDark ? 'text-white' : 'text-slate-600')}>
              {Array.isArray(categoryData.plantas) ? categoryData.plantas.length : 0}{' '}
              {categoryData.plantas?.length === 1 ? 'especie' : 'especies'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {showSearch && (
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nombre, científico o alias…"
                className={classNames(
                  'w-full sm:w-72 rounded-xl border px-3 py-2 outline-none focus:ring-2',
                  onDark
                    ? 'bg-transparent border-white text-white placeholder:text-white/70 focus:ring-fuchsia-400'
                    : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:ring-fuchsia-500'
                )}
              />
            )}
            {showSort && (
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className={classNames(
                  'rounded-xl border px-3 py-2 outline-none focus:ring-2',
                  onDark
                    ? 'bg-transparent border-white text-white focus:ring-fuchsia-400'
                    : 'bg-white border-slate-300 text-slate-900 focus:ring-fuchsia-500'
                )}
              >
                <option className="text-slate-900" value="nombre">Ordenar por nombre común (A–Z)</option>
                <option className="text-slate-900" value="cientifico">Ordenar por nombre científico (A–Z)</option>
              </select>
            )}
          </div>
        </div>

        {/* Navegación entre categorías */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Chips */}
          <div className="flex flex-wrap gap-2">
            {PLANT_CATEGORIES.map((c) => {
              const active = normalize(c.label) === normalize(categoryData.categoria);
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className={classNames(
                    'rounded-full border px-3 py-1 text-sm transition',
                    active
                      ? 'bg-fuchsia-600 text-white border-fuchsia-600'
                      : onDark
                        ? 'border-white text-white hover:bg-white/10'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>

          {/* Selector + Prev/Next */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!prevCat}
              onClick={() => prevCat && router.push(prevCat.href)}
              className={classNames(
                'inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm',
                prevCat
                  ? (onDark ? 'border-white/70 text-white hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-50')
                  : (onDark ? 'opacity-40 border-white/40 text-white/60 cursor-not-allowed' : 'opacity-40 border-slate-300 text-slate-400 cursor-not-allowed')
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>

            <select
              value={normalize(categoryData.categoria)}
              onChange={(e) => {
                const target = PLANT_CATEGORIES.find(c => normalize(c.label) === e.target.value);
                if (target) router.push(target.href);
              }}
              className={classNames(
                'rounded-xl border px-3 py-2 text-sm',
                onDark
                  ? 'bg-transparent border-white/70 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              )}
            >
              {PLANT_CATEGORIES.map(c => (
                <option key={c.href} value={normalize(c.label)} className="text-slate-900">
                  {c.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={!nextCat}
              onClick={() => nextCat && router.push(nextCat.href)}
              className={classNames(
                'inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm',
                nextCat
                  ? (onDark ? 'border-white/70 text-white hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-50')
                  : (onDark ? 'opacity-40 border-white/40 text-white/60 cursor-not-allowed' : 'opacity-40 border-slate-300 text-slate-400 cursor-not-allowed')
              )}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div
          className={classNames(
            'rounded-xl border border-dashed p-8 text-center',
            onDark ? 'border-white/40 text-slate-200' : 'border-slate-300 text-slate-600'
          )}
        >
          No encontramos plantas que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((plant, idx) => (
            <PlantCard key={idx} plant={plant} onOpen={openModal} />
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      <DetailsModal
        plant={selected}
        open={open}
        onClose={closeModal}
        onNext={goNextPlant}
        onPrev={goPrevPlant}
      />
    </section>
  );
}
