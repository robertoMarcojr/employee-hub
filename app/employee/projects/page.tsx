'use client';

import { FolderKanban, Users, Calendar, ArrowUpRight, Flame } from 'lucide-react';

const assignedProjects = [
  { id: '1', name: 'Quantum Core Migration', code: 'QCM-242', status: 'Active', progress: 72, dueDate: 'Dec 15, 2026', lead: 'Sarah Chen', members: 8, tokensActive: 12 },
  { id: '2', name: 'Core Design System', code: 'CDS-109', status: 'Active', progress: 45, dueDate: 'Mar 01, 2027', lead: 'Marcus Webb', members: 5, tokensActive: 7 },
  { id: '3', name: 'Employee Hub Platform', code: 'EHP-001', status: 'Planning', progress: 15, dueDate: 'Jun 30, 2027', lead: 'Alex Rivera', members: 3, tokensActive: 4 },
];

export default function EmployeeProjectsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-serif font-bold text-stone-900">My Projects</h2>
        <p className="text-xs text-stone-500 mt-1">Projects you are assigned to</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {assignedProjects.map(proj => (
          <div key={proj.id} className="bg-white border border-stone-200 rounded-lg p-5 hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-stone-50 border border-stone-200 flex items-center justify-center text-editorial-wine flex-shrink-0">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-serif font-bold text-sm text-stone-900 group-hover:text-editorial-wine transition-colors">{proj.name}</h3>
                    <span className="text-[9px] font-mono text-stone-400">{proj.code}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-stone-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{proj.members} members</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due {proj.dueDate}</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-editorial-gold" />{proj.tokensActive} active tokens</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      proj.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-50 text-stone-500 border border-stone-200'
                    }`}>{proj.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-14 md:ml-0">
                <div className="min-w-[100px]">
                  <div className="flex justify-between text-[10px] text-stone-500 mb-1">
                    <span>Progress</span>
                    <span className="font-mono font-bold">{proj.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-editorial-wine rounded-full" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                </div>
                <button className="p-2 border border-stone-200 rounded-md text-stone-400 hover:text-editorial-wine hover:border-editorial-wine transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
