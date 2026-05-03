import { useState, useEffect } from "react";
import { Input } from "../ui/Input";
import { Phone, Mail, MapPin, MessageCircle, Building2, Loader2, PlusCircle, Save } from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "../../utils/toast";

interface ContactInfo {
  _id?: string;
  __v?: number;
  whatsapp: string;
  office: string;
  fullAddress: string;
  phoneNumber: string;
  email: string;
}

const emptyContact = (): ContactInfo => ({ whatsapp: "", office: "", fullAddress: "", phoneNumber: "", email: "" });

/** Strip leading 0 and replace with 62 (Indonesian country code) */
function normalizePhone(val: string): string {
  const digits = val.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return digits;
}

/** Allow only digits in the input */
function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

const fields = [
  { key: "whatsapp", label: "Nomor WhatsApp", type: "phone", icon: MessageCircle, placeholder: "6281234567890", hint: "Otomatis diubah ke format 62 saat disimpan" },
  { key: "phoneNumber", label: "Nomor Telepon Kantor", type: "phone", icon: Phone, placeholder: "6221123456" },
  { key: "email", label: "Alamat Email", type: "email", icon: Mail, placeholder: "info@travel.com" },
  { key: "office", label: "Nama Kantor", type: "text", icon: Building2, placeholder: "TravelCo Indonesia" },
  { key: "fullAddress", label: "Alamat Lengkap", type: "text", icon: MapPin, placeholder: "Jl. Contoh No. 123, Jakarta Selatan" },
] as const;

export function ContactEditor() {
  const [info, setInfo] = useState<ContactInfo>(emptyContact());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    api.get<ContactInfo[]>("/contacts")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const d = data[0];
          // Store phone numbers as strings in form state
          setInfo({
            ...d,
            whatsapp: String(d.whatsapp ?? ""),
            phoneNumber: String(d.phoneNumber ?? ""),
          });
          setIsNew(false);
        } else {
          setIsNew(true);
        }
      })
      .catch(() => toast("Gagal memuat kontak", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Build a clean payload — only the DTO fields, no _id/__v
      const payload = {
        whatsapp: Number(normalizePhone(info.whatsapp)),
        phoneNumber: Number(normalizePhone(info.phoneNumber)),
        email: info.email,
        office: info.office,
        fullAddress: info.fullAddress,
      };

      if (!isNew && info._id) {
        const body = await api.put(`/contacts/${info._id}`, payload);
        const updated: ContactInfo = body?.data ?? body;
        setInfo({
          ...updated,
          whatsapp: String(updated.whatsapp ?? payload.whatsapp),
          phoneNumber: String(updated.phoneNumber ?? payload.phoneNumber),
        });
        toast("Informasi kontak berhasil diperbarui!", "success");
      } else {
        const body = await api.post("/contacts", payload);
        const created: ContactInfo = body?.data ?? body;
        setInfo({
          ...created,
          whatsapp: String(created.whatsapp ?? payload.whatsapp),
          phoneNumber: String(created.phoneNumber ?? payload.phoneNumber),
        });
        setIsNew(false);
        toast("Informasi kontak berhasil disimpan!", "success");
      }
    } catch (err: any) {
      toast(err.message || "Gagal menyimpan kontak", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    // For phone fields, strip non-digits as user types
    if (key === "whatsapp" || key === "phoneNumber") {
      setInfo({ ...info, [key]: onlyDigits(value) });
    } else {
      setInfo({ ...info, [key]: value });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-500" />
          Informasi Kontak
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Perbarui detail kontak yang ditampilkan di website.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          {isNew && (
            <div className="mx-4 sm:mx-6 mt-5 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm">
              <PlusCircle className="w-4 h-4 flex-shrink-0" />
              Belum ada data kontak. Isi form di bawah untuk menambahkan.
            </div>
          )}

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.map(({ key, label, type, icon: Icon, placeholder, hint }) => (
                <div key={key} className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    {label}
                  </label>
                  <input
                    id={`contact-${key}`}
                    type={type === "phone" ? "tel" : type}
                    inputMode={type === "phone" ? "numeric" : undefined}
                    pattern={type === "phone" ? "[0-9]*" : undefined}
                    value={String((info as any)[key] ?? "")}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {hint && <p className="text-xs text-slate-400">{hint}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
            <button
              id="contact-save-btn"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg transition-colors shadow-sm"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Menyimpan..." : isNew ? "Simpan Kontak" : "Perbarui Kontak"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
