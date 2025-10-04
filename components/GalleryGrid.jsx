// components/GalleryGrid.jsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'yet-another-react-lightbox/styles.css';
import Lightbox from 'yet-another-react-lightbox';

/**
 * Normaliza distintos formatos posibles de gallery-data.json
 * Admite:
 *  - Array simple: [".../a.webp", ".../b.webp"]
 *  - Array de objetos: [{ src, alt?, w?, h?, caption? }, ...]
 *  - Objeto con { items: [...] }
 *  - Objeto por secciones: { mantenimiento: [...], remodelacion: [...], ... }
 */
function normalizeGalleryData(raw) {
  const makeItem = (x) => {
    if (typeof x === 'string') return { src: toAbsolute(x) };
    if (x && typeof x === 'object') {
      const { src, url, alt, caption, title, w, h, width, height } = x;
      const _src = toAbsolute(src || url || '');
      return {
        src: _src,
        alt: alt || title || '',
        // Lightbox usa width/height; si no vienen, los omitimos
        width: Number(width || w) || undefined,
        height: Number(height || h) || undefined,
        // guardamos caption opcional en "description" (Lightbox lo admite)
        description: caption || undefined,
      };
    }
    return null;
  };

  const flatten = (arr) =>
    arr
      .map(makeItem)
      .filter(Boolean)
      // orden alfanumérico estable por src
      .sort((a, b) => (a.src || '').localeCompare(b.src || '', undefined, { numeric: true }));

  if (Array.isArray(raw)) return flatten(raw);

  if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.items)) return flatten(raw.items);

    // Si es objeto por secciones, concatenamos todas
    const all = [];
    for (const key of Object.keys(raw)) {
      const val = raw[key];
      if (Array.isArray(val)) all.push(...val);
      // también admitimos { key: { items: [...] } }
      else if (val && typeof val === 'object' && Array.isArray(val.items)) {
        all.push(...val.items);
      }
    }
    if (all.length) return flatten(all);
  }

  return [];
}

function toAbsolute(p) {
  if (!p) return '';
  // asegura prefijo "/" para servir desde /public
  return p.startsWith('/') ? p : `/${p}`;
}

export default function GalleryCarousel() {
  const [slides, setSlides] = useState([]); // [{src, alt?, width?, height?, description?}, ...]
  const [index, setIndex] = useState(-1); // -1 = cerrado
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr('');

    fetch('/gallery-data.json', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status}${txt ? `: ${txt}` : ''}`);
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const normalized = normalizeGalleryData(data);
        setSlides(normalized);
      })
      .catch((e) => {
        if (cancelled) return;
        setErr(e?.message || 'Error al cargar la galería');
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  const hasContent = slides.length > 0;

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-teal-600 font-bold text-center mb-12">
          Galería de Proyectos
        </h2>

        {/* Estado de carga / error */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 w-full rounded-lg bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && err && (
          <div className="text-center text-red-600 font-medium">
            {err}
          </div>
        )}

        {!loading && !err && !hasContent && (
          <div className="text-center text-slate-600">
            No hay imágenes disponibles.
          </div>
        )}

        {!loading && !err && hasContent && (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            loop
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {slides.map((img, i) => (
              <SwiperSlide key={img.src ?? i}>
                <div
                  className="overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => setIndex(i)}
                >
                  <img
                    src={img.src}
                    alt={img.alt || `Proyecto ${i + 1}`}
                    className="object-cover w-full h-64"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Lightbox al hacer clic */}
        <Lightbox
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={slides}
          index={index}
          on={{
            view: ({ index: currentIndex }) => setIndex(currentIndex),
          }}
          styles={{
            container: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            root: {
              maxWidth: '90vw',
              maxHeight: '80vh',
              margin: 'auto',
              borderRadius: '1rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            },
            slide: {
              padding: '1rem',
            },
          }}
        />
      </div>
    </section>
  );
}
