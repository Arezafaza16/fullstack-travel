import { useState, useEffect } from "react";
import { CreditCard, PlusCircle, Pencil, Trash2, Loader2, X, Check, ImageIcon, Clock } from "lucide-react";
import { Input } from "../ui/Input";
import { api } from "../../lib/api";
import { toast } from "../../utils/toast";
import { ImageUpload } from "../ui/ImageUpload";

interface TravelCard {
  _id: string;
  headerTitle: string;
  imageUrl: string;
  duration: string;
  price: number;
  description: string;
}

const emptyForm = () => ({
  headerTitle: "",
  imageUrl: "",
  duration: "",
  price: "" as string | number,
  description: "",
});

export function CardEditor() {
  const [cards, setCards] = useState<TravelCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    api.get<TravelCard[]>("/cards")
      .then(setCards)
      .catch(() => toast("Gagal memuat data kartu", "error"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setForm(emptyForm());
    setEditingId("new");
  };

  const openEdit = (card: TravelCard) => {
    setForm({
      headerTitle: card.headerTitle,
      imageUrl: card.imageUrl,
      duration: card.duration,
      price: card.price,
      description: card.description,
    });
    setEditingId(card._id);
  };

  const closeEdit = () => {
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleSave = async () => {
    if (!form.headerTitle.trim()) {
      toast("Judul wajib diisi", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId === "new") {
        const body = await api.post("/cards", payload);
        const created: TravelCard = body?.data ?? body;
        setCards((prev) => [...prev, created]);
        toast("Kartu berhasil ditambahkan!", "success");
      } else {
        const body = await api.put(`/cards/${editingId}`, payload);
        const updated: TravelCard = body?.data ?? body;
        setCards((prev) =>
          prev.map((c) => (c._id === editingId ? { ...c, ...payload, ...(updated._id ? updated : {}) } : c))
        );
        toast("Kartu berhasil diperbarui!", "success");
      }
      closeEdit();
    } catch (err: any) {
      toast(err.message || "Gagal menyimpan", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus paket wisata ini?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/cards/${id}`);
      setCards((prev) => prev.filter((c) => c._id !== id));
      if (editingId === id) closeEdit();
      toast("Kartu berhasil dihapus", "success");
    } catch (err: any) {
      toast(err.message || "Gagal menghapus", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Edit / Add Form ─────────────────────────────────────────────
  const FormPanel = () => (
    <div className="bg-white border border-blue-200 rounded-2xl shadow-sm animate-fade-in">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100">
        <h4 className="text-sm font-semibold text-slate-900">
          {editingId === "new" ? "Tambah Paket Baru" : "Edit Paket Wisata"}
        </h4>
        <button onClick={closeEdit} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-5">
          <div>
            <ImageUpload value={form.imageUrl || null} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url || "" }))} compact />
            <p className="text-xs text-slate-400 mt-2 text-center leading-tight">Foto paket</p>
          </div>
          <div className="space-y-4">
            <Input label="Nama Paket" value={form.headerTitle} onChange={(e) => setForm((f) => ({ ...f, headerTitle: e.target.value }))} placeholder="Contoh: Bali Honeymoon Package" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Durasi" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="3 Hari 2 Malam" />
              <Input label="Harga (Rp)" type="number" value={String(form.price)} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="1500000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Deskripsi</label>
              <textarea rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Paket perjalanan terbaik untuk..." />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {saving ? "Menyimpan..." : editingId === "new" ? "Tambahkan" : "Simpan"}
        </button>
        <button onClick={closeEdit} className="h-9 px-4 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors">
          Batal
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-500 flex-shrink-0" />
            Paket Wisata
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Tambah atau kelola paket perjalanan.</p>
        </div>
        {editingId !== "new" && (
          <button
            id="card-add-btn"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 h-9 px-3 sm:px-4 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Paket</span>
          </button>
        )}
      </div>

      {/* Add form */}
      {editingId === "new" && <FormPanel />}

      {/* Card list */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-16 text-slate-400">
          <CreditCard className="w-10 h-10 mb-3 text-slate-200" />
          <p className="text-sm font-medium">Belum ada paket wisata</p>
          <p className="text-xs mt-1">Klik tombol di atas untuk memulai</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {cards.map((card) => {
              const isEditing = editingId === card._id;
              return (
                <li key={card._id + 1}>
                  {/* Row */}
                  <div className={`flex items-center gap-3 px-4 sm:px-5 py-3.5 transition-colors ${isEditing ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                    {/* Thumbnail */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      {card.imageUrl
                        ? <img src={card.imageUrl} alt={card.headerTitle} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-slate-300" /></div>}
                    </div>

                    {/* Info — stacks price under name on mobile */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{card.headerTitle}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs font-semibold text-blue-600">
                          Rp {Number(card.price).toLocaleString("id-ID")}
                        </span>
                        {card.duration && (
                          <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            {card.duration}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions – icon-only on mobile, icon+text on desktop */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => isEditing ? closeEdit() : openEdit(card)}
                        title="Edit"
                        className={`inline-flex items-center justify-center gap-1 h-8 w-8 sm:w-auto sm:px-3 text-xs font-medium rounded-lg border transition-colors ${
                          isEditing
                            ? "border-blue-200 bg-blue-100 text-blue-600"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isEditing ? "Editing" : "Edit"}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(card._id)}
                        disabled={deletingId === card._id}
                        title="Hapus"
                        className="inline-flex items-center justify-center gap-1 h-8 w-8 sm:w-auto sm:px-3 text-xs font-medium rounded-lg border border-slate-200 bg-white text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
                      >
                        {deletingId === card._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">Hapus</span>
                      </button>
                    </div>
                  </div>

                  {/* Inline edit panel */}
                  {isEditing && (
                    <div className="px-4 sm:px-5 py-4 bg-blue-50/60 border-t border-blue-100">
                      <FormPanel />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
