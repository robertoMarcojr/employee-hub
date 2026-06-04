'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckSquare, Clock, Play, CheckCircle, ArrowUpRight, Database, Flame, Loader2 } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';

interface DashboardData {
  completedTokens: number;
  activeTokens: number;
  projectsCount: number;
  assignedProjects: { id: string; name: string; status: string; progress: number; _count: { tokens: number } }[];
  recentActivity: { id: string; title: string; project: { name: string }; status: string; updatedAt: string }[];
}

interface Token {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project: { name: string };
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  _count: { members: number; tokens: number };
}

export default function DeveloperDashboard() {
  const userName = useAppSelector(s => s.auth.user?.name || 'User');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/employee/dashboard').then(r => r.json()),
      fetch('/api/employee/tokens').then(r => r.json()),
      fetch('/api/employee/projects').then(r => r.json()),
    ]).then(([d, t, p]) => {
      setDashboard(d);
      setTokens(t);
      setProjects(p);
    }).finally(() => setLoading(false));
  }, []);

  const handleCompleteToken = async (id: string) => {
    await fetch(`/api/tokens/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'done' }) });
    setTokens(prev => prev.map(t => t.id === id ? { ...t, status: 'done' } : t));
  };

  const handleTakeToken = async (id: string) => {
    await fetch(`/api/tokens/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'in_progress' }) });
    setTokens(prev => prev.map(t => t.id === id ? { ...t, status: 'in_progress' } : t));
  };

  const activeTokens = tokens.filter(t => t.status === 'open' || t.status === 'in_progress');

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 font-sans text-stone-900">
        <div className="bg-stone-50 border border-stone-200 p-6 rounded-lg flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-editorial-wine" />
          <span className="text-xs font-medium text-stone-500">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans text-stone-900">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-editorial-paper border border-stone-200 p-6 rounded-lg shadow-[0_2px_12px_rgba(28,25,23,0.02)] relative">
        <div className="absolute top-0 right-12 w-32 h-1 bg-gradient-to-r from-editorial-wine to-editorial-gold"></div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-1.5">Welcome back, {userName}.</h2>
        </div>
        <div className="flex gap-4">
          <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-md flex items-center gap-3.5 min-w-[130px]">
            <div className="w-8.5 h-8.5 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] text-stone-450 font-bold uppercase tracking-widest font-sans leading-none">Completed</p>
              <p className="text-xl font-bold font-serif text-stone-900 mt-1 leading-none">{dashboard?.completedTokens || 0}</p>
            </div>
          </div>
          <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-md flex items-center gap-3.5 min-w-[130px]">
            <div className="w-8.5 h-8.5 rounded bg-amber-50 border border-amber-150 flex items-center justify-center text-amber-800">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] text-stone-450 font-bold uppercase tracking-widest font-sans leading-none">Active</p>
              <p className="text-xl font-bold font-serif text-stone-900 mt-1 leading-none">{dashboard?.activeTokens || 0}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#191c1e] flex items-center gap-2">
              Active Tokens
              <span className="px-2 py-0.2 bg-editorial-wine text-stone-100 rounded text-[9px] font-mono font-bold">{activeTokens.length}</span>
            </h3>
            <Link href="/employee/tokens" className="text-editorial-wine hover:text-stone-950 text-xs font-bold uppercase tracking-wider hover:underline">
              Go to board &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTokens.slice(0, 4).map(token => (
              <div key={token.id} className="bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 group min-h-[190px] flex flex-col justify-between p-5 relative">
                <div className={`absolute top-0 inset-x-0 h-1 ${token.status === 'in_progress' ? 'bg-emerald-600' : 'bg-amber-500'} opacity-20`}></div>
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] font-bold text-stone-500 tracking-widest uppercase">{token.project?.name || 'Project'}</span>
                    <span className={`flex items-center gap-1.5 font-bold text-[9px] uppercase tracking-wider ${token.status === 'in_progress' ? 'text-emerald-800' : 'text-amber-800'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${token.status === 'in_progress' ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`}></span>
                      {token.status === 'in_progress' ? 'Running' : 'Open'}
                    </span>
                  </div>
                  <h4 className="text-md font-serif font-bold text-stone-900 group-hover:text-editorial-wine transition-colors duration-200">{token.title}</h4>
                  <p className="text-stone-600 text-xs leading-relaxed mt-1.5 mb-4 line-clamp-2">{token.description}</p>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-md mt-auto">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold tracking-wider font-mono ${token.status === 'in_progress' ? 'text-stone-900' : 'text-stone-500 italic font-editorial font-medium'}`}>
                      {token.status === 'in_progress' ? 'In progress' : 'Not started'}
                    </span>
                  </div>
                  {token.status === 'in_progress' ? (
                    <button onClick={() => handleCompleteToken(token.id)} className="w-7 h-7 flex items-center justify-center bg-editorial-wine hover:bg-stone-900 text-stone-100 rounded transition-colors text-xs" title="Complete Token">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => handleTakeToken(token.id)} className="w-7 h-7 flex items-center justify-center bg-editorial-wine hover:bg-stone-900 text-stone-100 rounded transition-colors text-xs" title="Start Token">
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {activeTokens.length === 0 && (
              <div className="col-span-2 bg-stone-50 border border-stone-200 rounded-lg p-8 text-center">
                <p className="text-xs font-bold text-stone-400">No active tokens</p>
                <p className="text-[10px] text-stone-400 mt-1">Pick up a token from the board to get started</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-stone-200">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#191c1e] mb-4">Assigned Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="relative bg-white border border-stone-200 rounded-lg p-5 flex gap-4 overflow-hidden group hover:border-stone-450 transition-all">
                  <div className="w-10 h-10 rounded bg-stone-50 border border-stone-200 flex-shrink-0 flex items-center justify-center text-editorial-wine">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h4 className="font-serif font-bold text-sm text-stone-900 group-hover:text-editorial-wine transition-colors truncate">{proj.name}</h4>
                      <span className="font-bold text-[8px] border border-stone-200 text-stone-600 bg-stone-50 px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0">{proj.status}</span>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed mb-3 line-clamp-2">{proj.description}</p>
                    <div className="flex items-center justify-between border-t border-stone-100 pt-3 mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                        <Flame className="w-3.5 h-3.5 text-editorial-gold" />
                        <span className="font-medium">{proj._count?.tokens || 0} Tokens</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white border border-stone-200 p-5 rounded-lg shadow-sm">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-900 flex items-center gap-2 mb-4">
              <span className="w-1.5 h-3 bg-editorial-wine rounded-none"></span>
              Recent Activity
            </h3>
            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-stone-200">
              {(dashboard?.recentActivity || []).slice(0, 5).map((act) => (
                <div key={act.id} className="relative pl-7 text-stone-900">
                  <div className={`absolute left-2.5 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white z-10 ${
                    act.status === 'done' ? 'bg-emerald-600' :
                    act.status === 'in_progress' ? 'bg-editorial-gold' : 'bg-stone-400'
                  }`}></div>
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-xs font-bold text-stone-800">{act.title}</p>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed font-editorial">{act.project?.name} — {act.status}</p>
                </div>
              ))}
              {(!dashboard?.recentActivity || dashboard.recentActivity.length === 0) && (
                <p className="text-[11px] text-stone-400 pl-7">No recent activity</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-lg shadow-sm">
            <h4 className="text-[10px] font-extrabold tracking-widest text-stone-400 uppercase mb-4 font-sans">Metrics &amp; Milestones</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-850 mb-1">
                  <span className="font-serif">Active Tokens</span>
                  <span className="font-mono">{dashboard?.activeTokens || 0}</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-editorial-wine rounded-full" style={{ width: `${Math.min((dashboard?.activeTokens || 0) * 10, 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-850 mb-1">
                  <span className="font-serif">Completed</span>
                  <span className="font-mono">{dashboard?.completedTokens || 0}</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-editorial-gold rounded-full" style={{ width: `${Math.min((dashboard?.completedTokens || 0) * 5, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
