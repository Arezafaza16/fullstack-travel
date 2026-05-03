import { useState, useEffect, useRef, type FormEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, MessageCircle, Phone, MapPin, Mail, Building2 } from 'lucide-react';
import { BACKEND_API } from '../constant';

gsap.registerPlugin(ScrollTrigger);

interface ContactInfo {
  whatsapp: string;
  office: string;
  fullAddress: string;
  phoneNumber: string;
  email: string;
}

export default function ContactFormSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [form, setForm] = useState({ nama: '', whatsapp: '', destinasi: '', pesan: '' });

  // Fetch contacts from API
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch(BACKEND_API + '/contacts');
        const data = await res.json();
        const contact = Array.isArray(data) ? data[0] : data;

        setContactInfo(contact);
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      }
    };
    fetchContact();
  }, []);

  // GSAP scroll animations
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current!.querySelectorAll('.gsap-reveal'),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const getWhatsAppNumber = () => {
    console.log(contactInfo?.whatsapp);
    if (contactInfo?.whatsapp) return contactInfo.whatsapp;
    return '6281234567890';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const message = [
      `Halo, saya *${form.nama}*.`,
      form.destinasi ? `Saya tertarik dengan destinasi: *${form.destinasi}*.` : '',
      form.pesan ? `Pesan: ${form.pesan}` : '',
      `Nomor WA saya: ${form.whatsapp}`,
      '',
      'Mohon informasi lebih lanjut. Terima kasih!',
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const contactItems = [
    {
      icon: Phone,
      label: 'WhatsApp',
      value: contactInfo?.whatsapp || '+62 812-3456-7890',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Building2,
      label: 'Kantor',
      value: contactInfo?.office || 'Jakarta, Indonesia',
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      icon: MapPin,
      label: 'Alamat',
      value: contactInfo?.fullAddress || 'Jl. Sudirman No. 123, Jakarta Pusat',
      iconBg: 'bg-accent-50',
      iconColor: 'text-accent-600',
    },
    {
      icon: Mail,
      label: 'Email',
      value: contactInfo?.email || 'info@traveldash.id',
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
  ];

  return (
    <section id="kontak" ref={sectionRef} className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Info */}
          <div className="gsap-reveal">
            <div className="section-badge mb-4">
              <MessageCircle className="w-3.5 h-3.5" />
              Hubungi Kami
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-700 mb-5">
              Siap Untuk Liburan?
            </h2>
            <p className="text-neutral-500 text-lg leading-relaxed mb-10">
              Kirim pesan kepada kami melalui WhatsApp dan tim kami akan membantu merencanakan liburan impian Anda.
            </p>

            {/* Contact Details */}
            <div className="space-y-4">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-100 hover:border-primary-100 hover:bg-primary-50/30 transition-all">
                  <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400 font-medium mb-0.5">{item.label}</div>
                    <div className="text-neutral-800 font-semibold text-sm">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="gsap-reveal">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-primary-500/[0.07] border border-primary-100/50">
              <h3 className="text-xl font-bold text-neutral-900 mb-1">Kirim Pesan via WhatsApp</h3>
              <p className="text-sm text-neutral-500 mb-7">Isi form berikut dan kami akan segera merespons.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="contact-nama" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="contact-nama"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    required
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-sm"
                  />
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label htmlFor="contact-wa" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="contact-wa"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    required
                    placeholder="08xx-xxxx-xxxx"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-sm"
                  />
                </div>

                {/* Destination */}
                <div>
                  <label htmlFor="contact-dest" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Destinasi Tujuan
                  </label>
                  <select
                    id="contact-dest"
                    value={form.destinasi}
                    onChange={(e) => setForm({ ...form, destinasi: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-sm appearance-none"
                  >
                    <option value="">Pilih destinasi</option>
                    <option value="Bali">Bali</option>
                    <option value="Bromo">Bromo</option>
                    <option value="Lombok">Lombok</option>
                    <option value="Raja Ampat">Raja Ampat</option>
                    <option value="Labuan Bajo">Labuan Bajo</option>
                    <option value="Nusa Penida">Nusa Penida</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-pesan" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Pesan (Opsional)
                  </label>
                  <textarea
                    id="contact-pesan"
                    value={form.pesan}
                    onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                    rows={3}
                    placeholder="Tulis pesan atau pertanyaan Anda..."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-sm resize-none"
                  />
                </div>

                {/* Submit — orange CTA */}
                <button
                  type="submit"
                  id="contact-submit"
                  className="btn-whatsapp w-full text-base"
                >
                  <Send className="w-5 h-5" />
                  Kirim via WhatsApp
                </button>

                <p className="text-xs text-neutral-400 text-center">
                  Pesan akan dikirim langsung ke WhatsApp kami
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
