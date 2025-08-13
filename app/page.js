// app/page.js
import Hero from '@/components/Hero.jsx';
import ServiceGrid from '@/components/ServiceGrid.jsx';
import GalleryGrid from '@/components/GalleryGrid.jsx';
import Testimonial from '@/components/Testimonial.jsx';
import ContactCTA from '@/components/ContactCTA.jsx';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceGrid />
      <GalleryGrid />
      <Testimonial />
      <ContactCTA />
    </>
  );
}