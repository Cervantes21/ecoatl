'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import plantsData from '@/data/plants.json';

function cx(...c) { return c.filter(Boolean).join(' '); }
function slugify(str=''){
  return str.toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}
function escapeRegExp(s=''){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function Highlight({ text, query }) {
  if (!query) return <>{text}</>;
  const re = new RegExp(`(${escapeRegExp(query)})`, 'ig');
  const parts = String(text).split(re);
  return parts.map((p, i) =>
    re.test(p) ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>
  );
}

export default function PlantsGallery({
  initialCategorySlug = null,
  showTabs = true,
  showHeading = false,
  showSearch = true,
  className = '',
}) {
  // Normaliza [{categoria, slug, plantas:[...]}]
  const normalized = useMemo(() => (
    (plantsData || []).map(cat => ({
      categoria: cat.categoria || 'Sin categoría',
      slug: slugify(cat.categoria || 'sin-categoria'),
      plantas: Array.isArray(cat.plantas) ? cat.plantas : [],
    }))
  ), []);

  const [activeIdx, setActiveIdx] = useState(0);
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState(null);

  // Autocomplete UI
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1); // índice resaltado
  const listboxId = 'plants-suggestions';
  const inputRef = useRef(null);

  // Categoría inicial por slug (?cat=...)
  useEffect(() => {
    if (!initialCategorySlug) return;
    const idx = normalized.findIndex(c => c.slug === initialCategorySlug);
    if (idx !== -1) setActiveIdx(idx);
  }, [initialCategorySlug, normalized]);

  // Seguridad si cambia el JSON
  useEffect(() => {
    if (activeIdx > normalized.length - 1) setActiveIdx(0);
  }, [normalized, activeIdx]);

  const activeCat = normalized[activeIdx] || { categoria:'', slug:'', plantas:[] };

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
    return activeCat.plantas.filter(p => {
      const corpus = [
        p.nombre, p.nombre_cientifico,
        ...(Array.isArray(p.otros_nombres) ? p.otros_nombres : []),
        p.descripcion
      ].filter(Boolean).join(' ').toLowerCase();
      return corpus.includes(q);
    });
  }, [activeCat.plantas, query]);

  // Sugerencias (globales, no por categoría)
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const pool = allPlants.flatMap(item => {
      const { plant } = item;
      const names = [plant.nombre, plant.nombre_cientifico, ...(Array.isArray(plant.otros_nombres) ? plant.otros_nombres : [])];
      return names.filter(Boolean).map(label => ({ ...item, label }));
    });
    const seen = new Set();
    const result = [];
    for (const s of pool) {
      const l = s.label.toLowerCase();
      if (!l.includes(q)) continue;
      if (seen.has(l)) continue;
      seen.add(l);
      result.push(s);
      if (result.length >= 7) break;
    }
    return result;
  }, [allPlants, query]);

  // Cerrar modal con Esc
  const onKeyPreview = useCallback((e) => { if (e.key === 'Escape') setPreview(null); }, []);
  useEffect(() => {
    if (!preview) return;
    window.addEventListener('keydown', onKeyPreview);
    return () => window.removeEventListener('keydown', onKeyPreview);
  }, [preview, onKeyPreview]);

  // Seleccionar sugerencia
  const selectSuggestion = useCallback((sugg) => {
    setActiveIdx(sugg.catIndex);
    setQuery(sugg.label);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    // esperar para que renderice
    setTimeout(() => {
      const el = document.getElementById(sugg.key);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }, []);

  // Navegación por teclado en el input
  const onInputKeyDown = (e) => {
    if (!showSuggestions && ['ArrowDown','ArrowUp'].includes(e.key)) {
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
                onClick={() => { setActiveIdx(idx); setQuery(''); }}
                className={cx(
                  'whitespace-nowrap rounded-2xl px-4 py-2 text-sm sm:text-base transition',
                  active
                    ? 'bg-fuchsia-600 text-white shadow'
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
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); setActiveSuggestion(-1); }}
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
                    <span className="truncate">
                      <Highlight text={s.label} query={query} />
                    </span>
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

          return (
            <article
              id={key}
              key={key}
              className="group rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition dark:bg-slate-900 dark:border-slate-800"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={img}
                  alt={alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
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
                      <li key={n} className="text-xs bg-slate-100 text-slate-700 rounded-full px-2 py-1 dark:bg-slate-800 dark:text-slate-200">
                        {n}
                      </li>
                    ))}
                  </ul>
                )}

                {p.descripcion && (
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">{p.descripcion}</p>
                )}

                <div className="mt-1">
                  <button
                    onClick={() => setPreview(p)}
                    className="text-sm font-medium text-fuchsia-700 hover:text-fuchsia-900 dark:text-fuchsia-400 dark:hover:text-fuchsia-300"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal */}
      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute right-3 top-3 rounded-full border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <div className="relative aspect-[4/3]">
              <Image
                src={preview.imagen || '/placeholder.webp'}
                alt={preview.nombre || 'Planta'}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>

            <div className="p-5 space-y-3">
              <h3 className="text-xl font-semibold">{preview.nombre}</h3>
              {preview.nombre_cientifico && (
                <p className="italic text-slate-600 dark:text-slate-400">{preview.nombre_cientifico}</p>
              )}
              {Array.isArray(preview.otros_nombres) && preview.otros_nombres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {preview.otros_nombres.map((n) => (
                    <span key={n} className="text-xs bg-slate-100 text-slate-700 rounded-full px-2 py-1 dark:bg-slate-800 dark:text-slate-200">
                      {n}
                    </span>
                  ))}
                </div>
              )}
              {preview.descripcion && <p className="text-slate-700 dark:text-slate-300">{preview.descripcion}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
