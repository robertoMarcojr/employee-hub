'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Play, Pause, Plus, X } from 'lucide-react';

interface Token {
  id: string;
  title: string;
  description: string;
  project: { name: string; id?: string };
  status: 'open' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string | null;
}

interface Project {
  id: string;
  name: string;
}

export default function EmployeeTokensPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ projectId: '', title: '', description: '', priority: 'medium' });

  const fetchTokens = () => {
    fetch('/api/employee/tokens')
      .then(res => res.json())
      .then(data => { setTokens(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTokens();
    fetch('/api/employee/projects').then(r => r.json()).then(setProjects).catch(() => {});
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectId || !form.title) return;
    await fetch('/api/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowCreate(false);
    setForm({ projectId: '', title: '', description: '', priority: 'medium' });
    fetchTokens();
  };

  const columns = [
    { key: 'open' as const, label: 'Open', color: 'bg-stone-400' },
    { key: 'in_progress' as const, label: 'In Progress', color: 'bg-editorial-gold' },
    { key: 'done' as const, label: 'Done', color: 'bg-emerald-600' },
  ];

  const moveToken = async (id: string, newStatus: Token['status']) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    await fetch(`/api/tokens/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">My Tokens</h2>
            <p className="text-xs text-stone-500 mt-1">Kanban board — drag or click to update status</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-stone-50 border border-stone-200 rounded-lg min-h-[300px] animate-pulse">
              <div className="px-4 py-3 border-b border-stone-200">
                <div className="h-4 bg-stone-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">My Tokens</h2>
          <p className="text-xs text-stone-500 mt-1">Kanban board — drag or click to update status</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCreate(true)} className="px-3 py-2 bg-editorial-wine text-white rounded-md text-xs font-bold hover:bg-stone-900 transition-colors flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>New Token</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col.key} className="bg-stone-50 border border-stone-200 rounded-lg">
            <div className="px-4 py-3 border-b border-stone-200 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${col.color}`} />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">{col.label}</h3>
              <span className="ml-auto text-[10px] font-bold text-stone-400 bg-white border border-stone-200 px-1.5 py-0.5 rounded">{tokens.filter(t => t.status === col.key).length}</span>
            </div>
            <div className="p-3 space-y-3 min-h-[300px]">
              {tokens.filter(t => t.status === col.key).map(token => (
                <div key={token.id} className="bg-white border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      token.priority === 'urgent' ? 'bg-red-50 text-red-700 border border-red-200' :
                      token.priority === 'high' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-stone-50 text-stone-500 border border-stone-200'
                    }`}>{token.priority}</span>
                    {token.assignedTo && (
                      <span className="text-[9px] font-bold text-editorial-wine">Assigned</span>
                    )}
                  </div>
                  <h4 className="text-sm font-serif font-bold text-stone-900 mb-1">{token.title}</h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed mb-3 line-clamp-2">{token.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-stone-400">{token.project.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {token.status === 'open' && (
                        <button onClick={() => moveToken(token.id, 'in_progress')} className="p-1.5 rounded bg-editorial-gold/10 text-editorial-gold hover:bg-editorial-gold hover:text-white transition-colors" title="Start">
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                      )}
                      {token.status === 'in_progress' && (
                        <>
                          <button onClick={() => moveToken(token.id, 'done')} className="p-1.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white transition-colors" title="Complete">
                            <CheckCircle className="w-3 h-3" />
                          </button>
                          <button onClick={() => moveToken(token.id, 'open')} className="p-1.5 rounded bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors" title="Pause">
                            <Pause className="w-3 h-3" />
                          </button>
                        </>
                      )}
                      {token.status === 'done' && (
                        <button onClick={() => moveToken(token.id, 'in_progress')} className="p-1.5 rounded bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors" title="Reopen">
                          <Clock className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {tokens.filter(t => t.status === col.key).length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-stone-400">
                  <p className="text-[11px] font-medium">No tokens</p>
                  <p className="text-[9px] mt-0.5">Move tokens here to update status</p>
                </div>
              )}
            </div>
          </div>
        ))}
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
            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
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
