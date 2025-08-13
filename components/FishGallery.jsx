'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import fishData from '@/data/fish.json';

function cx(...c) {
  return c.filter(Boolean).join(' ');
}

export default function FishGallery({
  title = 'Peces',
  className = '',
  overlay = true
}) {
  const fishes = useMemo(() => Array.isArray(fishData) ? fishData : [], []);
  const [preview, setPreview] = useState(null);

  // Cerrar modal con ESC
  const onKey = useCallback((e) => {
    if (e.key === 'Escape') setPreview(null);
  }, []);
  useEffect(() => {
    if (!preview) return;
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview, onKey]);

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
        poster="/gallery/IMG_20210525_153434.webp"
      />
      {overlay && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-[1px] z-[-1]" aria-hidden />
      )}

      {/* Contenido */}
      <div className="relative container mx-auto px-4 py-10">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow">
            {title}
          </h1>
          <p className="text-white/90 mt-1">
            {fishes.length} {fishes.length === 1 ? 'especie' : 'especies'}
          </p>
        </header>

        {/* Grid */}
        {fishes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/40 bg-white/10 p-8 text-center text-white">
            No hay peces para mostrar.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {fishes.map((p, idx) => {
              const img = p.imagen || '/placeholder.webp';
              const alt = p.nombre || p.nombre_cientifico || 'Pez';
              return (
                <article
                  key={`${p.nombre}-${idx}`}
                  className="group rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur ring-1 ring-white/30 hover:ring-white/60 transition"
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

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                      {p.nombre}
                    </h3>
                    {p.nombre_cientifico && (
                      <p className="text-sm italic text-slate-600 dark:text-slate-300">
                        {p.nombre_cientifico}
                      </p>
                    )}

                    {Array.isArray(p.otros_nombres) && p.otros_nombres.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {p.otros_nombres.map((n) => (
                          <li
                            key={n}
                            className="text-xs rounded-full bg-slate-100 text-slate-700 px-2 py-1
                                       dark:bg-slate-800 dark:text-slate-200"
                          >
                            {n}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setPreview(p)}
                        className="text-sm font-medium text-fuchsia-50 bg-fuchsia-700 hover:bg-fuchsia-600
                                   rounded-lg px-3 py-1.5 transition"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de ficha */}
      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute right-3 top-3 rounded-full border border-slate-300 px-2 py-1 text-sm
                         hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <div className="relative aspect-[4/3]">
              <Image
                src={preview.imagen || '/placeholder.webp'}
                alt={preview.nombre || 'Pez'}
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
                    <span
                      key={n}
                      className="text-xs bg-slate-100 text-slate-700 rounded-full px-2 py-1
                                 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              )}

              {preview.descripcion && (
                <p className="text-slate-700 dark:text-slate-300">{preview.descripcion}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
