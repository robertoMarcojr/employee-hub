'use client';

import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Users, BadgeCheck, ChevronRight, Sparkles, Plus, RefreshCw } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { EXECUTIVE_PULSE_TILES } from '@/lib/data';

export default function ExecutiveDashboard() {
  const { projects, searchQuery } = useApp();
  const [reportState, setReportState] = useState<'idle' | 'generating' | 'done'>('idle');
  const [pulseList, setPulseList] = useState(EXECUTIVE_PULSE_TILES);

  const handleGenerateReport = () => {
    setReportState('generating');
    setTimeout(() => {
      setReportState('done');
      setTimeout(() => setReportState('idle'), 2500);
    }, 1500);
  };

  const handleInitiateGlobalTask = () => {
    const taskTitle = prompt('Enter a description for a new urgent global executive task:');
    if (!taskTitle) return;
    const newPulseItem = {
      id: `pulse-custom-${Date.now()}`,
      category: 'Urgent',
      timeElapsed: '0h 01m elapsed',
      title: taskTitle,
      teamMember: 'Alex Rivera',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpDK1cBpeD9dlaYcswiz_3n52_jnPu1ZOMetdxUi1RVPnOyjL7s6Jlkwg6EVKY1dOIGAIYV0HBcmjbXOMQTGHp11iZOfMC4bHb26b8tBa1boJymMS29fhzT23CBSufk1nHxiSGL14YmEf0kEsKKe54lpEajBKHIU7JGLvTHL-b4atJtLHHVEiWsx6_LNcbA0W-YOYWqKNcMiRWRkBFJRF4dW-5hS7qXfKq1g6BfsaSFfXqjR2kLwl5d5jQqJN34CUw3n8Wm6VBy9M',
      iconType: 'bolt'
    };
    setPulseList((prev) => [newPulseItem, ...prev]);
  };

  const executiveProjects = projects.filter(p => {
    const query = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans text-stone-900">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 text-stone-900">
        <div className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-stone-500 text-[9px] font-bold uppercase tracking-widest font-sans">Operational Health</span>
            <h3 className="text-2xl font-serif font-bold mt-1 text-stone-900">94.2%</h3>
          </div>
          <div className="mt-4 flex items-center text-emerald-800 text-[10px] font-bold uppercase tracking-wide">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>+2.1% from previous FY</span>
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-stone-500 text-[9px] font-bold uppercase tracking-widest font-sans">Active CapEx</span>
            <h3 className="text-2xl font-serif font-bold mt-1 text-stone-900">$4.2M</h3>
          </div>
          <div className="mt-4 flex items-center text-editorial-gold text-[10px] font-bold uppercase tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            <span>On Budget Model</span>
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-stone-500 text-[9px] font-bold uppercase tracking-widest font-sans">Workforce Utilization</span>
            <h3 className="text-2xl font-serif font-bold mt-1 text-stone-900">87%</h3>
          </div>
          <div className="mt-4 flex items-center text-stone-500 text-[10px] font-bold uppercase tracking-wide font-mono">
            <Users className="w-3.5 h-3.5 mr-1 text-stone-400" />
            <span>482 Total FTE Allocation</span>
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-stone-500 text-[9px] font-bold uppercase tracking-widest font-sans">Compliance Index</span>
            <h3 className="text-2xl font-serif font-bold mt-1 text-stone-900">A+</h3>
          </div>
          <div className="mt-4 flex items-center text-editorial-wine text-[10px] font-bold uppercase tracking-wide">
            <BadgeCheck className="w-3.5 h-3.5 mr-1" />
            <span>Top Tier Compliance</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm text-stone-900">
            <div className="px-5 py-4 border-b border-stone-200 flex justify-between items-center bg-white">
              <div>
                <h2 className="font-serif font-bold text-md text-stone-900">Strategic Project Portfolios</h2>
                <p className="text-[11px] font-editorial text-stone-500 italic">Operational indices across regional enterprise hubs</p>
              </div>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-stone-500 font-bold uppercase tracking-widest text-[9px]">
                    <th className="px-5 py-3">INITIATIVE</th>
                    <th className="px-5 py-3">ROADMAP HEALTH</th>
                    <th className="px-5 py-3">BUDGET ALLOCATION</th>
                    <th className="px-5 py-3">TIMELINE COMPLETE</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {executiveProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded bg-stone-50 border border-stone-250 flex items-center justify-center text-editorial-wine">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-serif font-bold text-xs text-stone-900 leading-snug">{p.name}</p>
                            <p className="text-[9px] font-mono text-stone-400 mt-0.5 uppercase tracking-wide">{p.id === 'neptune-migration' ? 'Financial Systems' : p.id === 'core-design-system' ? 'Product Design' : 'Tech Operations'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${p.status === 'At Risk' ? 'bg-editorial-gold' : 'bg-emerald-600 animate-pulse'}`}></span>
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${p.status === 'At Risk' ? 'text-editorial-gold' : 'text-emerald-700'}`}>{p.status === 'At Risk' ? 'At Risk' : 'Optimal'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-xs">{p.budget} / {p.spent}</p>
                        <p className="text-[9px] font-mono text-stone-400 uppercase tracking-tight mt-0.5">{p.status === 'At Risk' ? 'Critical Burndown' : 'Standard CapEx'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 max-w-[120px]">
                          <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full bg-editorial-wine rounded-full" style={{ width: `${p.progress}%` }}></div>
                          </div>
                          <span className="font-bold text-[10px] text-stone-500 font-mono">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="p-1 hover:bg-stone-50 rounded text-stone-450">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-lg p-5 text-stone-800 shadow-sm">
              <h3 className="text-[9px] font-extrabold uppercase tracking-widest text-stone-900 mb-4">Strategic Capital Allocation</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#b28a52" strokeWidth="4.5" strokeDasharray="30 70" strokeDashoffset="-55" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e7e5e4" strokeWidth="4.5" strokeDasharray="15 85" strokeDashoffset="-85" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#722f37" strokeWidth="4.5" strokeDasharray="55 45" strokeDashoffset="0" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-editorial-wine">55%</span>
                    <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Eng Core</span>
                  </div>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-editorial-wine rounded flex-shrink-0"></span>
                    <span className="font-bold text-stone-800">Engineering (55%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-editorial-gold rounded flex-shrink-0"></span>
                    <span className="font-bold text-stone-850">Operations (30%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-stone-200 rounded flex-shrink-0"></span>
                    <span className="font-bold text-stone-500">Other Systems (15%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-editorial-wine text-stone-100 border border-stone-900/10 rounded-lg p-5 flex flex-col justify-between relative overflow-hidden shadow-sm">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <h3 className="text-[9px] font-extrabold uppercase tracking-widest mb-2 flex items-center gap-1.5 text-stone-100">
                  <Sparkles className="w-4 h-4 text-editorial-gold fill-editorial-gold" />
                  <span>Executive Briefing</span>
                </h3>
                <p className="text-xs leading-relaxed font-editorial italic text-stone-100/90 mb-4">
                  Strategic analytics indicate a <span className="font-bold text-white">12% throughput improvement</span> across core pipelines following standardizations inside regional clusters.
                </p>
              </div>
              <button onClick={handleGenerateReport} disabled={reportState === 'generating'} className="w-full py-2 bg-editorial-paper border border-stone-200 text-editorial-wine hover:text-stone-100 hover:bg-stone-900 hover:border-stone-950 rounded-md font-bold text-[10px] tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                {reportState === 'generating' ? (
                  <><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>Analyzing Strategic Indices...</span></>
                ) : reportState === 'done' ? (
                  <span>Report Index Dispatched</span>
                ) : (
                  <span>Disseminate Briefing Index</span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-stone-200 rounded-lg flex flex-col h-[520px] sticky top-20 z-10 shadow-sm">
            <div className="px-5 py-4 border-b border-stone-200 bg-stone-50/80 rounded-t-lg flex justify-between items-center text-stone-900">
              <div>
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest">Active Dispatch Stream</h2>
                <p className="text-[8px] font-bold text-emerald-800 uppercase flex items-center gap-1 mt-0.5 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  42 Operations Real-time
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {pulseList.map((item) => (
                <div key={item.id} className="bg-white border border-stone-200 hover:border-stone-400 transition-all rounded-md p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] cursor-pointer group">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="px-1.5 py-0.2 border border-stone-200 text-stone-500 bg-stone-50 text-[8px] font-bold rounded uppercase tracking-wider">{item.category}</span>
                    <span className="text-[8px] font-mono text-stone-400">{item.timeElapsed}</span>
                  </div>
                  <h4 className="text-xs font-serif font-bold text-stone-900 line-clamp-2 leading-relaxed group-hover:text-editorial-wine transition-colors">{item.title}</h4>
                  <div className="mt-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img alt={item.teamMember} className="w-5 h-5 rounded-md object-cover border border-stone-200" referrerPolicy="no-referrer" src={item.avatar} />
                      <span className="text-[10px] font-bold text-stone-600 font-sans">{item.teamMember}</span>
                    </div>
                    <div className="w-5.5 h-5.5 rounded bg-stone-100 border border-stone-200 flex items-center justify-center">
                      <span className="text-editorial-wine text-xs">&diams;</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-stone-50 border-t border-stone-200 rounded-b-lg">
              <button onClick={handleInitiateGlobalTask} className="w-full py-2 bg-stone-900 border border-stone-950 hover:bg-stone-800 text-stone-100 font-bold text-[10px] tracking-wider uppercase rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                <Plus className="w-3.5 h-3.5 text-stone-300" />
                <span>Initiate Core Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
