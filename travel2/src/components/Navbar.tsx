import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Menu, X, Compass } from 'lucide-react';

const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Paket Wisata', href: '#paket' },
  { label: 'Destinasi', href: '#destinasi' },
  { label: 'Testimoni', href: '#testimoni' },
  { label: 'Hubungi Kami', href: '#kontak' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#beranda');
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(`#${entry.target.id}`);
        });
      },
      { threshold: 0.35 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Entrance animation — scoped with gsap.context
  useEffect(() => {
    if (!navRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
      );
      gsap.fromTo(
        '.nav-link',
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out', delay: 0.45 }
      );
      gsap.fromTo(
        '.nav-cta',
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)', delay: 0.85 }
      );
    }, navRef);
    return () => ctx.revert();
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;
    if (mobileOpen) {
      gsap.fromTo(mobileMenuRef.current, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' });
      gsap.fromTo('.mobile-link', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.1 });
    } else {
      gsap.to(mobileMenuRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  }, [mobileOpen]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-2xl border-b border-white/60 shadow-lg shadow-primary-900/[0.05] py-3'
          : 'bg-transparent py-5'
      }`}
      style={{ opacity: 0 }}
      aria-label="Navigasi utama"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#beranda" className="flex items-center gap-2.5 group" aria-label="TravelDash - Beranda">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            scrolled
              ? 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25'
              : 'bg-white/15 backdrop-blur-sm border border-white/25'
          }`}>
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
            scrolled ? 'text-primary-700' : 'text-white'
          }`}>
            TravelDash
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = activeLink === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`nav-link text-sm font-medium transition-all duration-300 relative group pb-1 ${
                  scrolled
                    ? isActive ? 'text-primary-600' : 'text-neutral-500 hover:text-primary-600'
                    : isActive ? 'text-white' : 'text-white/75 hover:text-white'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full transition-all duration-300 ${
                  scrolled ? 'bg-primary-500' : 'bg-white'
                } ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block nav-cta">
          <a href="#kontak" className="btn-primary text-sm px-6 py-2.5" id="nav-booking-cta">
            Booking Sekarang
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 rounded-xl transition-colors ${
            scrolled ? 'text-neutral-700 hover:bg-neutral-100' : 'text-white hover:bg-white/10'
          }`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="md:hidden overflow-hidden bg-white/95 backdrop-blur-2xl border-t border-neutral-100"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="px-6 py-5 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`mobile-link font-medium py-3 px-4 rounded-xl transition-all ${
                activeLink === link.href
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a href="#kontak" onClick={() => setMobileOpen(false)} className="btn-primary text-center mt-3">
            Booking Sekarang
          </a>
        </div>
      </div>
    </nav>
  );
}
