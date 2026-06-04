'use client';

import { useState } from 'react';
import { User, Mail, Phone, Save, Camera } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { setGlobalLoading } from '@/lib/store/uiSlice';

export default function EmployeeProfilePage() {
  const user = useAppSelector(s => s.auth.user);
  const dispatch = useAppDispatch();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    dispatch(setGlobalLoading(true));
    try {
      const res = await fetch('/api/employee/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
      dispatch(setGlobalLoading(false));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl">
      <div>
        <h2 className="text-2xl font-serif font-bold text-stone-900">Profile</h2>
        <p className="text-xs text-stone-500 mt-1">Manage your personal information</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-editorial-wine via-editorial-gold to-stone-300"></div>
        <div className="px-6 pb-6">
          <div className="flex justify-center -mt-12 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-stone-200 border-4 border-white flex items-center justify-center">
                <User className="w-8 h-8 text-stone-400" />
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-editorial-wine text-white rounded-full flex items-center justify-center border-2 border-white">
                <Camera className="w-3 h-3" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-md text-xs outline-none focus:border-editorial-wine focus:ring-1 focus:ring-editorial-wine text-stone-900" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-md text-xs outline-none focus:border-editorial-wine focus:ring-1 focus:ring-editorial-wine text-stone-900" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-md text-xs outline-none focus:border-editorial-wine focus:ring-1 focus:ring-editorial-wine text-stone-900" />
              </div>
            </div>
            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-editorial-wine text-white rounded-md text-xs font-bold hover:bg-stone-900 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
