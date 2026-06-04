'use client';

import { useState, useEffect } from 'react';
import { Search, Users, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

export default function ExecutiveTeamPage() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<{
    members: Array<{
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
      role: string;
      tags: Array<{ name: string; color: string }>;
      assignedTokens: number;
      completedTokens: number;
    }>;
    totalFte: number;
    avgUtilization: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/executive/team')
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const teamStats = [
    { label: 'Total FTE', value: data ? String(data.totalFte) : '—', icon: Users },
    { label: 'Avg Utilization', value: data ? `${data.avgUtilization}%` : '—', icon: BarChart3 },
    { label: 'At Capacity', value: '3 members', icon: AlertTriangle, warn: true },
    { label: 'Velocity', value: '+12%', icon: TrendingUp, positive: true },
  ];

  const mappedMembers = (data?.members ?? []).map(m => {
    const maxTokens = 6;
    const capacity = Math.min(Math.round((m.assignedTokens / maxTokens) * 100), 100);
    return {
      id: m.id,
      name: m.name,
      role: m.role.charAt(0).toUpperCase() + m.role.slice(1),
      team: m.tags[0]?.name ?? '—',
      capacity,
      status: 'online',
      tokensActive: m.assignedTokens,
    };
  });

  const filtered = mappedMembers.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.role.toLowerCase().includes(query.toLowerCase()) ||
    m.team.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Team Overview</h2>
          <p className="text-xs text-stone-500 mt-1">Workforce capacity and allocation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-stone-200 rounded-lg p-5 animate-pulse">
              <div className="h-3 w-20 bg-stone-200 rounded mb-3" />
              <div className="h-7 w-16 bg-stone-200 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden animate-pulse">
          <div className="space-y-0">
            <div className="h-10 bg-stone-100" />
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 border-t border-stone-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-serif font-bold text-stone-900">Team Overview</h2>
        <p className="text-xs text-stone-500 mt-1">Workforce capacity and allocation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {teamStats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-stone-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.warn ? 'text-editorial-gold' : stat.positive ? 'text-emerald-600' : 'text-stone-400'}`} />
              </div>
              <p className="text-2xl font-serif font-bold text-stone-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
        <input type="text" placeholder="Search team members..." value={query} onChange={e => setQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-md text-xs outline-none focus:border-editorial-wine" />
      </div>

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 font-bold uppercase tracking-widest text-[9px]">
                <th className="px-5 py-3">Member</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Team</th>
                <th className="px-5 py-3">Capacity</th>
                <th className="px-5 py-3">Active Tokens</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-serif font-bold text-xs text-stone-900">{m.name}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-stone-600">{m.role}</td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-stone-100 text-stone-700 rounded border border-stone-200">{m.team}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5 min-w-[100px]">
                      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${m.capacity > 85 ? 'bg-editorial-wine' : m.capacity > 50 ? 'bg-editorial-gold' : 'bg-emerald-600'}`} style={{ width: `${m.capacity}%` }}></div>
                      </div>
                      <span className="font-bold text-[10px] font-mono text-stone-600">{m.capacity}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-xs font-mono text-stone-700">{m.tokensActive}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        m.status === 'online' ? 'bg-emerald-600' :
                        m.status === 'away' ? 'bg-editorial-gold' : 'bg-stone-400'
                      }`}></span>
                      <span className="text-[10px] font-bold text-stone-600 capitalize">{m.status}</span>
                    </div>
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
