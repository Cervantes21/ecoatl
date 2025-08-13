'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Define los proyectos y sus datos
const testimonials = [
  {
    id: 'project1',
    comment: '“El estanque que diseñaron para nuestro jardín superó nuestras expectativas. ¡Ahora tenemos un ecosistema completo en casa!”',
    author: 'Cliente Satisfecho',
    date: 'Agosto 2023',
  },
  {
    id: 'project2',
    comment: '“La instalación de la bio-piscina cambió por completo nuestro espacio. ¡Es increíble!”',
    author: 'Familia Pérez',
    date: 'Mayo 2024',
  },
  {
    id: 'project3',
    comment: '“Gracias a Blue Garden, tenemos un estanque con estilo único. ¡Todos lo admiran!”',
    author: 'Jardín Botánico',
    date: 'Enero 2025',
  },
  {
    id: 'project4',
    comment: '“El antes y después es notable. Nuestro patio ahora es el favorito de la familia.”',
    author: 'Residencia López',
    date: 'Marzo 2025',
  },
];

export default function Testimonial() {
  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => (
            <FadeCarousel key={item.id} project={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FadeCarousel({ project }) {
  const [active, setActive] = useState(0);

  const images = [
    `/gallery/testimonials/${project.id}/before.webp`,
    `/gallery/testimonials/${project.id}/after.webp`,
  ];

  // Cambia de imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="relative w-full h-48 overflow-hidden rounded-lg">
        {images.map((src, idx) => (
          <Image
            key={src}
            src={src}
            alt={`${project.id} ${idx === 0 ? 'Antes' : 'Después'}`}
            fill
            className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
              active === idx ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-700 italic">{project.comment}</p>
        <h4 className="mt-2 font-semibold text-green-800">— {project.author}</h4>
        <span className="block text-sm text-gray-500">{project.date}</span>
      </div>
    </div>
  );
}
