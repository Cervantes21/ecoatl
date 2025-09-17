// app/layout.js
import './globals.css';
import { Quicksand } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Whatsapp } from '@/components/Whatsapp';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Blue Garden - Estanques, Acuarios y BioPiscinas',
    template: '%s | Blue Garden',
  },
  description:
    'Diseñamos y construimos ecosistemas acuáticos: bio-piscinas, estanques, cascadas y más.',

  alternates: { canonical: '/' },

  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Blue Garden',
    images: [
      // ✅ sirve desde /public/logo_blue-garden.webp
      { url: '/logo_blue-garden.webp' },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Blue Garden',
    description:
      'Diseñamos y construimos ecosistemas acuáticos: bio-piscinas, estanques, cascadas y más.',
    images: ['/logo_blue-garden.webp'],
  },

  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }, // opcional si lo tienes
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={quicksand.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Whatsapp />
      </body>
    </html>
  );
}
