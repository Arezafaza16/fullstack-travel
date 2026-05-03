import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Rina Permatasari',
    location: 'Bali Trip',
    rating: 5,
    text: 'Pengalaman yang luar biasa! Semua sudah diatur dengan rapi, dari hotel sampai transportasi. Guide-nya ramah dan sangat informatif. Pasti akan booking lagi untuk liburan berikutnya.',
    avatar: '👩',
  },
  {
    name: 'Budi Santoso',
    location: 'Bromo Adventure',
    rating: 5,
    text: 'Sunrise di Bromo benar-benar tak terlupakan. Tim TravelDash sangat profesional, semuanya on-time dan terorganisir dengan baik. Worth every penny!',
    avatar: '👨',
  },
  {
    name: 'Dewi & Keluarga',
    location: 'Lombok Getaway',
    rating: 5,
    text: 'Liburan keluarga terbaik yang pernah kami alami. Anak-anak sangat senang, akomodasi nyaman, dan pantainya menakjubkan. Terima kasih TravelDash!',
    avatar: '👩‍👧‍👦',
  },
  {
    name: 'Ahmad Rizky',
    location: 'Raja Ampat Explorer',
    rating: 5,
    text: 'Raja Ampat memang surga tersembunyi. Paket dari TravelDash sangat lengkap, termasuk perlengkapan snorkeling dan pemandu lokal yang berpengalaman.',
    avatar: '🧔',
  },
  {
    name: 'Siti Nurhaliza',
    location: 'Labuan Bajo Trip',
    rating: 5,
    text: 'Melihat komodo secara langsung adalah pengalaman seumur hidup. Boat trip-nya sangat menyenangkan dan crew-nya profesional. Sangat direkomendasikan!',
    avatar: '👩',
  },
];

const stats = [
  { value: '5,000+', label: 'Wisatawan Puas' },
  { value: '4.9/5', label: 'Rating' },
  { value: '98%', label: 'Booking Ulang' },
  { value: '50+', label: 'Destinasi' },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, []);

  // Section entrance GSAP
  useEffect(() => {
    if (!sectionRef.current) return;
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
      const card = sectionRef.current!.querySelector('.testimonial-card');
      if (card) {
        gsap.fromTo(card, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 85%', once: true },
        });
      }
      const statsEls = sectionRef.current!.querySelectorAll('.stat-box');
      gsap.fromTo(statsEls, { y: 25, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: statsEls[0], start: 'top 90%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Slide change animation
  useEffect(() => {
    if (cardInnerRef.current) {
      gsap.fromTo(
        cardInnerRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [current]);

  return (
    <section id="testimoni" ref={sectionRef} className="py-20 sm:py-28 bg-primary-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="section-heading text-center max-w-2xl mx-auto mb-14">
          <div className="section-badge mb-4">
            <Star className="w-3.5 h-3.5 fill-primary-500 text-primary-500" />
            Testimoni
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-neutral-500 text-lg">
            Cerita nyata dari para traveler yang sudah merasakan pengalaman bersama kami.
          </p>
          <div className="section-divider" />
        </div>

        {/* Testimonial Card */}
        <div className="testimonial-card max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg shadow-primary-500/[0.06] border border-primary-100/60 relative overflow-hidden">
            {/* Decorative quote */}
            <div className="absolute top-6 right-8 opacity-[0.05]">
              <Quote className="w-24 h-24 text-primary-600" />
            </div>

            <div ref={cardInnerRef} key={current}>
              {/* Stars — amber/orange */}
              <div className="flex gap-1 mb-5">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent-400 fill-accent-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-neutral-700 text-lg leading-relaxed mb-8 relative z-10">
                "{testimonials[current].text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <span className="text-4xl">{testimonials[current].avatar}</span>
                <div>
                  <div className="font-bold text-neutral-900 text-base">{testimonials[current].name}</div>
                  <div className="text-sm text-primary-500 font-medium">{testimonials[current].location}</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-100">
              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? 'bg-primary-500 w-8 h-2.5'
                        : 'bg-neutral-200 w-2.5 h-2.5 hover:bg-neutral-300'
                    }`}
                    aria-label={`Testimoni ${i + 1}`}
                  />
                ))}
              </div>
              {/* Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-primary-50 hover:border-primary-300 transition-colors"
                  aria-label="Testimoni sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5 text-neutral-500" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-primary-50 hover:border-primary-300 transition-colors"
                  aria-label="Testimoni selanjutnya"
                >
                  <ChevronRight className="w-5 h-5 text-neutral-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-box text-center bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
              <div className="text-2xl font-extrabold text-primary-600 mb-1">{stat.value}</div>
              <div className="text-xs text-neutral-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
