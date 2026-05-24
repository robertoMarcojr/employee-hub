'use client';

import { useState } from 'react';
import { Clock, CheckCircle, Play, Pause, Plus, Filter, ArrowUpRight } from 'lucide-react';

interface Token {
  id: string;
  title: string;
  description: string;
  project: string;
  status: 'open' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
}

const initialTokens: Token[] = [
  { id: '1', title: 'Refactor API Middleware', description: 'Optimize request handling for high-concurrency clusters', project: 'PRJ-242: HYPERION', status: 'in_progress', priority: 'high', assignee: 'Me' },
  { id: '2', title: 'Accessibility Audit', description: 'Verify WCAG 2.1 compliance across active design variables', project: 'PRJ-109: CORE UI', status: 'open', priority: 'medium' },
  { id: '3', title: 'Database Connection Pooling', description: 'Implement connection pooling for production database tier', project: 'PRJ-242: HYPERION', status: 'done', priority: 'high' },
  { id: '4', title: 'Design Token Migration', description: 'Migrate legacy color tokens to new design system', project: 'PRJ-109: CORE UI', status: 'open', priority: 'low' },
  { id: '5', title: 'Unit Test Coverage', description: 'Achieve 80% unit test coverage on core services', project: 'PRJ-242: HYPERION', status: 'in_progress', priority: 'medium', assignee: 'Me' },
];

export default function EmployeeTokensPage() {
  const [tokens, setTokens] = useState(initialTokens);

  const columns = [
    { key: 'open' as const, label: 'Open', color: 'bg-stone-400' },
    { key: 'in_progress' as const, label: 'In Progress', color: 'bg-editorial-gold' },
    { key: 'done' as const, label: 'Done', color: 'bg-emerald-600' },
  ];

  const moveToken = (id: string, newStatus: Token['status']) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">My Tokens</h2>
          <p className="text-xs text-stone-500 mt-1">Kanban board — drag or click to update status</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 border border-stone-200 rounded-md text-xs font-bold text-stone-600 hover:bg-white transition-colors flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
          <button className="px-3 py-2 bg-editorial-wine text-white rounded-md text-xs font-bold hover:bg-stone-900 transition-colors flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>New Token</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col.key} className="bg-stone-50 border border-stone-200 rounded-lg">
            <div className="px-4 py-3 border-b border-stone-200 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${col.color}`}></span>
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
                    {token.assignee && (
                      <span className="text-[9px] font-bold text-editorial-wine">Assigned</span>
                    )}
                  </div>
                  <h4 className="text-sm font-serif font-bold text-stone-900 mb-1">{token.title}</h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed mb-3 line-clamp-2">{token.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-stone-400">{token.project}</span>
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
  );
}
