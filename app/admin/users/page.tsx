'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, X, Trash2, RotateCcw } from 'lucide-react';
import { useAppDispatch } from '@/lib/store/hooks';
import { setGlobalLoading } from '@/lib/store/uiSlice';
import Spinner from '@/components/Spinner';

interface UserWithTags {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  tags: { id: string; name: string; color: string }[];
}

type Tab = 'active' | 'deleted';

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<UserWithTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('active');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [tagFilter, setTagFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchUsers = async () => {
    dispatch(setGlobalLoading(true));
    const res = await fetch('/api/users');
    if (res.ok) setUsers(await res.json());
    setLoading(false);
    dispatch(setGlobalLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowCreate(false);
      setForm({ name: '', email: '', phone: '', password: '' });
      fetchUsers();
    }
  };

  const handleToggleActive = async (user: UserWithTags) => {
    await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    fetchUsers();
  };

  const handleDelete = async (user: UserWithTags) => {
    await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: false }),
    });
    setDeleteConfirm(null);
    fetchUsers();
  };

  const handleRestore = async (user: UserWithTags) => {
    await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: true }),
    });
    fetchUsers();
  };

  const activeUsers = users.filter(u => u.isActive);
  const deletedUsers = users.filter(u => !u.isActive);
  const displayed = tab === 'active' ? activeUsers : deletedUsers;
  const filtered = displayed.filter(u => {
    if (!tagFilter) return true;
    return u.tags.some(t => t.name.toLowerCase().includes(tagFilter.toLowerCase()));
  });

  if (loading) return <div className="p-8 flex items-center gap-2 text-stone-500"><Spinner /><span>Loading employees...</span></div>;

  const Tabs = () => (
    <div className="flex gap-1 bg-stone-100 border border-stone-200 rounded-lg p-1 w-fit text-xs">
      <button onClick={() => setTab('active')} className={`px-4 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all ${tab === 'active' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}>
        Active ({activeUsers.length})
      </button>
      <button onClick={() => setTab('deleted')} className={`px-4 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all ${tab === 'deleted' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}>
        Deleted ({deletedUsers.length})
      </button>
    </div>
  );

  return (
    <div className="space-y-6 font-sans text-stone-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold">Employees</h1>
          <p className="text-xs text-stone-500 mt-1">{users.length} total users</p>
        </div>
        {tab === 'active' && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-editorial-wine text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-stone-900 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Employee
          </button>
        )}
      </div>

      <Tabs />

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-widest text-[9px] border-b border-stone-200">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Tags</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((u) => (
                <tr key={u.id} className={`hover:bg-stone-50/70 transition-colors ${!u.isActive ? 'opacity-60' : ''}`}>
                  <td className="px-5 py-4 font-bold text-stone-800">{u.name}</td>
                  <td className="px-5 py-4 text-stone-600">{u.email || '—'}</td>
                  <td className="px-5 py-4 text-stone-600">{u.phone || '—'}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {u.tags.map(t => (
                        <span
                          key={t.id}
                          className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                          style={{ backgroundColor: t.color + '20', color: t.color, border: `1px solid ${t.color}40` }}
                        >
                          #{t.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleActive(u)}
                      className={`cursor-pointer px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all hover:ring-2 hover:ring-editorial-wine/30 ${
                        u.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-500 border border-stone-200'
                      }`}
                      title={u.isActive ? 'Click to deactivate' : 'Click to activate'}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {u.isActive ? (
                        <>
                          <Link
                            href={`/admin/users/${u.id}`}
                            className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-900 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          {deleteConfirm === u.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(u)}
                                className="px-2 py-1 bg-red-600 text-white rounded text-[9px] font-bold uppercase tracking-wider hover:bg-red-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-1 border border-stone-200 rounded text-[9px] font-bold uppercase tracking-wider text-stone-500 hover:bg-stone-100"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(u.id)}
                              className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-red-600 transition-colors"
                              title="Delete employee"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => handleRestore(u)}
                          className="flex items-center gap-1 px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-[9px] font-bold uppercase tracking-wider text-stone-600 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-stone-400 text-xs">
                    {tab === 'active' ? 'No active employees' : 'No deleted employees'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-[99] flex items-center justify-center p-4">
          <div className="bg-editorial-paper w-full max-w-md rounded-lg border border-stone-300 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-editorial-wine to-editorial-gold"></div>
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-md font-serif font-bold">Add Employee</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-stone-200 rounded transition-colors text-stone-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Name *</label>
                <input type="text" required className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Phone</label>
                <input type="text" className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Password *</label>
                <input type="password" required className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 border border-stone-200 rounded-md text-stone-600 bg-white hover:bg-stone-100">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-editorial-wine hover:bg-stone-900 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
