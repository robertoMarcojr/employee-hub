'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { useAppDispatch } from '@/lib/store/hooks';
import { setGlobalLoading } from '@/lib/store/uiSlice';
import Spinner from '@/components/Spinner';

interface Tag {
  id: string;
  name: string;
  color: string;
  description: string | null;
  isSystem: boolean;
}

export default function AdminTagsPage() {
  const dispatch = useAppDispatch();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [form, setForm] = useState({ name: '', description: '', color: '#722f37' });

  const fetchTags = async () => {
    dispatch(setGlobalLoading(true));
    const res = await fetch('/api/tags');
    if (res.ok) setTags(await res.json());
    setLoading(false);
    dispatch(setGlobalLoading(false));
  };

  useEffect(() => { fetchTags(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/tags/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setShowCreate(false);
    setEditing(null);
    setForm({ name: '', description: '', color: '#722f37' });
    fetchTags();
  };

  const handleDelete = async (tag: Tag) => {
    if (!confirm(`Delete tag "${tag.name}"?`)) return;
    await fetch(`/api/tags/${tag.id}`, { method: 'DELETE' });
    fetchTags();
  };

  const startEdit = (tag: Tag) => {
    setEditing(tag);
    setForm({ name: tag.name, description: tag.description || '', color: tag.color });
    setShowCreate(true);
  };

  if (loading) return <div className="p-8 flex items-center gap-2 text-stone-500"><Spinner /><span>Loading tags...</span></div>;

  return (
    <div className="space-y-6 font-sans text-stone-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold">Tags</h1>
          <p className="text-xs text-stone-500 mt-1">{tags.length} total tags</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ name: '', description: '', color: '#722f37' }); setShowCreate(true); }}
          className="flex items-center gap-2 bg-editorial-wine text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-stone-900 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Tag
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-widest text-[9px] border-b border-stone-200">
            <tr>
              <th className="px-5 py-3">Tag</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Color</th>
              <th className="px-5 py-3">System</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {tags.map(t => (
              <tr key={t.id} className="hover:bg-stone-50/70 transition-colors">
                <td className="px-5 py-4">
                  <span className="px-2 py-1 rounded text-[10px] font-bold" style={{ backgroundColor: t.color + '20', color: t.color, border: `1px solid ${t.color}40` }}>
                    #{t.name}
                  </span>
                </td>
                <td className="px-5 py-4 text-stone-600">{t.description || '—'}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 rounded border border-stone-200" style={{ backgroundColor: t.color }} />
                    <span className="text-stone-500 font-mono text-[10px]">{t.color}</span>
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${t.isSystem ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-stone-100 text-stone-500 border border-stone-200'}`}>
                    {t.isSystem ? 'System' : 'Custom'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/tags/${t.id}/permissions`}
                      className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-900 transition-colors"
                      title="Permissions"
                    >
                      <Shield className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => startEdit(t)}
                      className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-900 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t)}
                      className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-[99] flex items-center justify-center p-4">
          <div className="bg-editorial-paper w-full max-w-md rounded-lg border border-stone-300 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-editorial-wine to-editorial-gold"></div>
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-md font-serif font-bold">{editing ? 'Edit Tag' : 'Add Tag'}</h2>
              <button onClick={() => { setShowCreate(false); setEditing(null); }} className="p-1 hover:bg-stone-200 rounded transition-colors text-stone-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Name *</label>
                <input type="text" required className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Description</label>
                <input type="text" className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Color</label>
                <div className="flex gap-3 items-center">
                  <input type="color" className="w-10 h-10 p-0.5 border border-stone-200 rounded cursor-pointer" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
                  <input type="text" className="flex-1 px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 font-mono text-[11px] bg-white" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreate(false); setEditing(null); }} className="px-4 py-2 border border-stone-200 rounded-md text-stone-600 bg-white hover:bg-stone-100">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-editorial-wine hover:bg-stone-900 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">{editing ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
