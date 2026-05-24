'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckSquare, Clock, Play, Pause, CheckCircle, ArrowUpRight, Database, Flame } from 'lucide-react';
import { useApp } from '@/lib/app-context';

export default function DeveloperDashboard() {
  const { tokens, projects, updates, searchQuery, handleTakeToken, handleCompleteToken } = useApp();
  const [activeSeconds, setActiveSeconds] = useState(9912);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSeconds = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredActiveTokens = tokens.filter(tok => {
    if (tok.status === 'completed') return false;
    const query = searchQuery.toLowerCase();
    return (
      tok.title.toLowerCase().includes(query) ||
      tok.projectTitle.toLowerCase().includes(query) ||
      tok.code.toLowerCase().includes(query) ||
      tok.description.toLowerCase().includes(query)
    );
  });

  const developerProjects = projects.filter(p => p.id === 'project-hyperion' || p.id === 'core-design-system');

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans text-stone-900">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-editorial-paper border border-stone-200 p-6 rounded-lg shadow-[0_2px_12px_rgba(28,25,23,0.02)] relative">
        <div className="absolute top-0 right-12 w-32 h-1 bg-gradient-to-r from-editorial-wine to-editorial-gold"></div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-1.5">Welcome back, Alex.</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2.5 py-0.5 border border-stone-250 text-stone-700 bg-stone-50 rounded-md text-[10px] font-bold uppercase tracking-wider">#developer</span>
            <span className="px-2.5 py-0.5 border border-stone-250 text-stone-700 bg-stone-50 rounded-md text-[10px] font-bold uppercase tracking-wider">#engineering</span>
            <span className="px-2.5 py-0.5 border border-editorial-wine/25 text-editorial-wine bg-editorial-cream/50 rounded-md text-[10px] font-bold uppercase tracking-wider">#internal-tools</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-md flex items-center gap-3.5 min-w-[130px]">
            <div className="w-8.5 h-8.5 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] text-stone-450 font-bold uppercase tracking-widest font-sans leading-none">Completed</p>
              <p className="text-xl font-bold font-serif text-stone-900 mt-1 leading-none">24</p>
            </div>
          </div>
          <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-md flex items-center gap-3.5 min-w-[130px]">
            <div className="w-8.5 h-8.5 rounded bg-amber-50 border border-amber-150 flex items-center justify-center text-amber-800">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] text-stone-450 font-bold uppercase tracking-widest font-sans leading-none">This Week</p>
              <p className="text-xl font-bold font-serif text-stone-900 mt-1 leading-none">38.5h</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#191c1e] flex items-center gap-2">
              Active Tokens
              <span className="px-2 py-0.2 bg-editorial-wine text-stone-100 rounded text-[9px] font-mono font-bold">{filteredActiveTokens.length}</span>
            </h3>
            <Link href="/projects/q-core-migration" className="text-editorial-wine hover:text-stone-950 text-xs font-bold uppercase tracking-wider hover:underline">
              Go to board &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 group min-h-[190px] flex flex-col justify-between p-5 relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-emerald-600 opacity-20"></div>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-bold text-stone-500 tracking-widest uppercase">PRJ-242: HYPERION</span>
                  <span className="flex items-center gap-1.5 text-emerald-800 font-bold text-[9px] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Running
                  </span>
                </div>
                <h4 className="text-md font-serif font-bold text-stone-900 group-hover:text-editorial-wine transition-colors duration-200">Refactor API Middleware</h4>
                <p className="text-stone-600 text-xs leading-relaxed mt-1.5 mb-4 line-clamp-2">
                  Optimize request handling for high-concurrency clusters in the authentication service pipeline.
                </p>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-md mt-auto">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-xs font-bold tracking-wider font-mono text-stone-900">{formatSeconds(activeSeconds)}</span>
                </div>
                <button onClick={() => handleCompleteToken('token-1')} className="w-7 h-7 flex items-center justify-center bg-editorial-wine hover:bg-stone-900 text-stone-100 rounded transition-colors text-xs" title="Complete Token">
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 group min-h-[190px] flex flex-col justify-between p-5 relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-amber-500 opacity-20"></div>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-bold text-stone-500 tracking-widest uppercase">PRJ-109: CORE UI</span>
                  <span className="flex items-center gap-1.5 text-amber-800 font-bold text-[9px] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Suspended
                  </span>
                </div>
                <h4 className="text-md font-serif font-bold text-stone-900 group-hover:text-editorial-wine transition-colors duration-200">Accessibility Audit</h4>
                <p className="text-stone-600 text-xs leading-relaxed mt-1.5 mb-4 line-clamp-2">
                  Verify WCAG 2.1 compliance parameters across active design variables and button elements.
                </p>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-md mt-auto">
                <div className="flex items-center gap-2">
                  <Pause className="w-3.5 h-3.5 text-stone-450" />
                  <span className="text-xs text-stone-500 italic font-editorial font-medium">Paused at 01:12</span>
                </div>
                <button onClick={() => handleTakeToken('token-2')} className="w-7 h-7 flex items-center justify-center bg-editorial-wine hover:bg-stone-900 text-stone-100 rounded transition-colors text-xs" title="Resume Task">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#191c1e] mb-4">Assigned Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {developerProjects.map((proj) => (
                <div key={proj.id} className="relative bg-white border border-stone-200 rounded-lg p-5 flex gap-4 overflow-hidden group hover:border-stone-450 transition-all">
                  <div className="w-10 h-10 rounded bg-stone-50 border border-stone-200 flex-shrink-0 flex items-center justify-center text-editorial-wine">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h4 className="font-serif font-bold text-sm text-stone-900 group-hover:text-editorial-wine transition-colors truncate">{proj.name}</h4>
                      <span className="font-bold text-[8px] border border-stone-200 text-stone-600 bg-stone-50 px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0">{proj.priority}</span>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed mb-3 line-clamp-2">{proj.description}</p>
                    <div className="flex items-center justify-between border-t border-stone-100 pt-3 mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                        <Flame className="w-3.5 h-3.5 text-editorial-gold" />
                        <span className="font-medium">{proj.activeTokensCount} Tasks Active</span>
                      </div>
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {proj.teamAvatars.map((avUrl, i) => (
                          <img key={i} alt="avatar" className="w-4.5 h-4.5 rounded-full border border-white object-cover" referrerPolicy="no-referrer" src={avUrl} />
                        ))}
                        <div className="w-4.5 h-4.5 rounded-full bg-stone-100 border border-white text-[8px] font-bold flex items-center justify-center text-stone-500">+3</div>
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
              Recent Dispatch Logs
            </h3>
            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-stone-200">
              {updates.map((up) => (
                <div key={up.id} className="relative pl-7 text-stone-900">
                  <div className={`absolute left-2.5 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white z-10 ${
                    up.badgeColor === 'primary' ? 'bg-editorial-wine' :
                    up.badgeColor === 'warning' ? 'bg-editorial-gold' :
                    up.badgeColor === 'success' ? 'bg-emerald-600' : 'bg-stone-400'
                  }`}></div>
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-xs font-bold text-stone-800">{up.author}</p>
                    <span className="text-[9px] font-mono text-stone-400">{up.timeAgo}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed font-editorial">{up.content}</p>
                  {up.codeSnippet && (
                    <div className="mt-2 p-2 bg-stone-50 border border-stone-200 font-mono text-[9px] text-stone-600 rounded border-l-2 border-editorial-wine">{up.codeSnippet}</div>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full mt-5 py-2 text-xs font-bold text-stone-600 hover:bg-stone-50 border border-stone-200 transition-colors rounded-md flex items-center justify-center gap-1 uppercase tracking-wider">
              <span>View Archives</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-lg shadow-sm">
            <h4 className="text-[10px] font-extrabold tracking-widest text-stone-400 uppercase mb-4 font-sans">Metrics &amp; Milestones</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-850 mb-1">
                  <span className="font-serif">Token Completion</span>
                  <span className="font-mono">75%</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-editorial-wine w-[75%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-850 mb-1">
                  <span className="font-serif">Sprint Velocity</span>
                  <span className="font-mono">12/16 pts</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-editorial-gold w-[75%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
