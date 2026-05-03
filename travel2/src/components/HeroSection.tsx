import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ChevronDown, MapPin, Users, Globe, Shield } from 'lucide-react';
import { BACKEND_API } from '../constant';

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState<any[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Animate text content — scoped properly
  const animateText = useCallback(() => {
    if (!textRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(textRef.current!.children),
        { y: 50, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
      );
    }, textRef);
    return () => ctx.revert();
  }, []);

  // Initial animation
  useEffect(() => {
    const cleanup = animateText();
    return cleanup;
  }, [animateText]);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(BACKEND_API + '/banners');
        const data = await res.json();
        // Sort by order field if present
        const sorted = Array.isArray(data) ? data.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)) : data;
        setBanners(sorted);
      } catch (err) {
        console.error('Failed to fetch banners:', err);
      }
    };
    fetchBanners();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (banners.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [banners.length]);

  // Animate text on slide change
  useEffect(() => {
    const cleanup = animateText();
    return cleanup;
  }, [current, animateText]);

  // Stats animation after banners load
  useEffect(() => {
    if (!heroRef.current || banners.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stat-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 1.2 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, [banners]);

  const goToSlide = (index: number) => {
    setCurrent(index);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
  };

  if (banners.length === 0) {
    return (
      <section id="beranda" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-primary-900">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </section>
    );
  }

  const slide = banners[current];

  return (
    <section id="beranda" ref={heroRef} className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background Slides */}
      {banners.map((s, i) => (
        <div key={s._id} className={`hero-slide ${i === current ? 'active' : ''}`}>
          <img src={s.imageUrl} alt={s.location} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div ref={textRef} className="max-w-3xl">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <MapPin className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-medium text-white/90">{slide.location}</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white mb-6 drop-shadow-lg whitespace-pre-line">
            {slide.headerTitle}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/80 max-w-xl mb-10 leading-relaxed font-light">
            {slide.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#paket" id="hero-lihat-paket" className="btn-primary text-base px-8 py-4 animate-pulse-glow">
              Lihat Paket <span className="ml-1">→</span>
            </a>
            <a href="#kontak" id="hero-booking" className="btn-outline text-base px-8 py-4">
              Booking Sekarang
            </a>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 stats-strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { icon: Users, value: '5,000+', label: 'Wisatawan Puas' },
            { icon: Globe, value: '50+', label: 'Destinasi' },
            { icon: Shield, value: '10+', label: 'Tahun Pengalaman' },
            { icon: MapPin, value: '4.9/5', label: 'Rating' },
          ].map((stat) => (
            <div key={stat.label} className="stat-item flex items-center gap-3" style={{ opacity: 0 }}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`rounded-full transition-all duration-500 ${
              i === current ? 'w-10 h-3 bg-accent-500' : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-28 sm:bottom-24 right-8 z-10 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-white/40 tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        <ChevronDown className="w-4 h-4 text-white/40" />
      </div>
    </section>
  );
}
