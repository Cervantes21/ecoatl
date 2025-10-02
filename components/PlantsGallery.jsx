// components/PlantsGallery.jsx
'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X } from 'lucide-react';
import plantsData from '@/data/plants.json';

function cx(...c) { return c.filter(Boolean).join(' '); }
function slugify(str = '') {
  return str
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
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

// --- Helpers para nutrientes ---
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

  // Paleta por nutriente (chips distintas, accesibles en dark)
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
    <span className={cx(
      'text-xs rounded px-2 py-0.5 border',
      styles
    )}>
      <span className="font-medium">{NUTRIENT_LABELS[name] || name}:</span>{' '}
      <span>{value}</span>
    </span>
  );
}

/* ---------------- MODAL DETALLES (portal al <body> + scroll-lock estable) ---------------- */
function DetailsModal({ open, item, onClose, onPrev, onNext }) {
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

  if (!open || !item || !canPortal) return null;

  const p = item.plant || {};
  const sizes = p.tamanos_disponibles || p['tamaños_disponibles'];
  const alias = Array.isArray(p.otros_nombres) ? p.otros_nombres : [];

  const navBtn =
    'inline-flex items-center rounded-xl px-3 py-2 text-sm bg-[#0e1b2b] text-white hover:bg-green-700 transition border-0 focus:outline-none focus:ring-0';
  const navBtnMobile =
    'rounded-xl px-3 py-2 text-sm bg-[#0e1b2b] text-white hover:bg-green-700 transition border-0 focus:outline-none focus:ring-0';

  const cuidados = p.cuidados || {};
  const nutrientes = cuidados.consumo_nutrientes || {};

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
                   rounded-2xl bg-[#0e1b2b] text-white shadow-2xl
                   overflow-hidden max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold truncate">{p.nombre || '—'}</h2>
            {p.nombre_cientifico && (
              <p className="text-sm italic text-white/80 truncate">{p.nombre_cientifico}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onPrev} className={`hidden sm:inline-flex ${navBtn}`}>Anterior</button>
            <button type="button" onClick={onNext} className={`hidden sm:inline-flex ${navBtn}`}>Siguiente</button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white/10 transition focus:outline-none"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Body con scroll interno */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
            {/* Imagen */}
            <div className="relative aspect-[4/3] md:aspect-auto md:h-[42vh] bg-slate-800">
              {p.imagen ? (
                <Image
                  src={p.imagen}
                  alt={p.nombre || p.nombre_cientifico || 'Planta'}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-content-center text-sm text-white/70">Sin imagen</div>
              )}
              {(item.catName || p.tipo) && (
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  {item.catName && (
                    <span className="rounded-full bg-black/60 text-white text-xs px-2 py-1">{item.catName}</span>
                  )}
                  {p.tipo && (
                    <span className="rounded-full bg-black/60 text-white text-xs px-2 py-1">{p.tipo}</span>
                  )}
                </div>
              )}
            </div>

            {/* Texto */}
            <div className="p-4 sm:p-6">
              {alias.length > 0 && (
                <p className="text-sm text-white/85">
                  <span className="font-medium text-white">También conocida como:</span> {alias.join(', ')}
                </p>
              )}

              {p.descripcion && <p className="mt-3 text-sm leading-6 text-white/90">{p.descripcion}</p>}

              {(p.tipo || Array.isArray(sizes)) && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {p.tipo && (
                    <div className="rounded-xl border border-white/10 p-3">
                      <div className="text-xs uppercase tracking-wide text-white/70 mb-1">Tipo</div>
                      <div className="font-medium">{p.tipo}</div>
                    </div>
                  )}
                  {Array.isArray(sizes) && sizes.length > 0 && (
                    <div className="rounded-xl border border-white/10 p-3">
                      <div className="text-xs uppercase tracking-wide text-white/70 mb-1">Tamaños</div>
                      <div className="flex flex-wrap gap-1">
                        {sizes.map((t) => (
                          <span key={t} className="text-xs rounded bg-green-50 text-green-700 px-2 py-0.5 border border-green-100">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cuidados y necesidades */}
              {p.cuidados && (
                <section className="mt-4 rounded-2xl border border-white/10 p-4">
                  <h4 className="text-sm font-semibold mb-2 text-white">Cuidados y necesidades</h4>
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
                        <div className="text-sm text-white/70 mb-1">Consumo de nutrientes</div>
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
                        <div className="text-sm text-white/70 mb-1">Función en el sistema</div>
                        <p className="text-sm text-white/90">{cuidados.funcion}</p>
                      </div>
                    )}
                  </dl>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Footer (móvil) */}
        <div className="flex sm:hidden items-center justify-between px-4 py-3 border-t border-white/10">
          <button type="button" onClick={onPrev} className={navBtnMobile}>Anterior</button>
          <button type="button" onClick={onNext} className={navBtnMobile}>Siguiente</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* --------------------------------- COMPONENTE PRINCIPAL --------------------------------- */
export default function PlantsGallery({
  initialCategorySlug = null,
  showTabs = true,
  showHeading = false,
  showSearch = true,
  className = '',
}) {
  // Normaliza [{categoria, slug, plantas:[...]}]
  const normalized = useMemo(
    () =>
      (plantsData || []).map((cat) => ({
        categoria: cat.categoria || 'Sin categoría',
        slug: slugify(cat.categoria || 'sin-categoria'),
        plantas: Array.isArray(cat.plantas) ? cat.plantas : [],
      })),
    []
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const [query, setQuery] = useState('');

  // Modal state (índice dentro de filtered)
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);

  // Autocomplete UI
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const listboxId = 'plants-suggestions';
  const inputRef = useRef(null);

  // Categoría inicial por slug
  useEffect(() => {
    if (!initialCategorySlug) return;
    const idx = normalized.findIndex((c) => c.slug === initialCategorySlug);
    if (idx !== -1) setActiveIdx(idx);
  }, [initialCategorySlug, normalized]);

  // Seguridad si cambia el JSON
  useEffect(() => {
    if (activeIdx > normalized.length - 1) setActiveIdx(0);
  }, [normalized, activeIdx]);

  const activeCat = normalized[activeIdx] || { categoria: '', slug: '', plantas: [] };

  // Lista plana de TODAS las plantas (para autocompletar global)
  const allPlants = useMemo(() => {
    return normalized.flatMap((cat, ci) =>
      cat.plantas.map((p, pi) => {
        const key = `${cat.slug}-${slugify(p.nombre || p.nombre_cientifico || String(pi))}`;
        return { catIndex: ci, catSlug: cat.slug, catName: cat.categoria, plant: p, key };
      })
    );
  }, [normalized]);

  // Filtro de grid (aplica en la categoría activa)
  const filtered = useMemo(() => {
    if (!query.trim()) return activeCat.plantas;
    const q = query.trim().toLowerCase();
    return activeCat.plantas.filter((p) => {
      const corpus = [
        p.nombre,
        p.nombre_cientifico,
        ...(Array.isArray(p.otros_nombres) ? p.otros_nombres : []),
        p.descripcion,
        p.tipo,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return corpus.includes(q);
    });
  }, [activeCat.plantas, query]);

  // Sugerencias (globales)
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const pool = allPlants.flatMap((item) => {
      const { plant } = item;
      const names = [
        plant.nombre,
        plant.nombre_cientifico,
        ...(Array.isArray(plant.otros_nombres) ? plant.otros_nombres : []),
      ];
      return names.filter(Boolean).map((label) => ({ ...item, label }));
    });
    const seen = new Set();
    const result = [];
    for (const s of pool) {
      const l = s.label.toLowerCase();
      if (!l.includes(q)) continue;
      if (seen.has(l)) continue;
      result.push(s);
      if (result.length >= 7) break;
    }
    return result;
  }, [allPlants, query]);

  // Abrir modal para un índice dentro de filtered
  const openFromIndex = useCallback((idx) => {
    setSelectedIndex(idx);
    setOpen(true);
  }, []);

  // Cerrar modal
  const closeModal = useCallback(() => setOpen(false), []);

  // Navegar siguiente/anterior dentro de filtered
  const goNext = useCallback(() => {
    if (filtered.length === 0) return;
    setSelectedIndex((i) => (i + 1) % filtered.length);
  }, [filtered.length]);

  const goPrev = useCallback(() => {
    if (filtered.length === 0) return;
    setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  // Accesibilidad: cerrar con Esc (respaldo)
  const onKeyPreview = useCallback((e) => {
    if (e.key === 'Escape') closeModal();
  }, [closeModal]);
  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', onKeyPreview);
    return () => window.removeEventListener('keydown', onKeyPreview);
  }, [open, onKeyPreview]);

  // Seleccionar sugerencia
  const selectSuggestion = useCallback((sugg) => {
    setActiveIdx(sugg.catIndex);
    setQuery(sugg.label);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    setTimeout(() => {
      const el = document.getElementById(sugg.key);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }, []);

  // Navegación por teclado en el input
  const onInputKeyDown = (e) => {
    if (!showSuggestions && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
      setShowSuggestions(true);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion((i) => {
        const next = i + 1;
        return next >= suggestions.length ? 0 : next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion((i) => {
        const prev = i - 1;
        return prev < 0 ? Math.max(suggestions.length - 1, -1) : prev;
      });
    } else if (e.key === 'Enter') {
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        e.preventDefault();
        selectSuggestion(suggestions[activeSuggestion]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  // Ítem seleccionado para el modal
  const selectedItem = useMemo(() => {
    if (!open || selectedIndex < 0 || selectedIndex >= filtered.length) return null;
    return { plant: filtered[selectedIndex], catName: activeCat.categoria };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedIndex, filtered, activeCat.categoria]);

  return (
    <section className={cx('w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6', className)}>
      {showHeading && (
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Plantas acuáticas</h2>
        </div>
      )}

      {/* Tabs internos (opcional) */}
      {showTabs && (
        <div role="tablist" aria-label="Categorías de plantas" className="flex gap-2 overflow-auto pb-2">
          {normalized.map((c, idx) => {
            const active = idx === activeIdx;
            return (
              <button
                key={c.slug}
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${c.slug}`}
                id={`tab-${c.slug}`}
                onClick={() => {
                  setActiveIdx(idx);
                  setQuery('');
                }}
                className={cx(
                  'whitespace-nowrap rounded-2xl px-4 py-2 text-sm sm:text-base transition',
                  active
                    ? 'bg-green-700 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                )}
              >
                {c.categoria}
              </button>
            );
          })}
        </div>
      )}

      {/* Buscador + Autocompletado global */}
      {showSearch && (
        <div className="mt-4 mb-6 w-full flex justify-center relative">
          <label htmlFor="plant-search" className="sr-only">Buscar</label>
          <input
            ref={inputRef}
            id="plant-search"
            type="search"
            placeholder="Buscar planta, nombre científico o alias…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
              setActiveSuggestion(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={onInputKeyDown}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={activeSuggestion >= 0 ? `${listboxId}-opt-${activeSuggestion}` : undefined}
            className="w-full max-w-md rounded-xl border border-green-800 bg-green-700 px-4 py-2
                       text-white placeholder-green-200 outline-none focus:ring-2 focus:ring-green-500
                       transition-all duration-200 focus:scale-[1.02]"
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul
              id={listboxId}
              role="listbox"
              className="absolute top-full mt-1 w-full max-w-md bg-white border border-slate-300 rounded-lg shadow-lg z-10 overflow-hidden"
            >
              {suggestions.map((s, idx) => {
                const active = idx === activeSuggestion;
                return (
                  <li
                    id={`${listboxId}-opt-${idx}`}
                    key={`${s.label}-${s.key}`}
                    role="option"
                    aria-selected={active}
                    onMouseDown={() => selectSuggestion(s)}
                    className={cx(
                      'px-4 py-2 text-slate-700 cursor-pointer flex items-center justify-between gap-4',
                      active ? 'bg-slate-100' : 'hover:bg-slate-50'
                    )}
                    title={`Ver en ${s.catName}`}
                  >
                    <span className="truncate"><Highlight text={s.label} query={query} /></span>
                    <span className="text-xs text-slate-500 shrink-0">{s.catName}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Grid */}
      <div
        id={`panel-${activeCat.slug}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeCat.slug}`}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {query.trim().length > 0 && filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-green-700 bg-green-700/40 p-6 text-center text-green-100">
            No encontramos resultados para <span className="font-medium">“{query}”</span>.{' '}
            <button className="underline hover:no-underline text-green-200" onClick={() => setQuery('')}>
              Limpiar búsqueda
            </button>
          </div>
        )}

        {filtered.map((p, i) => {
          const key = `${activeCat.slug}-${slugify(p.nombre || p.nombre_cientifico || String(i))}`;
          const alias = Array.isArray(p.otros_nombres) ? p.otros_nombres : [];
          const img = p.imagen || '/placeholder.webp';
          const alt = `${p.nombre} (${p.nombre_cientifico || 'nombre científico'})`;
          const sizes = p.tamanos_disponibles || p['tamaños_disponibles'];

          return (
            <article
              id={key}
              key={key}
              className="group rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition dark:bg-slate-900 dark:border-slate-800"
            >
              <button type="button" className="w-full text-left" onClick={() => openFromIndex(i)} aria-label={`Ver detalles de ${p.nombre || alt}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={img}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {p.tipo && (
                    <span className="absolute left-3 top-3 rounded-full bg-black/60 text-white text-xs px-2 py-1">
                      {p.tipo}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <header className="space-y-1">
                    <h3 className="text-lg font-semibold leading-tight">{p.nombre}</h3>
                    {p.nombre_cientifico && (
                      <p className="text-sm italic text-slate-600 dark:text-slate-400">{p.nombre_cientifico}</p>
                    )}
                  </header>

                  {alias.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {alias.map((n) => (
                        <li
                          key={n}
                          className="text-xs bg-slate-100 text-slate-700 rounded-full px-2 py-1 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {n}
                        </li>
                      ))}
                    </ul>
                  )}

                  {p.descripcion && (
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">{p.descripcion}</p>
                  )}

                  <div className="mt-1 flex items-center gap-3">
                    {Array.isArray(sizes) && sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {sizes.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] rounded bg-green-50 text-green-700 px-1.5 py-0.5 border border-green-100"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="ml-auto text-sm font-medium text-green-700 group-hover:text-green-900 dark:text-green-400 dark:group-hover:text-green-300">
                      Ver detalles
                    </span>
                  </div>
                </div>
              </button>
            </article>
          );
        })}
      </div>

      {/* Modal de detalles */}
      <DetailsModal
        open={open}
        item={selectedItem}
        onClose={closeModal}
        onPrev={goPrev}
        onNext={goNext}
      />
    </section>
  );
}
