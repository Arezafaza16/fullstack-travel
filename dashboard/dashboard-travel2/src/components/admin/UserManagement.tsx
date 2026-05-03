import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Trash2, UserPlus, Shield, Loader2, Eye, EyeOff, Crown, CheckCircle } from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "../../utils/toast";
import { useAuth } from "../../contexts/AuthContext";

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin';
  phoneNumber?: number;
}

const roleBadge: Record<string, string> = {
  owner: 'bg-amber-100 text-amber-800 border border-amber-200',
  admin: 'bg-blue-100 text-blue-800 border border-blue-200',
};

export function UserManagement() {
  const { user: currentUser, isOwner } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'admin' as 'owner' | 'admin',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.get<User[]>('/users')
      .then(setUsers)
      .catch((err) => toast(err.message || 'Gagal memuat pengguna', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.phoneNumber) {
      toast('Semua kolom wajib diisi', 'error');
      return;
    }
    if (newUser.password.length < 6) {
      toast('Password minimal 6 karakter', 'error');
      return;
    }
    setAdding(true);
    try {
      const body = await api.post('/users', {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        phoneNumber: Number(newUser.phoneNumber),
        role: newUser.role,
      });
      const created: User = body?.data ?? body;
      setUsers(prev => [...prev, created]);
      setNewUser({ name: '', email: '', password: '', phoneNumber: '', role: 'admin' });
      setShowAddForm(false);
      toast('Pengguna berhasil ditambahkan!', 'success');
    } catch (err: any) {
      toast(err.message || 'Gagal menambahkan pengguna', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      toast('Anda tidak dapat menghapus akun sendiri', 'error');
      return;
    }
    if (!confirm('Yakin ingin menghapus pengguna ini?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast('Pengguna berhasil dihapus', 'success');
    } catch (err: any) {
      toast(err.message || 'Gagal menghapus pengguna', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRoleChange = async (id: string, newRole: 'owner' | 'admin') => {
    setUpdatingRoleId(id);
    try {
      await api.put(`/users/${id}`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
      toast('Role berhasil diubah!', 'success');
    } catch (err: any) {
      toast(err.message || 'Gagal mengubah role', 'error');
    } finally {
      setUpdatingRoleId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Manajemen Pengguna</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {isOwner
              ? 'Sebagai Owner, Anda dapat menambah, mengubah role, dan menghapus pengguna.'
              : 'Anda dapat melihat daftar pengguna sistem.'}
          </p>
        </div>
        {isOwner && (
          <Button id="user-add-toggle" onClick={() => setShowAddForm(s => !s)}>
            <UserPlus className="w-4 h-4 mr-2" />
            {showAddForm ? 'Batal' : 'Tambah Pengguna'}
          </Button>
        )}
      </div>

      {/* Add User Form (Owner only) */}
      {isOwner && showAddForm && (
        <Card className="bg-blue-50/40 border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Tambah Pengguna Baru
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap"
              placeholder="John Doe"
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            />
            <Input
              label="Nomor Telepon"
              type="tel"
              placeholder="08123456789"
              value={newUser.phoneNumber}
              onChange={e => setNewUser({ ...newUser, phoneNumber: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Role</label>
              <select
                id="user-role-select"
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value as 'owner' | 'admin' })}
              >
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  id="new-user-password"
                  type={showPassword ? 'text' : 'password'}
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button id="user-add-btn" onClick={handleAddUser} disabled={adding}>
              {adding ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Menambahkan...</> : 'Buat Akun Pengguna'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-slate-400" /> Pengguna Sistem Aktif
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3.5 whitespace-nowrap">Nama</th>
                    <th className="px-4 md:px-6 py-3.5 whitespace-nowrap hidden sm:table-cell">Email</th>
                    <th className="px-4 md:px-6 py-3.5 whitespace-nowrap">Role</th>
                    {isOwner && <th className="px-4 md:px-6 py-3.5 text-right whitespace-nowrap">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => {
                    const isSelf = user._id === currentUser?.id;
                    return (
                      <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 truncate">
                                {user.name}
                                {isSelf && <span className="ml-1.5 text-xs text-slate-400">(Anda)</span>}
                              </p>
                              <p className="text-xs text-slate-500 sm:hidden truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-slate-500 hidden sm:table-cell">{user.email}</td>
                        <td className="px-4 md:px-6 py-4">
                          {isOwner && !isSelf ? (
                            <div className="flex items-center gap-2">
                              {updatingRoleId === user._id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                              ) : (
                                <select
                                  value={user.role}
                                  onChange={e => handleRoleChange(user._id, e.target.value as 'owner' | 'admin')}
                                  className="text-xs rounded-lg border border-slate-200 px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                                >
                                  <option value="admin">Admin</option>
                                  <option value="owner">Owner</option>
                                </select>
                              )}
                            </div>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleBadge[user.role] ?? 'bg-slate-100 text-slate-700'}`}>
                              {user.role === 'owner' && <Crown className="w-3 h-3" />}
                              {user.role}
                              {isSelf && <CheckCircle className="w-3 h-3 ml-0.5" />}
                            </span>
                          )}
                        </td>
                        {isOwner && (
                          <td className="px-4 md:px-6 py-4 text-right">
                            {!isSelf && (
                              <button
                                id={`delete-user-${user._id}`}
                                onClick={() => handleDelete(user._id)}
                                disabled={deletingId === user._id}
                                className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {deletingId === user._id
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : <Trash2 className="w-3.5 h-3.5" />}
                                Hapus
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                        Tidak ada pengguna ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
