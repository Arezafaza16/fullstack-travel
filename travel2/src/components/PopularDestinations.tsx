import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { BACKEND_API } from '../constant';

gsap.registerPlugin(ScrollTrigger);

const layoutVariants = [
  { colSpan: 'sm:col-span-2 sm:row-span-2', height: 'h-64 sm:h-full' },
  { colSpan: '', height: 'h-56' },
  { colSpan: '', height: 'h-56' },
  { colSpan: '', height: 'h-56' },
  { colSpan: 'sm:col-span-2', height: 'h-56' },
];

export default function PopularDestinations() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(BACKEND_API + '/destinations');
        const data = await res.json();
        const enriched = data.map((item: any, index: number) => ({
          ...item,
          ...layoutVariants[index % layoutVariants.length],
        }));
        setDestinations(enriched);
      } catch (err) {
        console.error('Failed to fetch destinations:', err);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current || destinations.length === 0) return;
    const ctx = gsap.context(() => {
      const heading = sectionRef.current!.querySelector('.section-heading');
      if (heading) {
        gsap.fromTo(
          heading.children,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
          }
        );
      }
      gsap.fromTo(
        gridRef.current!.children,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [destinations]);

  return (
    <section id="destinasi" ref={sectionRef} className="py-20 sm:py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="section-heading text-center max-w-2xl mx-auto mb-14">
          <div className="section-badge mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            Jelajahi Indonesia
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 mb-4">
            Destinasi Populer
          </h2>
          <p className="text-neutral-500 text-lg">
            Indonesia memiliki keindahan alam yang tiada duanya. Temukan destinasi impian Anda.
          </p>
          <div className="section-divider" />
        </div>

        {/* Masonry Grid */}
        <div ref={gridRef} className="grid sm:grid-cols-3 gap-4">
          {destinations.map((dest) => (
            <a
              key={dest._id}
              href="#paket"
              className={`${dest.colSpan} group relative rounded-2xl overflow-hidden ${dest.height} block`}
            >
              <img
                src={dest.imageUrl}
                alt={dest.headerTitle}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 drop-shadow-sm">
                    {dest.headerTitle}
                  </h3>
                  <p className="text-sm text-white/70 font-medium">{dest.description}</p>
                </div>
                {/* Orange "Explore" arrow */}
                <div className="w-10 h-10 rounded-full bg-accent-500/80 backdrop-blur-sm flex items-center justify-center shrink-0 ml-3 group-hover:bg-accent-500 group-hover:scale-110 transition-all duration-300">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
