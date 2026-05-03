import { useState, useEffect, useRef, useCallback } from "react";
import { Check, Loader2, Image } from "lucide-react";
import { Input } from "../ui/Input";
import { ImageUpload } from "../ui/ImageUpload";
import { api } from "../../lib/api";
import { toast } from "../../utils/toast";

interface BannerForm {
  order: number;
  header: string;
  description: string;
  location: string;
  imageUrl: string | null;
}

type SaveState = "idle" | "saving" | "saved" | "clean";
const TOTAL_BANNERS = 3;

const emptyForm = (order: number): BannerForm => ({ order, header: "", description: "", location: "", imageUrl: null });

function formFromApi(item: any): BannerForm {
  return {
    order: Number(item.order),
    header: item.headerTitle || item.header || "",
    description: item.description || "",
    location: item.location || "",
    imageUrl: item.imageUrl || null,
  };
}

function buildSlots(apiData: any[]): BannerForm[] {
  const slots = Array.from({ length: TOTAL_BANNERS }, (_, i) => emptyForm(i + 1));
  for (const item of apiData) {
    const order = Number(item.order);
    if (order >= 1 && order <= TOTAL_BANNERS) slots[order - 1] = formFromApi(item);
  }
  return slots;
}

export function HeroSectionEditor() {
  const [banners, setBanners] = useState<BannerForm[]>(() =>
    Array.from({ length: TOTAL_BANNERS }, (_, i) => emptyForm(i + 1))
  );
  const dbIdMap = useRef<Record<number, string | null>>({ 1: null, 2: null, 3: null });
  const savedForms = useRef<Record<number, BannerForm>>({ 1: emptyForm(1), 2: emptyForm(2), 3: emptyForm(3) });
  const [saveStates, setSaveStates] = useState<Record<number, SaveState>>({ 1: "clean", 2: "clean", 3: "clean" });
  const initialized = useRef(false);

  useEffect(() => {
    api.get<any[]>("/banners")
      .then((data) => {
        if (initialized.current) return;
        initialized.current = true;
        if (!Array.isArray(data) || data.length === 0) return;
        const slots = buildSlots(data);
        setBanners(slots);
        for (const item of data) {
          const order = Number(item.order);
          if (order >= 1 && order <= TOTAL_BANNERS) {
            dbIdMap.current[order] = item._id ? String(item._id) : null;
            savedForms.current[order] = formFromApi(item);
          }
        }
        setSaveStates({ 1: "clean", 2: "clean", 3: "clean" });
      })
      .catch(() => { initialized.current = true; });
  }, []);

  const syncFromServer = async () => {
    try {
      const data = await api.get<any[]>("/banners");
      if (!Array.isArray(data)) return;
      for (const item of data) {
        const order = Number(item.order);
        if (order >= 1 && order <= TOTAL_BANNERS && item._id) dbIdMap.current[order] = String(item._id);
      }
    } catch {}
  };

  const setSaveState = useCallback((order: number, state: SaveState) => {
    setSaveStates((prev) => ({ ...prev, [order]: state }));
  }, []);

  const handleSave = async (order: number) => {
    setSaveState(order, "saving");
    const banner = banners.find((b) => b.order === order);
    if (!banner) return;
    const payload = { title: `banner ${order}`, imageUrl: banner.imageUrl, headerTitle: banner.header, location: banner.location, description: banner.description, order };
    try {
      const existingId = dbIdMap.current[order];
      if (existingId) {
        await api.put(`/banners/${existingId}`, payload);
      } else {
        const body = await api.post("/banners", payload);
        const created = body?.data ?? body;
        const newId = created?._id || created?.id;
        if (newId) dbIdMap.current[order] = String(newId);
      }
      await syncFromServer();
      savedForms.current[order] = { ...banner };
      setSaveState(order, "saved");
      toast(`Banner ${order} berhasil disimpan!`, "success");
      setTimeout(() => setSaveState(order, "clean"), 1500);
    } catch (err: any) {
      toast(err.message || "Gagal menyimpan banner", "error");
      setSaveState(order, "idle");
    }
  };

  const updateBanner = useCallback((order: number, field: keyof Omit<BannerForm, "order">, value: string | null) => {
    setBanners((prev) => {
      let changed = false;
      const next = prev.map((b) => {
        if (b.order !== order) return b;
        if ((b[field] as any) === value) return b;
        changed = true;
        return { ...b, [field]: value };
      });
      return changed ? next : prev;
    });
    setSaveStates((prev) => ({ ...prev, [order]: "idle" }));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Image className="w-4 h-4 text-blue-500" />
          Hero Banners
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Edit ketiga banner utama di halaman landing page.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {banners.map((banner) => {
          const state: SaveState = saveStates[banner.order] ?? "idle";
          const isSaving = state === "saving";
          const isSaved = state === "saved";
          const isClean = state === "clean";
          const isDisabled = isSaving || isSaved || isClean;

          return (
            <div key={banner.order} className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-md flex items-center justify-center">
                    {banner.order}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">Banner {banner.order}</span>
                </div>
                {isClean && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Tersimpan</span>}
                {state === "idle" && <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Belum disimpan</span>}
              </div>

              {/* Fields */}
              <div className="p-5 space-y-4 flex-1">
                <ImageUpload value={banner.imageUrl} onChange={(url) => updateBanner(banner.order, "imageUrl", url)} />
                <Input
                  label="Header Title"
                  value={banner.header}
                  onChange={(e) => updateBanner(banner.order, "header", e.target.value)}
                  placeholder="Judul banner"
                />
                <Input
                  label="Lokasi"
                  value={banner.location}
                  onChange={(e) => updateBanner(banner.order, "location", e.target.value)}
                  placeholder="Nama lokasi tujuan"
                />
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Deskripsi</label>
                  <textarea
                    rows={3}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    value={banner.description}
                    onChange={(e) => updateBanner(banner.order, "description", e.target.value)}
                    placeholder="Deskripsi singkat banner"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 pt-0">
                <button
                  disabled={isDisabled}
                  onClick={() => handleSave(banner.order)}
                  className={[
                    "w-full h-9 px-4 inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-150",
                    "disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500",
                    isSaved ? "bg-emerald-500 text-white" :
                    isClean ? "bg-slate-100 text-slate-400 cursor-default" :
                    "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
                  ].join(" ")}
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSaved && <Check className="h-4 w-4" />}
                  {isSaving ? "Menyimpan…" : isSaved ? "Tersimpan!" : isClean ? "Tidak Ada Perubahan" : "Simpan Banner"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}