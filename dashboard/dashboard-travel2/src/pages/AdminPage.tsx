import { UserManagement } from "../components/admin/UserManagement";

export function AdminPage() {
  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Administrasi</h2>
        <p className="text-slate-500 mt-1">Kelola akun pengguna sistem dashboard.</p>
      </div>

      <section>
        <UserManagement />
      </section>
    </div>
  );
}
