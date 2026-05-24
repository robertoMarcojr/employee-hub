'use client';

import { useState } from 'react';
import { FileText, Download, RefreshCw, TrendingUp, TrendingDown, Clock, BarChart3 } from 'lucide-react';

const reports = [
  { id: '1', title: 'Q4 2026 Strategic Review', type: 'Quarterly', date: 'Dec 15, 2026', status: 'Final', pages: 42 },
  { id: '2', title: 'Workforce Utilization Report', type: 'Monthly', date: 'Nov 30, 2026', status: 'Final', pages: 18 },
  { id: '3', title: 'Capital Allocation Analysis', type: 'Quarterly', date: 'Nov 15, 2026', status: 'Draft', pages: 24 },
  { id: '4', title: 'Project Health Dashboard', type: 'Weekly', date: 'Nov 28, 2026', status: 'Final', pages: 8 },
  { id: '5', title: 'Compliance & Audit Summary', type: 'Annual', date: 'Oct 01, 2026', status: 'Final', pages: 56 },
];

const kpis = [
  { label: 'Reports Generated', value: '24', change: '+3', trend: 'up', period: 'this quarter' },
  { label: 'Avg. Completion Time', value: '3.2d', change: '-12%', trend: 'down', period: 'vs last quarter' },
  { label: 'Data Accuracy', value: '99.8%', change: '+0.4%', trend: 'up', period: 'improving' },
];

export default function ExecutiveReportsPage() {
  const [generating, setGenerating] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Reports & Analytics</h2>
          <p className="text-xs text-stone-500 mt-1">Executive reporting suite</p>
        </div>
        <button
          onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 2000); }}
          disabled={generating}
          className="px-4 py-2 bg-editorial-wine text-white rounded-md text-xs font-bold hover:bg-stone-900 transition-colors flex items-center gap-2"
        >
          {generating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
          <span>{generating ? 'Generating...' : 'Generate Report'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white border border-stone-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">{kpi.label}</span>
              {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-editorial-wine" />}
            </div>
            <p className="text-2xl font-serif font-bold text-stone-900">{kpi.value}</p>
            <p className={`text-[10px] font-bold mt-1 ${kpi.trend === 'up' ? 'text-emerald-700' : 'text-editorial-wine'}`}>{kpi.change} <span className="font-normal text-stone-400">{kpi.period}</span></p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-700 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-editorial-wine" />
            <span>Report Archive</span>
          </h3>
        </div>
        <div className="divide-y divide-stone-100">
          {reports.map(r => (
            <div key={r.id} className="px-5 py-4 flex items-center justify-between hover:bg-stone-50/60 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded bg-stone-50 border border-stone-200 flex items-center justify-center text-editorial-wine">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{r.title}</h4>
                  <div className="flex items-center gap-3 mt-0.5 text-[9px] text-stone-500">
                    <span>{r.type}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.date}</span>
                    <span>{r.pages} pages</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      r.status === 'Final' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>{r.status}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 border border-stone-200 rounded-md text-stone-400 hover:text-editorial-wine hover:border-editorial-wine transition-colors">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
