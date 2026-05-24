'use client';

import React, { useState } from 'react';
import { Rocket, Lock, BarChart4, Filter, MoreVertical, Plus, X, PlusSquare } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { TEAM_WORKLOAD_LIST } from '@/lib/data';
import { Project } from '@/lib/types';

export default function ManagerOverview() {
  const { projects, setProjects, currentPersona, searchQuery, isCreateModalOpen, setIsCreateModalOpen } = useApp();

  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjDueDate, setNewProjDueDate] = useState('');
  const [newProjPriority, setNewProjPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newProjType, setNewProjType] = useState<'tech' | 'fin' | 'marketing'>('tech');

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName) return;

    const newProject: Project = {
      id: `custom-proj-${Date.now()}`,
      name: newProjName,
      code: 'QCM-NEW',
      description: newProjDesc || 'Strategic initiative created dynamically.',
      status: 'On Track',
      priority: `${newProjPriority} Priority` as any,
      manager: currentPersona.name,
      managerAvatar: currentPersona.avatarUrl,
      dueDate: newProjDueDate ? new Date(newProjDueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jan 05, 2027',
      progress: 5,
      budget: '$500K',
      spent: '$0',
      activeTokensCount: 4,
      initiativeType: newProjType,
      teamAvatars: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAv2GM19lSM-rIlEmU0iv9uQtxAogltwLt30XQETMTyhaV0vBWRz7PprETfCcOuHRCYTCaGZRLWA2IgsbC73ePAVvo_O7MfmXPgC_jG6JLeLgv3pFl9kvo6rv2Tb7yPfRlXtHBId-kuVnybnO8ool5zoe9hxH6O2EndIdi6OCjiEQXFjszEIb2YTU7O9McVgEzqQYbsnN5Pqs963bEy9I_IRoTrWgUJA6bIJvuUjJ-vH8Z2A51bHf7v5AgfC7qcO3-DKmjI0MmpzIY']
    };

    setProjects((prev) => [newProject, ...prev]);
    setNewProjName('');
    setNewProjDesc('');
    setNewProjDueDate('');
    setIsCreateModalOpen(false);
  };

  const filteredProjects = projects.filter(p => {
    const query = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(query) || p.manager.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.status.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans text-stone-900">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg border border-stone-200 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Active Initiatives</span>
            <div className="w-8 h-8 rounded bg-stone-50 border border-stone-200 flex items-center justify-center text-editorial-wine">
              <Rocket className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 leading-none">{projects.length}</h2>
            <p className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5 mt-1"><span>&uarr;</span> +12% from previous cycle</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-stone-200 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Blocked Tasks</span>
            <div className="w-8 h-8 rounded bg-stone-50 border border-stone-200 flex items-center justify-center text-editorial-wine">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 leading-none">07</h2>
            <p className="text-amber-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5 mt-1"><span>!</span> 3 critical bottlenecks detected</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-stone-200 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Utilization Ratio</span>
            <div className="w-8 h-8 rounded bg-stone-50 border border-stone-200 flex items-center justify-center text-editorial-wine">
              <BarChart4 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 leading-none">92%</h2>
            <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="h-full bg-editorial-gold w-[92%] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#191c1e]">Active Portfolios</h3>
            <div className="flex gap-2">
              <button className="p-1.5 border border-stone-250 rounded bg-white hover:bg-stone-50 transition-colors">
                <Filter className="w-3.5 h-3.5 text-stone-500" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs text-stone-900">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-widest border-b border-stone-200 text-[9px]">
                  <tr>
                    <th className="px-5 py-3">PORTFOLIO TITLE / CADENCE</th>
                    <th className="px-5 py-3">PROGRESS RATE</th>
                    <th className="px-5 py-3">LEAD PARTNER</th>
                    <th className="px-5 py-3">ROADMAP STATUS</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-900">
                  {filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors group">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-serif font-bold text-sm text-stone-900 hover:text-editorial-wine transition-colors cursor-pointer">{p.name}</p>
                          <p className="text-[9px] font-mono text-stone-400 mt-0.5 uppercase tracking-wider">Target {p.dueDate}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5 min-w-[100px]">
                          <div className="flex-grow bg-stone-100 h-1 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${p.status === 'At Risk' ? 'bg-editorial-gold' : p.status === 'Completed' ? 'bg-emerald-600' : 'bg-editorial-wine'}`} style={{ width: `${p.progress}%` }}></div>
                          </div>
                          <span className="font-bold text-[11px] font-mono text-stone-600">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <img alt={p.manager} className="w-5.5 h-5.5 rounded-md object-cover border border-stone-200" referrerPolicy="no-referrer" src={p.managerAvatar} />
                          <span className="font-bold text-[11px] text-stone-800">{p.manager}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${p.status === 'At Risk' ? 'bg-editorial-gold' : p.status === 'Completed' ? 'bg-emerald-600' : p.status === 'On Track' ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'}`}></span>
                          <span className={`font-bold text-[9px] uppercase tracking-widest select-none ${p.status === 'At Risk' ? 'text-editorial-gold' : p.status === 'Completed' ? 'text-emerald-700' : 'text-stone-500'}`}>{p.status === 'On Track' ? 'HEALTHY' : p.status}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button className="p-1 hover:bg-stone-100 rounded text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#191c1e]">Human Commitment</h3>
          <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4.5 shadow-sm">
            {TEAM_WORKLOAD_LIST.map((mem, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img alt={mem.name} className="w-9 h-9 rounded-md object-cover border border-stone-200" referrerPolicy="no-referrer" src={mem.avatar} />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${mem.status === 'online' ? 'bg-emerald-600' : 'bg-editorial-gold'}`}></span>
                    </div>
                    <div>
                      <p className="font-bold text-xs text-stone-900 leading-snug">{mem.name}</p>
                      <p className="text-[9px] text-stone-450 uppercase tracking-wider font-sans mt-0.5">{mem.role}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 border text-[8px] font-bold uppercase rounded ${mem.roleTag === 'Dev' ? 'border-cyan-200 text-cyan-800 bg-cyan-50' : mem.roleTag === 'Design' ? 'border-purple-200 text-purple-800 bg-purple-50' : 'border-stone-200 text-stone-700 bg-stone-50'}`}>{mem.roleTag}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-stone-500">
                    <span>Active Allocation Rate</span>
                    <span className={`font-mono ${mem.capacity > 85 ? 'text-red-700 font-bold' : ''}`}>{mem.capacity}%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${mem.capacity > 85 ? 'bg-editorial-wine' : mem.capacity > 50 ? 'bg-editorial-gold' : 'bg-stone-400'}`} style={{ width: `${mem.capacity}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => alert('Scheduling ledger reporting initialized.')} className="w-full py-2 border border-dashed border-stone-300 hover:bg-stone-50 text-stone-500 hover:text-stone-900 font-bold text-[10px] tracking-wider uppercase rounded-md transition-all mt-1">
              Auditing Schedule Ledger
            </button>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-[99] flex items-center justify-center p-4">
          <div className="bg-editorial-paper w-full max-w-lg rounded-lg border border-stone-300 shadow-xl overflow-hidden animate-in zoom-in duration-200 text-stone-900">
            <div className="h-1 bg-gradient-to-r from-editorial-wine to-editorial-gold"></div>
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-md font-serif font-bold text-stone-900 flex items-center gap-2">
                <PlusSquare className="w-4.5 h-4.5 text-editorial-wine" />
                <span>Publish New Initiative</span>
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 hover:bg-stone-200 rounded transition-colors text-stone-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProjectSubmit}>
              <div className="p-5 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Project Title</label>
                  <input type="text" required placeholder="Enter project nomenclature..." className="w-full px-3 py-2 border border-stone-250 rounded-md text-xs outline-none focus:border-editorial-wine focus:ring-1 focus:ring-editorial-gold text-stone-900 bg-white" value={newProjName} onChange={(e) => setNewProjName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Initiative Description</label>
                  <textarea rows={2} placeholder="Strategic operational descriptions..." className="w-full px-3 py-2 border border-stone-250 rounded-md text-xs outline-none focus:border-editorial-wine focus:ring-1 focus:ring-editorial-gold text-stone-900 font-editorial bg-white" value={newProjDesc} onChange={(e) => setNewProjDesc(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Operational Target Date</label>
                    <input type="date" className="w-full px-3 py-2 border border-stone-250 rounded-md text-xs outline-none focus:border-editorial-wine focus:ring-1 focus:ring-editorial-gold text-stone-900 bg-white font-mono" value={newProjDueDate} onChange={(e) => setNewProjDueDate(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Nomenclature Priority</label>
                    <select className="w-full px-3 py-2 border border-stone-250 bg-white rounded-md text-xs outline-none focus:border-editorial-wine focus:ring-1 focus:ring-editorial-gold text-stone-900" value={newProjPriority} onChange={(e) => setNewProjPriority(e.target.value as any)}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Assign Lead Partner</label>
                  <div className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200 rounded-md">
                    <img alt={currentPersona.name} className="w-5.5 h-5.5 rounded-md object-cover border border-stone-200" referrerPolicy="no-referrer" src={currentPersona.avatarUrl} />
                    <span className="font-bold text-stone-800 text-[10px]">{currentPersona.name} &mdash; <span className="font-normal italic text-stone-500">{currentPersona.title}</span></span>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end gap-3 font-bold text-[10px] tracking-wider uppercase">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-stone-200 rounded-md text-stone-600 bg-white hover:bg-stone-100 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-editorial-wine hover:bg-stone-900 text-white rounded-md border border-stone-950/20">Publish Initiative</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
