import { useState, useEffect } from "react";
import { MapPin, PlusCircle, Pencil, Trash2, Loader2, X, Check, ImageIcon } from "lucide-react";
import { Input } from "../ui/Input";
import { api } from "../../lib/api";
import { toast } from "../../utils/toast";
import { ImageUpload } from "../ui/ImageUpload";

interface Destination {
  _id: string;
  headerTitle: string;
  imageUrl: string;
  description: string;
}

const emptyDest = (): Omit<Destination, "_id"> => ({
  headerTitle: "",
  imageUrl: "",
  description: "",
});

export function DestinationEditor() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(emptyDest());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    api.get<Destination[]>("/destinations")
      .then(setDestinations)
      .catch(() => toast("Gagal memuat destinasi", "error"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setForm(emptyDest());
    setEditingId("new");
  };

  const openEdit = (dest: Destination) => {
    setForm({ headerTitle: dest.headerTitle, imageUrl: dest.imageUrl, description: dest.description });
    setEditingId(dest._id);
  };

  const closeEdit = () => {
    setEditingId(null);
    setForm(emptyDest());
  };

  const handleSave = async () => {
    if (!form.headerTitle.trim()) {
      toast("Judul wajib diisi", "error");
      return;
    }
    setSaving(true);
    try {
      if (editingId === "new") {
        const body = await api.post("/destinations", form);
        const created: Destination = body?.data ?? body;
        setDestinations((prev) => [...prev, created]);
        toast("Destinasi berhasil ditambahkan!", "success");
      } else {
        const body = await api.put(`/destinations/${editingId}`, form);
        const updated: Destination = body?.data ?? body;
        setDestinations((prev) =>
          prev.map((d) => (d._id === editingId ? { ...d, ...form, ...(updated._id ? updated : {}) } : d))
        );
        toast("Destinasi berhasil diperbarui!", "success");
      }
      closeEdit();
    } catch (err: any) {
      toast(err.message || "Gagal menyimpan", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus destinasi ini?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/destinations/${id}`);
      setDestinations((prev) => prev.filter((d) => d._id !== id));
      if (editingId === id) closeEdit();
      toast("Destinasi berhasil dihapus", "success");
    } catch (err: any) {
      toast(err.message || "Gagal menghapus", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
            Destinasi Populer
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Kelola destinasi unggulan.</p>
        </div>
        {editingId !== "new" && (
          <button
            id="dest-add-btn"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 h-9 px-3 sm:px-4 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Destinasi</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Panel */}
      {editingId !== null && (
        <div className="bg-white border border-blue-200 rounded-2xl shadow-sm animate-fade-in">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100">
            <h4 className="text-sm font-semibold text-slate-900">
              {editingId === "new" ? "Tambah Destinasi Baru" : "Edit Destinasi"}
            </h4>
            <button onClick={closeEdit} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-5">
              {/* Image upload – compact square */}
              <div>
                <ImageUpload
                  value={form.imageUrl || null}
                  onChange={(url) => setForm((f) => ({ ...f, imageUrl: url || "" }))}
                  compact
                />
              </div>
              {/* Title + Description stacked */}
              <div className="space-y-4">
                <Input
                  label="Judul Destinasi"
                  value={form.headerTitle}
                  onChange={(e) => setForm((f) => ({ ...f, headerTitle: e.target.value }))}
                  placeholder="Contoh: Raja Ampat, Papua"
                />
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Deskripsi</label>
                  <textarea
                    rows={3}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Deskripsikan keindahan destinasi ini..."
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? "Menyimpan..." : editingId === "new" ? "Tambahkan" : "Simpan"}
            </button>
            <button
              onClick={closeEdit}
              className="h-9 px-4 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Destination list */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <MapPin className="w-10 h-10 mb-3 text-slate-200" />
            <p className="text-sm font-medium">Belum ada destinasi</p>
            <p className="text-xs mt-1">Klik "Tambah Destinasi" untuk menambahkan</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {destinations.map((dest, i) => {
              const isEditing = editingId === dest._id;
              return (
                <li key={dest._id}>
                  <div className={`flex items-center gap-3 px-4 sm:px-5 py-3.5 transition-colors ${isEditing ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                    {/* Thumbnail */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      {dest.imageUrl ? (
                        <img src={dest.imageUrl} alt={dest.headerTitle} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{dest.headerTitle || "—"}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{dest.description || "Tidak ada deskripsi"}</p>
                    </div>

                    {/* Number badge — hidden on mobile */}
                    <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-100 rounded-full hidden sm:block flex-shrink-0">
                      #{i + 1}
                    </span>

                    {/* Actions — icon-only mobile, icon+text desktop */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => isEditing ? closeEdit() : openEdit(dest)}
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
                        onClick={() => handleDelete(dest._id)}
                        disabled={deletingId === dest._id}
                        title="Hapus"
                        className="inline-flex items-center justify-center gap-1 h-8 w-8 sm:w-auto sm:px-3 text-xs font-medium rounded-lg border border-slate-200 bg-white text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
                      >
                        {deletingId === dest._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">Hapus</span>
                      </button>
                    </div>
                  </div>
                  {/* Inline edit panel below editing row */}
                  {isEditing && (
                    <div className="px-4 sm:px-5 py-4 bg-blue-50/60 border-t border-blue-100" />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
