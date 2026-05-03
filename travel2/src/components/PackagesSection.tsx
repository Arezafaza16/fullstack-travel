import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ArrowRight } from 'lucide-react';
import { BACKEND_API } from '../constant';

gsap.registerPlugin(ScrollTrigger);

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PackagesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('6281234567890');

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(BACKEND_API + '/cards');
        const data = await res.json();
        setPackages(data);
      } catch (err) {
        console.error('Failed to fetch cards:', err);
      }
    };
    fetchPackages();
  }, []);

  // Fetch contact for dynamic WhatsApp number
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch(BACKEND_API + '/contacts');
        const data = await res.json();
        const contact = Array.isArray(data) ? data[0] : data;
        if (contact?.whatsapp) setWhatsappNumber(contact.whatsapp);
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      }
    };
    fetchContact();
  }, []);

  // GSAP scroll animations
  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current || packages.length === 0) return;
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
        cardsRef.current!.children,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [packages]);

  const handleBooking = (pkg: any) => {
    const message = `Halo, saya tertarik dengan paket *${pkg.headerTitle}* (${pkg.duration}) - ${formatRupiah(pkg.price)}. Mohon informasi lebih lanjut.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="paket" ref={sectionRef} className="py-20 sm:py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="section-heading text-center max-w-2xl mx-auto mb-14">
          <div className="section-badge mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            Paket Pilihan
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 mb-4">
            Paket Wisata Rekomendasi
          </h2>
          <p className="text-neutral-500 text-lg">
            Pilihan paket wisata terbaik dengan harga terjangkau dan pelayanan profesional.
          </p>
          <div className="section-divider" />
        </div>

        {/* Cards Grid */}
        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {packages.map((pkg) => (
            <div key={pkg._id} className="card-package group">
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.headerTitle}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Duration Badge — blue */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-600/90 backdrop-blur-sm text-xs font-semibold text-white">
                  <Clock className="w-3.5 h-3.5" />
                  {pkg.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {pkg.headerTitle}
                </h3>
                <p className="text-sm text-neutral-500 mb-4 leading-relaxed line-clamp-2">
                  {pkg.description}
                </p>

                {/* Price — orange */}
                <div className="mb-5 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-accent-600">
                    {formatRupiah(pkg.price)}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">/orang</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <a href={`#paket-${pkg._id}`} className="btn-outline-dark flex-1 text-sm py-2.5">
                    Detail
                  </a>
                  <button
                    onClick={() => handleBooking(pkg)}
                    className="btn-primary flex-1 text-sm py-2.5"
                    id={`book-${pkg._id}`}
                  >
                    Booking
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
