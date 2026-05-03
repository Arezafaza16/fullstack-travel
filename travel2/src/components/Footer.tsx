import { useEffect, useState } from 'react';
import { Compass, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { BACKEND_API } from '../constant';

interface ContactInfo {
  whatsapp: string;
  phoneNumber: string;
  fullAddress: string;
  email: string;
}

export default function Footer() {
  const [contact, setContact] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch(BACKEND_API + '/contacts');
        const data = await res.json();
        setContact(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error('Failed to fetch contacts for footer:', err);
      }
    };
    fetchContact();
  }, []);

  const phone = contact?.phoneNumber || contact?.whatsapp || '+62 812-3456-7890';
  const address = contact?.fullAddress || 'Jl. Sudirman No. 123, Jakarta Pusat, Indonesia';
  const email = contact?.email || 'info@traveldash.id';

  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#beranda" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-lg shadow-accent-500/30">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">TravelDash</span>
            </a>
            <p className="text-primary-300/60 text-sm leading-relaxed mb-6">
              Agen travel terpercaya yang menghadirkan pengalaman wisata terbaik di Indonesia sejak 2015.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/[0.07] flex items-center justify-center hover:bg-white/[0.14] transition-colors" aria-label="Website">
                <Globe className="w-4 h-4 text-primary-300/70" />
              </a>
              <a href={`mailto:${email}`} className="w-10 h-10 rounded-full bg-white/[0.07] flex items-center justify-center hover:bg-white/[0.14] transition-colors" aria-label="Email">
                <Mail className="w-4 h-4 text-primary-300/70" />
              </a>
              <a href={`tel:${phone}`} className="w-10 h-10 rounded-full bg-white/[0.07] flex items-center justify-center hover:bg-white/[0.14] transition-colors" aria-label="Telepon">
                <Phone className="w-4 h-4 text-primary-300/70" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-5 text-white/90">Navigasi</h4>
            <ul className="space-y-3">
              {[
                { label: 'Beranda', href: '#beranda' },
                { label: 'Paket Wisata', href: '#paket' },
                { label: 'Destinasi', href: '#destinasi' },
                { label: 'Testimoni', href: '#testimoni' },
                { label: 'Hubungi Kami', href: '#kontak' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-primary-300/55 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold text-sm mb-5 text-white/90">Destinasi</h4>
            <ul className="space-y-3">
              {['Bali', 'Bromo', 'Lombok', 'Raja Ampat', 'Labuan Bajo', 'Nusa Penida'].map((dest) => (
                <li key={dest}>
                  <a href="#paket" className="text-sm text-primary-300/55 hover:text-white transition-colors">
                    {dest}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info — dynamic */}
          <div>
            <h4 className="font-semibold text-sm mb-5 text-white/90">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent-400 mt-0.5 shrink-0" />
                <span className="text-sm text-primary-300/60">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent-400 shrink-0" />
                <span className="text-sm text-primary-300/60">{phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent-400 shrink-0" />
                <span className="text-sm text-primary-300/60">{email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-300/35">
            © {new Date().getFullYear()} TravelDash Travel. Hak cipta dilindungi.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-primary-300/35 hover:text-white/70 transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="text-xs text-primary-300/35 hover:text-white/70 transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
