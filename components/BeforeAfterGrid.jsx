// components/BeforeAfterGrid.jsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Images } from 'lucide-react';
import galleryData from '@/data/gallery-data.json' assert { type: 'json' };
import testimonialMeta from '@/data/testimonial.json' assert { type: 'json' };

const FALLBACK_IMG = '/gallery/goldfish.webp';

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
  const d = testimonialMeta?.defaults || {};
  const found = testimonialMeta?.items?.find((x) => x.id === id) || {};
  return {
    id,
    comment: found.comment || d.comment || '“Proyecto Atl Ecosystem.”',
    author: found.author || d.author || 'Cliente Atl Ecosystem',
    date: found.date || d.date || 'Proyecto reciente',
    before: `/gallery/testimonials/${id}/before.webp`,
    after: `/gallery/testimonials/${id}/after.webp`,
  };
}

export default function BeforeAfterGrid({ maxItems = 8, intervalMs = 3200 }) {
  // Intersección: solo proyectos que existen en el árbol
  const items = useMemo(() => {
    const ids = getAvailableProjectIdsFromGallery(galleryData);
    const list = ids.map((id) => metaById(id));
    return list.slice(0, maxItems);
  }, [maxItems]);

  if (!items.length) return null;

  return (
    <section className="relative py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">Antes / Después</h2>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-3 py-2 text-sm font-medium hover:bg-slate-100 transition"
          >
            <Images className="h-4 w-4" />
            Ver más fotos
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((proj) => (
            <li key={proj.id}>
              <Card item={proj} intervalMs={intervalMs} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Card({ item, intervalMs }) {
  const [active, setActive] = useState(1); // 0=Antes, 1=Después (por default mostramos "después")
  const [srcs, setSrcs] = useState([item.before, item.after]);
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);

  // Pausar auto-rotación si sale del viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setPaused(!e.isIntersecting)),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-rotación
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a === 0 ? 1 : 0)), Math.max(1800, intervalMs));
    return () => clearInterval(id);
  }, [paused, intervalMs]);

  const onErr = (idx) => {
    setSrcs((prev) => prev.map((s, i) => (i === idx ? FALLBACK_IMG : s)));
  };

  return (
    <article
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/3] w-full">
        {/* BEFORE */}
        <Image
          src={srcs[0]}
          alt={`${item.id} Antes`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width:1024px) 33vw, 25vw"
          className={`absolute inset-0 object-cover transition-opacity duration-700 ${active === 0 ? 'opacity-100' : 'opacity-0'}`}
          onError={() => onErr(0)}
          priority={false}
        />
        {/* AFTER */}
        <Image
          src={srcs[1]}
          alt={`${item.id} Después`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width:1024px) 33vw, 25vw"
          className={`absolute inset-0 object-cover transition-opacity duration-700 ${active === 1 ? 'opacity-100' : 'opacity-0'}`}
          onError={() => onErr(1)}
          priority={false}
        />

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Botones */}
        <div className="absolute top-3 left-3 flex gap-2 text-xs font-semibold">
          {['Antes', 'Después'].map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={[
                'px-3 py-1 rounded-full shadow-md outline-none transition',
                'focus:ring-2 focus:ring-white/80 focus:outline-none',
                active === i ? 'bg-emerald-600 text-white' : 'bg-black/70 text-white hover:bg-black/80',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3">
        <p className="text-slate-100 text-sm leading-relaxed italic">{item.comment}</p>
        <p className="mt-1 text-[12px] text-slate-300">
          <span className="font-semibold">— {item.author}</span>
          <span className="mx-1">•</span>
          <span>{item.date}</span>
        </p>
      </div>
    </article>
  );
}
