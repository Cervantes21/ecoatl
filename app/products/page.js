import Link from 'next/link';
import Image from 'next/image';
import { FaLeaf, FaFish } from 'react-icons/fa';
import { ChevronRight } from 'lucide-react';
import plants from '@/data/plants.json';
import fish from '@/data/fish.json';

export const metadata = {
  title: 'Productos | Atl Ecosystem',
  description: 'Explora nuestras plantas acuáticas y peces para tu estanque, acuario o biopiscina.',
};

function getNames(list = [], max = 6) {
  return list
    .map((item) => item?.name || item?.title || item?.commonName || item?.nombre || item?.especie)
    .filter(Boolean)
    .slice(0, max);
}

const plantExamples = getNames(plants, 6).length
  ? getNames(plants, 6)
  : ['Lirio acuático', 'Jacinto de agua', 'Elodea', 'Lenteja de agua', 'Bacopa', 'Anubias'];

const fishExamples = getNames(fish, 6).length
  ? getNames(fish, 6)
  : ['Carpa Koi', 'Carassius (Goldfish)', 'Guppy', 'Molly', 'Tetra', 'Corydoras'];

export default function ProductsPage() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/Estanque_Adentro_Afuera.webm" type="video/webm" />
      </video>

      {/* Capa oscura para contraste */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Contenido */}
      <div className="relative z-20 isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Productos
            </h1>
            <p className="mt-4 text-lg text-gray-200">
              Elige una categoría para explorar el catálogo y armar tu ecosistema acuático ideal.
            </p>
          </div>

          {/* Grid de categorías */}
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <CategoryCard
              icon={<FaLeaf className="h-7 w-7" aria-hidden="true" />}
              title="Plantas acuáticas"
              href="/products/plants"
              description="Oxigenadoras, flotantes, palustres y tapizantes: mejora la calidad del agua y el equilibrio de tu sistema."
              badgeItems={plantExamples}
              image={{
                src: '/gallery/plantas-acuaticas.webp',
                alt: 'Plantas acuáticas Atl Ecosystem',
              }}
            />

            <CategoryCard
              icon={<FaFish className="h-7 w-7" aria-hidden="true" />}
              title="Peces"
              href="/products/fish"
              description="Koi, goldfish y especies para acuario o estanque. Asesoría para combinaciones compatibles."
              badgeItems={fishExamples}
              image={{
                src: '/gallery/koi-fish.webp',
                alt: 'Peces para estanques y acuarios',
              }}
            />
          </div>

          <div className="mx-auto mt-10 max-w-2xl text-center">
            <p className="text-sm text-gray-300">
              *Esta página es un índice. Entra a cada categoría para ver el catálogo completo,
              fichas técnicas y disponibilidad.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ icon, title, description, href, badgeItems = [], image }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/30 bg-white/90 shadow-sm transition hover:shadow-md backdrop-blur-sm">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image?.src || '/logo_ecoatl.png'}
          alt={image?.alt || title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-slate-800 backdrop-blur-sm">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            {icon}
          </span>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-6">
        <p className="text-slate-700">{description}</p>
        {badgeItems?.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {badgeItems.map((label, idx) => (
              <li
                key={`${label}-${idx}`}
                className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700"
              >
                {label}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-2">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
          >
            Ver {title.toLowerCase()}
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
