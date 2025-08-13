// app/layout.js
import './globals.css';
import { Quicksand } from 'next/font/google';
import Navbar from '@/components/Navbar.jsx';
import Footer from '@/components/Footer.jsx';
import { Whatsapp } from '@/components/Whatsapp.jsx';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], 
  display: 'swap',
});

export const metadata = {
  title: 'Blue Garden - Estanques, Acuarios y BioPiscinas',
  description: 'Diseñamos y construimos ecosistemas acuáticos: bio-piscinas, estanques, cascadas y más.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={quicksand.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Whatsapp />
      </body>
    </html>
  );
}
