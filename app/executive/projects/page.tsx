'use client';

import { useState } from 'react';
import { Search, ChevronRight, Filter } from 'lucide-react';

const strategicProjects = [
  { id: '1', name: 'Quantum Core Migration', status: 'On Track', budget: '$2.4M', spent: '$1.8M', progress: 72, health: 'good', lead: 'Sarah Chen', due: 'Dec 2026' },
  { id: '2', name: 'Neptune Financial Systems', status: 'At Risk', budget: '$1.8M', spent: '$1.6M', progress: 55, health: 'warning', lead: 'James Okafor', due: 'Feb 2027' },
  { id: '3', name: 'Core Design System', status: 'On Track', budget: '$890K', spent: '$420K', progress: 45, health: 'good', lead: 'Marcus Webb', due: 'Mar 2027' },
  { id: '4', name: 'Employee Hub Platform', status: 'Planning', budget: '$500K', spent: '$50K', progress: 15, health: 'neutral', lead: 'Alex Rivera', due: 'Jun 2027' },
  { id: '5', name: 'Global Cluster Expansion', status: 'Completed', budget: '$5.2M', spent: '$4.9M', progress: 100, health: 'good', lead: 'Elena Vasquez', due: 'Oct 2026' },
];

export default function ExecutiveProjectsPage() {
  const [query, setQuery] = useState('');

  const filtered = strategicProjects.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.lead.toLowerCase().includes(query.toLowerCase()) ||
    p.status.toLowerCase().includes(query.toLowerCase())
  );

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
            <input type="text" placeholder="Search projects..." value={query} onChange={e => setQuery(e.target.value)} className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-md text-xs outline-none focus:border-editorial-wine w-48" />
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
                        p.health === 'warning' ? 'text-editorial-gold' : 'text-stone-500'
                      }`}>{p.status}</span>
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
  );
}
