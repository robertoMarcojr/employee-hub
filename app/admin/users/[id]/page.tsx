'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
  color: string;
  description: string | null;
}

interface User {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  tags: Tag[];
}

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${id}`).then(r => r.json()),
      fetch('/api/tags').then(r => r.json()),
    ]).then(([userData, tagsData]) => {
      setUser(userData);
      setAllTags(tagsData);
      setForm({ name: userData.name, email: userData.email || '', phone: userData.phone || '', password: '' });
      setLoading(false);
    });
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body: any = { name: form.name, email: form.email || null, phone: form.phone || null };
    if (form.password) body.password = form.password;
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    router.push('/admin/users');
  };

  const handleAddTag = async (tagId: string) => {
    await fetch(`/api/users/${id}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tagId }),
    });
    const updated = await fetch(`/api/users/${id}`).then(r => r.json());
    setUser(updated);
  };

  const handleRemoveTag = async (tagId: string) => {
    await fetch(`/api/users/${id}/tags/${tagId}`, { method: 'DELETE' });
    const updated = await fetch(`/api/users/${id}`).then(r => r.json());
    setUser(updated);
  };

  if (loading) return <div className="p-8 text-stone-500">Loading...</div>;
  if (!user) return <div className="p-8 text-stone-500">User not found</div>;

  const availableTags = allTags.filter(t => !user.tags.some(ut => ut.id === t.id));

  return (
    <div className="max-w-2xl space-y-6 font-sans text-stone-900">
      <div>
        <h1 className="text-2xl font-serif font-bold">Edit Employee</h1>
        <p className="text-xs text-stone-500 mt-1">{user.email || user.phone}</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-stone-200 rounded-lg p-6 space-y-4 text-xs">
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Name</label>
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
          <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">New Password (leave blank to keep current)</label>
          <input type="password" className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
        </div>

        <div className="pt-4 border-t border-stone-200">
          <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500 block mb-2">Current Tags</label>
          <div className="flex gap-2 flex-wrap mb-4">
            {user.tags.map(t => (
              <span key={t.id} className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold" style={{ backgroundColor: t.color + '20', color: t.color, border: `1px solid ${t.color}40` }}>
                #{t.name}
                <button onClick={() => handleRemoveTag(t.id)} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {user.tags.length === 0 && <span className="text-stone-400 text-[11px]">No tags assigned</span>}
          </div>

          {availableTags.length > 0 && (
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500 block mb-2">Add Tag</label>
              <div className="flex gap-2 flex-wrap">
                {availableTags.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleAddTag(t.id)}
                    className="px-2 py-1 rounded text-[10px] font-bold border hover:opacity-70 transition-opacity"
                    style={{ borderColor: t.color + '40', color: t.color }}
                  >
                    + #{t.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.push('/admin/users')} className="px-4 py-2 border border-stone-200 rounded-md text-stone-600 bg-white hover:bg-stone-100">Cancel</button>
          <button type="submit" disabled={saving} className="px-5 py-2 bg-editorial-wine hover:bg-stone-900 text-white rounded-md text-[10px] font-bold uppercase tracking-wider disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
