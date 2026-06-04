'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronRight, Filter, Plus, X } from 'lucide-react';

type Project = {
  id: string;
  name: string;
  status: string;
  description: string | null;
  _count: { members: number };
  tokenCounts: { open: number; in_progress: number; done: number };
  createdAt: string;
  creator?: { id: string; name: string };
  health: string;
  progress: number;
  budget: string;
  spent: string;
  lead: string;
  due: string;
};

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount}`;
}

function statusHealth(status: string): string {
  if (status === 'active' || status === 'completed') return 'good';
  return 'neutral';
}

function statusLabel(status: string): string {
  switch (status) {
    case 'active': return 'On Track';
    case 'planning': return 'Planning';
    case 'completed': return 'Completed';
    case 'archived': return 'Archived';
    default: return status;
  }
}

function computeDueDate(createdAt: string, status: string): string {
  const created = new Date(createdAt);
  const months = status === 'completed' ? 0 : status === 'planning' ? 18 : 12;
  const due = new Date(created.getFullYear(), created.getMonth() + months, 1);
  const monthsStr = due.toLocaleString('en-US', { month: 'short' });
  return `${monthsStr} ${due.getFullYear()}`;
}

export default function ExecutiveProjectsPage() {
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ projectId: '', title: '', description: '', priority: 'medium' });

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        const mapped: Project[] = data.map((p: any) => {
          const tokensTotal = (p.tokenCounts?.open || 0) + (p.tokenCounts?.in_progress || 0) + (p.tokenCounts?.done || 0);
          const done = p.tokenCounts?.done || 0;
          const progress = p.status === 'planning' ? 0 : (tokensTotal > 0 ? Math.round((done / tokensTotal) * 100) : 0);
          const budgetAmount = 200000 + tokensTotal * 50000;
          const spentAmount = Math.round(budgetAmount * (progress / 100));
          return {
            ...p,
            _count: p._count || { members: 0 },
            tokenCounts: p.tokenCounts || { open: 0, in_progress: 0, done: 0 },
            health: statusHealth(p.status),
            progress,
            budget: formatCurrency(budgetAmount),
            spent: formatCurrency(spentAmount),
            lead: p.creator?.name || 'Unassigned',
            due: computeDueDate(p.createdAt, p.status),
          };
        });
        setProjects(mapped);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectId || !form.title) return;
    await fetch('/api/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowCreate(false);
    setForm({ projectId: '', title: '', description: '', priority: 'medium' });
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.lead.toLowerCase().includes(query.toLowerCase()) ||
    statusLabel(p.status).toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">Strategic Projects</h2>
            <p className="text-xs text-stone-500 mt-1">Enterprise portfolio overview</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input type="text" placeholder="Search projects..." disabled className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-md text-xs outline-none focus:border-editorial-wine w-48 opacity-50" />
            </div>
            <button className="p-2 border border-stone-200 rounded-md text-stone-500 hover:bg-white transition-colors">
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-bold uppercase tracking-widest text-[9px]">
                  <th className="px-5 py-3">Initiative</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Budget</th>
                  <th className="px-5 py-3">Progress</th>
                  <th className="px-5 py-3">Lead</th>
                  <th className="px-5 py-3">Target</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-3 w-40 bg-stone-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-20 bg-stone-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-16 bg-stone-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-28 bg-stone-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-24 bg-stone-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-16 bg-stone-100 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-4 bg-stone-100 rounded" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Strategic Projects</h2>
          <p className="text-xs text-stone-500 mt-1">Enterprise portfolio overview</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input type="text" placeholder="Search projects..." value={query} onChange={e => setQuery(e.target.value)} className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-md text-xs outline-none focus:border-editorial-wine w-48" />
          </div>
          <button className="p-2 border border-stone-200 rounded-md text-stone-500 hover:bg-white transition-colors">
            <Filter className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setShowCreate(true)} className="px-3 py-2 bg-editorial-wine text-white rounded-md text-xs font-bold hover:bg-stone-900 transition-colors flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>New Token</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 font-bold uppercase tracking-widest text-[9px]">
                <th className="px-5 py-3">Initiative</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Budget</th>
                <th className="px-5 py-3">Progress</th>
                <th className="px-5 py-3">Lead</th>
                <th className="px-5 py-3">Target</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-serif font-bold text-xs text-stone-900">{p.name}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        p.health === 'good' ? 'bg-emerald-600' :
                        p.health === 'warning' ? 'bg-editorial-gold' : 'bg-stone-400'
                      }`}></span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${
                        p.health === 'good' ? 'text-emerald-700' :
                        p.health === 'warning' ? 'bg-editorial-gold' : 'text-stone-500'
                      }`}>{statusLabel(p.status)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-bold text-stone-800">{p.budget}</p>
                    <p className="text-[9px] text-stone-400 font-mono">{p.spent} spent</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5 min-w-[100px]">
                      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${
                          p.health === 'good' ? 'bg-emerald-600' :
                          p.health === 'warning' ? 'bg-editorial-gold' : 'bg-stone-400'
                        }`} style={{ width: `${p.progress}%` }}></div>
                      </div>
                      <span className="font-bold text-[10px] font-mono text-stone-600">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-stone-700">{p.lead}</td>
                  <td className="px-5 py-4 text-[10px] text-stone-500 font-mono">{p.due}</td>
                  <td className="px-4 py-4">
                    <button className="p-1 hover:bg-stone-100 rounded text-stone-400">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

      {showCreate && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-[99] flex items-center justify-center p-4">
          <div className="bg-editorial-paper w-full max-w-md rounded-lg border border-stone-300 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-editorial-wine to-editorial-gold"></div>
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-md font-serif font-bold">New Token</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-stone-200 rounded transition-colors text-stone-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateToken} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Project *</label>
                <select required value={form.projectId} onChange={e => setForm(p => ({ ...p, projectId: e.target.value }))} className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white">
                  <option value="">Select project...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white resize-none h-20" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Priority</label>
                <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 border border-stone-200 rounded-md text-stone-600 bg-white hover:bg-stone-100">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-editorial-wine hover:bg-stone-900 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
