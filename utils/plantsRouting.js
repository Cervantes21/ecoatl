// utils/plantsRouting.js

// Slug consistente: minúsculas, sin acentos, con guiones
export function slugify(s = '') {
  return s
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Catálogo controlado: etiqueta visible + ruta real del router
export const PLANT_CATEGORIES = [
  { label: 'Colocasias', href: '/products/plants/colocasias' },
  // Nota: tu estructura de rutas para flotantes
  { label: 'Flotantes', href: '/products/plants/flotantes/flotantes' },
  { label: 'Flotantes arraigadas', href: '/products/plants/flotantes/arraigadas' },
  { label: 'Nenúfares', href: '/products/plants/nenufares' },
  { label: 'Oxigenadoras', href: '/products/plants/oxigenadoras' },
  { label: 'Palustres', href: '/products/plants/palustres' },
];

// Mapa slug -> { label, href }
const _map = new Map(
  PLANT_CATEGORIES.map((c) => [slugify(c.label), { label: c.label, href: c.href }])
);

export function getCategoryBySlug(catSlug = '') {
  const key = slugify(catSlug);
  return _map.get(key) || null;
}
