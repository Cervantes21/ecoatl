'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import plantsData from '@/data/plants.json';
import { PLANT_CATEGORIES } from '@/utils/plantsRouting';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function classNames(...c) {
  return c.filter(Boolean).join(' ');
}

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

function PlantCard({ plant }) {
  const {
    nombre_comun,
    nombre_cientifico,
    sinonimos,
    descripcion,
    imagen
  } = plant || {};

  return (
    <article className="group bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 hover:shadow-md transition p-4 flex flex-col">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl mb-3 bg-slate-100">
        {imagen ? (
          <Image
            src={imagen}
            alt={nombre_comun || nombre_cientifico || 'Planta acuática'}
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
      </div>

      <h3 className="text-lg font-semibold text-slate-900">
        {nombre_comun || '—'}
      </h3>
      <p className="text-sm italic text-slate-700">{nombre_cientifico || ''}</p>
      {Array.isArray(sinonimos) && sinonimos.length > 0 && (
        <p className="mt-1 text-xs text-slate-600">
          Sinónimos: {sinonimos.join(', ')}
        </p>
      )}
      {descripcion && (
        <p className="mt-3 text-sm text-slate-700">{descripcion}</p>
      )}
    </article>
  );
}

/**
 * Props:
 * - categoria: string (nombre exacto como en plants.json)
 * - breadcrumb: [{label, href?}], opcional
 * - showSearch, showSort: boolean
 * - onDark: boolean -> textos blancos/fucsia sobre fondo oscuro/transparente
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

  const filtered = useMemo(() => {
    const base = Array.isArray(categoryData.plantas) ? categoryData.plantas : [];
    if (!q) return base;

    const nQ = normalize(q);
    return base.filter((p) => {
      const campos = [
        p?.nombre_comun,
        p?.nombre_cientifico,
        ...(Array.isArray(p?.sinonimos) ? p.sinonimos : []),
        p?.descripcion
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
        normalize(a?.nombre_comun || '').localeCompare(normalize(b?.nombre_comun || ''))
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

  const prev = currentIdx > 0 ? PLANT_CATEGORIES[currentIdx - 1] : null;
  const next = currentIdx < PLANT_CATEGORIES.length - 1 ? PLANT_CATEGORIES[currentIdx + 1] : null;

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      {Array.isArray(breadcrumb) && breadcrumb.length > 0 && (
        <nav className={classNames("mb-4 text-sm text-white")}>
          <ol className="flex flex-wrap items-center gap-1">
            {breadcrumb.map((b, idx) => (
              <li key={idx} className="flex items-center gap-1">
                {b.href ? (
                  <Link
                    href={b.href}
                    className={classNames(
                      "hover:underline hover:text-green-600")}>
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
                "text-2xl md:text-3xl font-bold text-white"
              )}
            >
              {categoryData.categoria}
            </h1>
            <p className={classNames("mt-1 text-white")}>
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
                placeholder="Buscar por nombre, científico o sinónimo…"
                className={classNames(
                  "w-full sm:w-72 rounded-xl border px-3 py-2 outline-none focus:ring-2",
                  onDark
                    ? "bg-transparent border-white text-white placeholder:text-white/70 focus:ring-fuchsia-400"
                    : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:ring-fuchsia-500"
                )}
              />
            )}
            {showSort && (
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className={classNames(
                  "rounded-xl border px-3 py-2 outline-none focus:ring-2",
                  onDark
                    ? "bg-transparent border-white text-white focus:ring-fuchsia-400"
                    : "bg-white border-slate-300 text-slate-900 focus:ring-fuchsia-500"
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
                    "rounded-full border px-3 py-1 text-sm transition",
                    active
                      ? "bg-fuchsia-600 text-white border-fuchsia-600"
                      : onDark
                        ? "border-white text-white hover:bg-slate-900"
                        : "border-slate-300 text-white hover:bg-slate-900"
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
              disabled={!prev}
              onClick={() => prev && router.push(prev.href)}
              className={classNames(
                "inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm",
                prev
                  ? (onDark ? "border-white/70 text-white hover:bg-white/10" : "border-slate-300 text-white hover:bg-slate-900")
                  : (onDark ? "opacity-40 border-white/40 text-white/60 cursor-not-allowed" : "opacity-40 border-slate-300 text-slate-400 cursor-not-allowed")
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
                "rounded-xl border px-3 py-2 text-sm",
                onDark
                  ? "bg-transparent border-white/70 text-white"
                  : "bg-white border-slate-300 text-slate-900"
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
              disabled={!next}
              onClick={() => next && router.push(next.href)}
              className={classNames(
                "inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm",
                next
                  ? (onDark ? "border-white/70 text-white hover:bg-white/10" : "border-slate-300 text-white hover:bg-slate-900")
                  : (onDark ? "opacity-40 border-white/40 text-white/60 cursor-not-allowed" : "opacity-40 border-slate-300 text-slate-400 cursor-not-allowed")
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
            "rounded-xl border border-dashed p-8 text-center",
            onDark ? "border-white/40 text-slate-200" : "border-slate-300 text-slate-600"
          )}
        >
          No encontramos plantas que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((plant, idx) => (
            <PlantCard key={idx} plant={plant} />
          ))}
        </div>
      )}
    </section>
  );
}
