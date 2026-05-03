import { useEffect, useRef } from "react";
import { Upload, X, RefreshCw } from "lucide-react";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  /** compact: renders a small square thumbnail (for use inside list edit forms) */
  compact?: boolean;
}

export function ImageUpload({ value, onChange, compact = false }: ImageUploadProps) {
  const cloudinaryRef = useRef<any>(undefined);
  const widgetRef = useRef<any>(undefined);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    // @ts-ignore
    cloudinaryRef.current = window.cloudinary;
    if (cloudinaryRef.current) {
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          clientAllowedFormats: ["image", "webp", "png", "jpg", "jpeg"],
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            onChangeRef.current(result.info.secure_url);
          }
        }
      );
    }
  }, []);

  // ── Compact square (used inside list edit panels) ──────────────────────────
  if (compact) {
    return (
      <div
        onClick={() => widgetRef.current?.open()}
        className="w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center group relative"
      >
        {value ? (
          <>
            <img src={value} alt="Upload" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 pointer-events-none">
            <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-blue-500 transition-colors text-center leading-tight">Upload<br />Gambar</span>
          </div>
        )}
      </div>
    );
  }

  // ── Full width (default) ───────────────────────────────────────────────────
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-600 mb-1.5">Gambar</label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
          <img src={value} alt="Uploaded" className="w-full h-44 object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => widgetRef.current?.open()}
              className="inline-flex items-center gap-1.5 h-8 px-3 bg-white text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Ganti
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1.5 h-8 px-3 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors shadow"
            >
              <X className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => widgetRef.current?.open()}
          className="flex flex-col items-center justify-center h-44 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 gap-2 cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
            <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">Klik untuk upload</p>
            <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WebP via Cloudinary</p>
          </div>
        </div>
      )}
    </div>
  );
}
