'use client';

import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'yet-another-react-lightbox/styles.css';
import Lightbox from 'yet-another-react-lightbox';

export default function GalleryCarousel() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(-1); // -1 = cerrado

  useEffect(() => {
    fetch('/gallery-data.json')
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((src) => ({ src }));
        setImages(formatted);
      });
  }, []);

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-fuchsia-600 font-bold text-center mb-12">
          Galería de Proyectos
        </h2>

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
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setIndex(i)}
              >
                <img
                  src={img.src}
                  alt={`Proyecto ${i + 1}`}
                  className="object-cover w-full h-64"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Lightbox al hacer clic */}
        <Lightbox
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={images}
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
