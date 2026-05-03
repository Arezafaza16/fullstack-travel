import { HeroSectionEditor } from "../components/content/HeroSectionEditor";
import { CardEditor } from "../components/content/CardEditor";
import { DestinationEditor } from "../components/content/DestinationEditor";
import { ContactEditor } from "../components/content/ContactEditor";

export function ContentPage() {
  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8">
      {/* Page heading */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Manajemen Konten</h2>
        <p className="text-sm text-slate-500 mt-1">Kelola seluruh konten yang ditampilkan di halaman utama website.</p>
      </div>

      {/* Sections */}
      <section>
        <HeroSectionEditor />
      </section>

      <div className="border-t border-slate-200" />

      <section>
        <CardEditor />
      </section>

      <div className="border-t border-slate-200" />

      <section>
        <DestinationEditor />
      </section>

      <div className="border-t border-slate-200" />

      <section>
        <ContactEditor />
      </section>
    </div>
  );
}
