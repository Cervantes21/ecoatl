// components/Navbar.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { FaWater, FaSpa, FaLeaf, FaFish } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [submenuTimeout, setSubmenuTimeout] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [openNested, setOpenNested] = useState(null);
  const [openFlotantesMobile, setOpenFlotantesMobile] = useState(false);
  const [openFlotantesDesktop, setOpenFlotantesDesktop] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => {
    setIsOpen(false);
    setOpenSubmenu(null);
    setHoveredMenu(null);
    setOpenNested(null);
    setOpenFlotantesMobile(false);
    setOpenFlotantesDesktop(false);
  };

  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) closeMenu();
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const renderMobileSubmenu = type => {
    const isTypeOpen = openSubmenu === type;
    return (
      <ul className={`flex flex-col w-full overflow-hidden transition-all duration-300 ${isTypeOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
        {type === 'servicios' && (
          <>
            <li className="flex items-center gap-2 py-1 px-6 hover:text-green-600">
              <FaWater />
              <Link href="/servicios/estanques" onClick={closeMenu}>Estanques</Link>
            </li>
            <li className="flex items-center gap-2 py-1 px-6 hover:text-green-600">
              <FaSpa />
              <Link href="/servicios/biopool" onClick={closeMenu}>BioPiscinas</Link>
            </li>
            <li className="flex items-center gap-2 py-1 px-6 hover:text-green-600">
              <FaLeaf />
              <Link href="/servicios/eco-aqua" onClick={closeMenu}>Ecosistemas Acuáticos</Link>
            </li>
          </>
        )}
        {type === 'productos' && (
          <>
            {/* Plantas */}
            <li
              className="flex items-center justify-between gap-2 py-1 px-6 hover:text-green-600 cursor-pointer"
              onClick={() => setOpenNested(prev => prev === 'plants' ? null : 'plants')}
            >
              <div className="flex items-center gap-2"><FaLeaf /><span>Plantas</span></div>
              <ChevronDown size={14} className={`transition-transform ${openNested === 'plants' ? 'rotate-180' : ''}`} />
            </li>
            {openNested === 'plants' && (
              <ul className="flex flex-col bg-gray-50">
                <li className="py-1 px-10 hover:text-green-600">
                  <Link href="/products/plants/colocasias" onClick={closeMenu}>Colocasias</Link>
                </li>

                {/* Flotantes (nido móvil) */}
                <li
                  className="flex items-center justify-between py-1 px-10 hover:text-green-600 cursor-pointer"
                  onClick={() => setOpenFlotantesMobile(prev => !prev)}
                >
                  <span>Flotantes</span>
                  <ChevronDown size={12} className={`transition-transform ${openFlotantesMobile ? 'rotate-180' : ''}`} />
                </li>
                {openFlotantesMobile && (
                  <ul className="flex flex-col bg-gray-100">
                    <li className="py-1 px-14 hover:text-green-600">
                      <Link href="/products/plants/flotantes/flotantes" onClick={closeMenu}>Flotantes libres</Link>
                    </li>
                    <li className="py-1 px-14 hover:text-green-600">
                      <Link href="/products/plants/flotantes/arraigadas" onClick={closeMenu}>Arraigadas</Link>
                    </li>
                    <li className="py-1 px-14 hover:text-green-600">
                      <Link href="/products/plants/flotantes" onClick={closeMenu}>Ver todo Flotantes</Link>
                    </li>
                  </ul>
                )}

                <li className="py-1 px-10 hover:text-green-600">
                  <Link href="/products/plants/nenufares" onClick={closeMenu}>Nenúfares</Link>
                </li>
                <li className="py-1 px-10 hover:text-green-600">
                  <Link href="/products/plants/oxigenadoras" onClick={closeMenu}>Oxigenadoras</Link>
                </li>
                <li className="py-1 px-10 hover:text-green-600">
                  <Link href="/products/plants/palustres" onClick={closeMenu}>Palustres</Link>
                </li>
              </ul>
            )}
            {/* Peces */}
            <li className="flex items-center gap-2 py-1 px-6 hover:text-green-600">
              <FaFish />
              <Link href="/products/fish" onClick={closeMenu}>Peces</Link>
            </li>
          </>
        )}
      </ul>
    );
  };

  const renderDesktopSubmenu = type => {
    const isTypeOpen = hoveredMenu === type || openSubmenu === type;
    if (!isTypeOpen) return null;
    return (
      <ul
        className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-md z-50 min-w-[240px] py-2 px-4 text-sm flex flex-col"
        onMouseEnter={() => clearTimeout(submenuTimeout)}
        onMouseLeave={() => {
          const t = setTimeout(() => setHoveredMenu(null), 300);
          setSubmenuTimeout(t);
        }}
      >
        {type === 'servicios' && (
          <>
            <li className="flex items-center gap-2 py-1 hover:text-green-600">
              <FaWater />
              <Link href="/servicios/estanques" onClick={closeMenu}>Estanques</Link>
            </li>
            <li className="flex items-center gap-2 py-1 hover:text-green-600">
              <FaSpa />
              <Link href="/servicios/biopool" onClick={closeMenu}>BioPiscinas</Link>
            </li>
            <li className="flex items-center gap-2 py-1 hover:text-green-600">
              <FaLeaf />
              <Link href="/servicios/eco-aqua" onClick={closeMenu}>Ecosistemas Acuáticos</Link>
            </li>
          </>
        )}

        {type === 'productos' && (
          <>
            {/* Plantas (desktop) */}
            <li className="py-1 flex items-center justify-between cursor-default">
              <div className="flex items-center gap-2"><FaLeaf /><span>Plantas</span></div>
            </li>

            {/* Grupo Plantas */}
            <ul className="ml-6 mt-1">
              <li className="py-1 px-2 hover:text-green-600">
                <Link href="/products/plants/colocasias" onClick={closeMenu}>Colocasias</Link>
              </li>

              {/* Flotantes: solo click (no hover) */}
              <li
                className="py-1 px-2 hover:text-green-600 flex items-center justify-between cursor-pointer select-none"
                onClick={() => {
                  setOpenNested(prev => (prev === 'flotantes' ? null : 'flotantes'));
                  setOpenFlotantesDesktop(prev => !prev);
                }}
              >
                <span>Flotantes</span>
                <ChevronRight size={12} className={`${openNested === 'flotantes' ? 'rotate-90 transition-transform' : 'transition-transform'}`} />
              </li>

              {openNested === 'flotantes' && openFlotantesDesktop && (
                <ul className="ml-4">
                  <li className="py-1 hover:text-green-600">
                    <Link href="/products/plants/flotantes/flotantes" onClick={closeMenu}>Flotantes libres</Link>
                  </li>
                  <li className="py-1 hover:text-green-600">
                    <Link href="/products/plants/flotantes/arraigadas" onClick={closeMenu}>Arraigadas</Link>
                  </li>
                  <li className="py-1 hover:text-green-600">
                    <Link href="/products/plants/flotantes" onClick={closeMenu}>Ver todo Flotantes</Link>
                  </li>
                </ul>
              )}

              <li className="py-1 px-2 hover:text-green-600">
                <Link href="/products/plants/nenufares" onClick={closeMenu}>Nenúfares</Link>
              </li>
              <li className="py-1 px-2 hover:text-green-600">
                <Link href="/products/plants/oxigenadoras" onClick={closeMenu}>Oxigenadoras</Link>
              </li>
              <li className="py-1 px-2 hover:text-green-600">
                <Link href="/products/plants/palustres" onClick={closeMenu}>Palustres</Link>
              </li>
            </ul>

            {/* Peces (desktop) */}
            <li className="flex items-center gap-2 py-1 hover:text-green-600 mt-2">
              <FaFish />
              <Link href="/products/fish" onClick={closeMenu}>Peces</Link>
            </li>
          </>
        )}
      </ul>
    );
  };

  return (
    <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
      <nav className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <Image src="/logo_ecoatl.png" alt="Logo Atl Ecosystem" width={60} height={60} />
          <span className="text-3xl font-bold text-teal-900">Atl Ecosystem</span>
        </Link>

        {/* Hamburger */}
        <button className="lg:hidden text-green-600 focus:outline-none" onClick={toggleMenu} aria-label="Abrir menú">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menu */}
        <ul
          ref={menuRef}
          className={`${isOpen ? 'flex' : 'hidden'} absolute top-20 left-0 w-full bg-white flex-col items-start gap-4 py-6 px-4 shadow-md lg:shadow-none lg:static lg:flex lg:flex-row lg:gap-6 lg:w-auto lg:py-0 lg:px-0 text-base font-medium text-slate-800`}
        >
          {/* Servicios */}
          <li
            className="relative w-full lg:w-auto"
            onMouseEnter={() => { clearTimeout(submenuTimeout); setHoveredMenu('servicios'); }}
            onMouseLeave={() => { const t = setTimeout(() => setHoveredMenu(null), 300); setSubmenuTimeout(t); }}
          >
            <div
              className="flex items-center justify-between lg:justify-start gap-1 cursor-pointer hover:text-green-600 w-full"
              onClick={() => setOpenSubmenu(prev => (prev === 'servicios' ? null : 'servicios'))}
            >
              <span>Servicios</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${openSubmenu === 'servicios' ? 'rotate-180' : ''}`} />
            </div>
            <div className="lg:hidden">{renderMobileSubmenu('servicios')}</div>
            <div className="hidden lg:block">{renderDesktopSubmenu('servicios')}</div>
          </li>

          {/* Productos */}
          <li
            className="relative w-full lg:w-auto"
            onMouseEnter={() => { clearTimeout(submenuTimeout); setHoveredMenu('productos'); }}
            onMouseLeave={() => { const t = setTimeout(() => setHoveredMenu(null), 300); setSubmenuTimeout(t); }}
          >
            <div
              className="flex items-center justify-between lg:justify-start gap-1 cursor-pointer hover:text-green-600 w-full"
              onClick={() => setOpenSubmenu(prev => (prev === 'productos' ? null : 'productos'))}
            >
              <span>Productos</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${openSubmenu === 'productos' ? 'rotate-180' : ''}`} />
            </div>
            <div className="lg:hidden">{renderMobileSubmenu('productos')}</div>
            <div className="hidden lg:block">{renderDesktopSubmenu('productos')}</div>
          </li>

          {/* Otros enlaces */}
          <li><Link href="/gallery" onClick={closeMenu} className="hover:text-green-600">Galería</Link></li>
          <li><Link href="/about" onClick={closeMenu} className="hover:text-green-600">Nosotros</Link></li>
          <li><Link href="/contact" onClick={closeMenu} className="hover:text-green-600">Contacto</Link></li>
        </ul>
      </nav>
    </header>
  );
}
