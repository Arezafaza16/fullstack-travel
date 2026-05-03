import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, ShieldCheck, Headphones, Wallet } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const usps = [
  {
    icon: Award,
    title: 'Pengalaman 10+ Tahun',
    desc: 'Berpengalaman menangani ribuan wisatawan lokal dan internasional dengan pelayanan terbaik.',
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
    hoverBorder: 'hover:border-primary-200',
  },
  {
    icon: Wallet,
    title: 'Harga Terjangkau',
    desc: 'Paket wisata dengan harga kompetitif tanpa mengurangi kualitas pengalaman liburan Anda.',
    iconBg: 'bg-accent-50',
    iconColor: 'text-accent-600',
    hoverBorder: 'hover:border-accent-200',
  },
  {
    icon: ShieldCheck,
    title: 'Garansi Keamanan',
    desc: 'Jaminan keamanan dan kenyamanan selama perjalanan dengan asuransi perjalanan lengkap.',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    hoverBorder: 'hover:border-emerald-200',
  },
  {
    icon: Headphones,
    title: 'Layanan 24/7',
    desc: 'Tim customer service siap membantu Anda kapan saja sebelum, selama, dan setelah perjalanan.',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    hoverBorder: 'hover:border-violet-200',
  },
];

export default function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
      const cards = sectionRef.current!.querySelectorAll('.usp-card');
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: cards[0], start: 'top 85%', once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="section-heading text-center max-w-2xl mx-auto mb-14">
          <div className="section-badge mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            Keunggulan Kami
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 mb-4">
            Kenapa Pilih Kami?
          </h2>
          <p className="text-neutral-500 text-lg">
            Kami berkomitmen memberikan pengalaman wisata terbaik dengan layanan profesional dan terpercaya.
          </p>
          <div className="section-divider" />
        </div>

        {/* USP Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {usps.map((usp) => (
            <div
              key={usp.title}
              className={`usp-card group bg-white rounded-2xl p-7 border border-neutral-100 ${usp.hoverBorder} hover:shadow-xl hover:shadow-primary-500/[0.07] transition-all duration-300 hover:-translate-y-1.5 text-center`}
            >
              <div className={`w-16 h-16 rounded-2xl ${usp.iconBg} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <usp.icon className={`w-7 h-7 ${usp.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">{usp.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{usp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
