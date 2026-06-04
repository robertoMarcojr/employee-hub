'use client';
import { useState, useEffect } from 'react';
import { FolderKanban, Users, Flame, ArrowUpRight } from 'lucide-react';

type Project = {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  _count: { members: number };
  tokenCounts: Record<string, number>;
};

function getProgress(status: string, tokenCounts: Record<string, number>): number {
  const total = Object.values(tokenCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  const done = tokenCounts['done'] || 0;
  return Math.round((done / total) * 100);
}

function getStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s === 'active' || s === 'completed') {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
  return 'bg-stone-50 text-stone-500 border border-stone-200';
}

export default function EmployeeProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/employee/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">My Projects</h2>
          <p className="text-xs text-stone-500 mt-1">Projects you are assigned to</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-stone-200 rounded-lg p-5 animate-pulse">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-stone-100" />
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-stone-100 rounded" />
                    <div className="h-3 w-64 bg-stone-100 rounded" />
                  </div>
                </div>
                <div className="ml-14 md:ml-0">
                  <div className="h-3 w-24 bg-stone-100 rounded mb-1" />
                  <div className="h-1.5 w-24 bg-stone-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-serif font-bold text-stone-900">My Projects</h2>
        <p className="text-xs text-stone-500 mt-1">Projects you are assigned to</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map(proj => {
          const progress = getProgress(proj.status, proj.tokenCounts);
          const totalTokens = Object.values(proj.tokenCounts).reduce((a, b) => a + b, 0);
          return (
            <div key={proj.id} className="bg-white border border-stone-200 rounded-lg p-5 hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-stone-50 border border-stone-200 flex items-center justify-center text-editorial-wine flex-shrink-0">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-serif font-bold text-sm text-stone-900 group-hover:text-editorial-wine transition-colors">{proj.name}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-stone-500">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{proj._count.members} members</span>
                      <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-editorial-gold" />{totalTokens} tokens</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getStatusBadgeClass(proj.status)}`}>{proj.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-14 md:ml-0">
                  <div className="min-w-[100px]">
                    <div className="flex justify-between text-[10px] text-stone-500 mb-1">
                      <span>Progress</span>
                      <span className="font-mono font-bold">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-editorial-wine rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                  <button className="p-2 border border-stone-200 rounded-md text-stone-400 hover:text-editorial-wine hover:border-editorial-wine transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
