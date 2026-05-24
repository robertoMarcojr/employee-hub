'use client';

import React, { useState } from 'react';
import { FileText, CloudRain, Plus, Play, CheckCircle2, Send, MessageSquare, Filter, ExternalLink } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { Token, Comment } from '@/lib/types';

export default function ProjectDetailView() {
  const { tokens, setTokens, discussions, setDiscussions, projects, searchQuery } = useApp();
  const [typedMessage, setTypedMessage] = useState('');
  const [columnFilter, setColumnFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [velocityProgress, setVelocityProgress] = useState(65);

  const handleMoveToken = (id: string, newStatus: 'available' | 'in_progress' | 'completed') => {
    setTokens((prev) =>
      prev.map((tok) => {
        if (tok.id === id) {
          return {
            ...tok,
            status: newStatus,
            assignee: newStatus === 'in_progress'
              ? {
                  name: 'Alex Rivera',
                  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpDK1cBpeD9dlaYcswiz_3n52_jnPu1ZOMetdxUi1RVPnOyjL7s6Jlkwg6EVKY1dOIGAIYV0HBcmjbXOMQTGHp11iZOfMC4bHb26b8tBa1boJymMS29fhzT23CBSufk1nHxiSGL14YmEf0kEsKKe54lpEajBKHIU7JGLvTHL-b4atJtLHHVEiWsx6_LNcbA0W-YOYWqKNcMiRWRkBFJRF4dW-5hS7qXfKq1g6BfsaSFfXqjR2kLwl5d5jQqJN34CUw3n8Wm6VBy9M',
                }
              : tok.assignee,
          };
        }
        return tok;
      })
    );
  };

  const handleAddNewTask = () => {
    const titleVal = prompt('Enter a brief description for a new available token:');
    if (!titleVal) return;
    const newTask: Token = {
      id: `custom-token-${Date.now()}`,
      code: 'QCM-ADD',
      projectTitle: 'QUANTUM CORE',
      title: titleVal,
      description: 'Dynamically generated task for immediate tracking.',
      status: 'available',
      priority: 'High Priority',
    };
    setTokens((prev) => [...prev, newTask]);
    setVelocityProgress((prev) => Math.min(prev + 5, 95));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const myNewMessage: Comment = {
      id: `c-me-${Date.now()}`,
      author: 'You',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpDK1cBpeD9dlaYcswiz_3n52_jnPu1ZOMetdxUi1RVPnOyjL7s6Jlkwg6EVKY1dOIGAIYV0HBcmjbXOMQTGHp11iZOfMC4bHb26b8tBa1boJymMS29fhzT23CBSufk1nHxiSGL14YmEf0kEsKKe54lpEajBKHIU7JGLvTHL-b4atJtLHHVEiWsx6_LNcbA0W-YOYWqKNcMiRWRkBFJRF4dW-5hS7qXfKq1g6BfsaSFfXqjR2kLwl5d5jQqJN34CUw3n8Wm6VBy9M',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: typedMessage,
      isMe: true,
    };

    setDiscussions((prev) => [...prev, myNewMessage]);
    const originalText = typedMessage;
    setTypedMessage('');

    setTimeout(() => {
      let responseText = "Understood. I'll make sure the replication containers are completely configured for this timing.";
      if (originalText.toLowerCase().includes('throttling') || originalText.toLowerCase().includes('ip')) {
        responseText = "Sounds perfect, Alex. Let's make sure the Batch-Z pipeline thresholds are mapped exactly to Section 4 guidance.";
      } else if (originalText.toLowerCase().includes('help') || originalText.toLowerCase().includes('fix')) {
        responseText = 'On it! Sending the updated middleware logs to your workspace link.';
      }
      const botReply: Comment = {
        id: `c-bot-${Date.now()}`,
        author: 'Sarah Chen',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0_bWxRztfV42w1DcNpdXQOSVKPfY6Jt2WyUfgB9M7bi-fm4wSSTj0nPYYTUH6RGdBPutWIVBzO1YoU5VRhqJSXthG_T8Nzj6bjozSdk8RjGoZr5sPaYdl5UorlU5gwXjfPlGwQmFUwsz_Z7q1a9_iYoyQDVbY7Pi0s8pYZnODd7wXfsbBLDfOvWpHKDcjNCVkX7ZOA8mgs9o3JNHpsD7u0i-VuKiOq-Q0CFyOBV3UBELpY1eDDwT53pCe46G4oTVBNZHe1yFtbs',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: responseText,
        isMe: false,
      };
      setDiscussions((prev) => [...prev, botReply]);
    }, 1500);
  };

  const activeProjectTokens = tokens.filter(tok => {
    const matchesSearch =
      tok.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tok.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tok.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (columnFilter === 'all') return matchesSearch;
    if (columnFilter === 'high') return matchesSearch && tok.priority.includes('High');
    if (columnFilter === 'medium') return matchesSearch && !tok.priority.includes('High');
    return matchesSearch;
  });

  const availableCol = activeProjectTokens.filter(t => t.status === 'available');
  const progressCol = activeProjectTokens.filter(t => t.status === 'in_progress');
  const completedCol = activeProjectTokens.filter(t => t.status === 'completed');

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans text-stone-900">
      <section className="bg-editorial-paper border border-stone-200 p-6 rounded-lg shadow-[0_1px_8px_rgba(28,25,23,0.01)] text-stone-900 relative">
        <div className="absolute top-0 right-12 w-24 h-1 bg-editorial-gold"></div>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
              <span className="px-2 py-0.5 border border-stone-200 text-stone-600 bg-stone-50 text-[9px] font-bold uppercase tracking-wider rounded">INTERNAL WORKSPACE</span>
              <span className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse"></span>
                ACTIVE PROPOSAL
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-1">Quantum Core Migration</h2>
            <p className="text-stone-600 text-xs leading-relaxed max-w-2xl font-editorial">
              Comprehensive overhaul of the primary database architecture to support real-time data streaming and improved latency across regional hubs. Overhauls zero-copy buffers.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 self-stretch md:self-auto justify-between md:justify-start">
            <div className="flex -space-x-1.5">
              <img alt="Member" className="w-7 h-7 rounded-md border border-white" referrerPolicy="no-referrer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv2GM19lSM-rIlEmU0iv9uQtxAogltwLt30XQETMTyhaV0vBWRz7PprETfCcOuHRCYTCaGZRLWA2IgsbC73ePAVvo_O7MfmXPgC_jG6JLeLgv3pFl9kvo6rv2Tb7yPfRlXtHBId-kuVnybnO8ool5zoe9hxH6O2EndIdi6OCjiEQXFjszEIb2YTU7O9McVgEzqQYbsnN5Pqs963bEy9I_IRoTrWgUJA6bIJvuUjJ-vH8Z2A51bHf7v5AgfC7qcO3-DKmjI0MmpzIY" />
              <img alt="Member" className="w-7 h-7 rounded-md border border-white" referrerPolicy="no-referrer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP1cVR8xFXCiHSSWJECwcFGtkW9pOFsbvHGWfPo_NM9mFe4Zb4K3eNek8a43NFJ_FrHb3nTQCaafRLyWt8yrDXUEOcvozp2LuxaqS2pRjX-FP3rzxJc7kMvCYCv-mrf-UQwGU-23Rl7DW4CkZfmrXQQ5sFusuAxkTrmrFKiD2qtuo5cYWmTYrEWRwTLY5uO7M5RtAC032JFQNEgRvb7u4GAGvMb_nd134bDQLJTlmzV31YdwWIpOh0d5mtRLMUt6-KAh3tT6ZG9LY" />
              <img alt="Member" className="w-7 h-7 rounded-md border border-white" referrerPolicy="no-referrer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbPG8rIsElv35oQYEn0qskwOch1YcDm97w263dIUEzav4QgRzoOGE_COCe1dQjJS5DJD2G1eesS1YfBE3jqRmo9jv_yTNfH3Q90pcqAehM7EM55Ay9qmfzOy89A4hIvGD5jxbI50gXy2GQqEIClyPmq43BBV0HG1wQ_BJeOJ7QAI6-1gNkbbV2zo8p9NKp70JfiNNDMI-Yie9GLIcGVXy46E44ACCkk3ql8XjBQi69QsI3bbK7c-oPdSejKepYpmV4axU2AoXfuDc" />
              <div className="w-7 h-7 rounded-md bg-stone-100 border border-white flex items-center justify-center text-[9px] font-bold text-stone-500">+5</div>
            </div>
            <div className="flex gap-1.5">
              <span className="px-2 py-0.5 border border-stone-200 text-stone-600 bg-stone-50 text-[9px] font-bold rounded uppercase">Admin</span>
              <span className="px-2 py-0.5 border border-editorial-wine/20 text-editorial-wine bg-editorial-cream/50 text-[9px] font-bold rounded uppercase">Dev</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-extrabold text-stone-900 uppercase tracking-widest font-sans">Requirements &amp; Briefs</h3>
                <button onClick={() => alert('Drag and drop files to populate archives.')} className="text-editorial-wine hover:text-stone-900 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <a className="flex items-center justify-between p-3 bg-stone-50 hover:bg-white border border-stone-150 hover:border-editorial-gold/40 rounded-md transition-all duration-200 group" href="#" onClick={(e) => e.preventDefault()}>
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-stone-500" />
                    <div>
                      <p className="text-xs font-bold text-stone-900 font-serif">PRD: Core Database Spec</p>
                      <p className="text-[9px] font-mono text-stone-400">Archived 2h ago</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a className="flex items-center justify-between p-3 bg-stone-50 hover:bg-white border border-stone-150 hover:border-editorial-gold/40 rounded-md transition-all duration-200 group" href="#" onClick={(e) => e.preventDefault()}>
                  <div className="flex items-center gap-3">
                    <CloudRain className="w-4 h-4 text-stone-500" />
                    <div>
                      <p className="text-xs font-bold text-stone-900 font-serif">Ref: Design System Rules</p>
                      <p className="text-[9px] font-mono text-stone-400">Archived Yesterday</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-[10px] font-extrabold text-stone-900 uppercase tracking-widest font-sans mb-1">Project Throttling Velocity</h4>
                <p className="text-xs text-stone-500 mb-4 font-editorial">Tracking 24 strategic tokens active this period across clusters.</p>
                <div className="w-full bg-stone-100 h-1.5 rounded-full mb-2 overflow-hidden">
                  <div className="bg-editorial-wine h-full rounded-full transition-all duration-500" style={{ width: `${velocityProgress}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-stone-450 uppercase tracking-wider font-mono">
                  <span>{velocityProgress}% Complete</span>
                  <span>Target: Next Release</span>
                </div>
              </div>
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-editorial-wine/5 rounded-full pointer-events-none"></div>
            </div>
          </div>

          <div className="bg-stone-100 rounded-lg p-5 border border-stone-200">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-sm font-bold font-serif text-stone-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5 text-editorial-wine">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
                <span>Dispatch Board</span>
              </h3>
              <div className="flex gap-2">
                <button onClick={() => setColumnFilter(columnFilter === 'all' ? 'high' : 'all')} className={`px-2.5 py-1 text-[9px] font-bold border rounded bg-white transition-colors flex items-center gap-1 uppercase tracking-wider ${columnFilter === 'high' ? 'border-red-800 text-red-800' : 'border-stone-300 text-stone-600'}`} title="Filter high priority">
                  <Filter className="w-2.5 h-2.5" />
                  <span>{columnFilter === 'high' ? 'High Risk Only' : 'All Tasks'}</span>
                </button>
                <button onClick={handleAddNewTask} className="px-2.5 py-1 text-[9px] bg-editorial-wine border border-stone-950/20 hover:bg-stone-900 text-stone-100 font-bold rounded flex items-center gap-1 transition-colors uppercase tracking-wider">
                  <Plus className="w-2.5 h-2.5" />
                  <span>Add Token</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-sans flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full"></span>
                    Available
                  </span>
                  <span className="px-1.5 py-0.2 font-mono bg-stone-200 border border-stone-300 rounded text-[9px] font-bold text-stone-600">{availableCol.length}</span>
                </div>
                {availableCol.map((tk) => (
                  <div key={tk.id} className="bg-white border border-stone-250 rounded-md p-4 shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-stone-400 transition-all flex flex-col justify-between">
                    <div>
                      <p className="text-[9px] font-mono text-stone-400 mb-1">{tk.code}</p>
                      <h5 className="text-xs font-serif font-bold text-stone-900 mb-3 leading-tight leading-relaxed">{tk.title}</h5>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`px-1.5 py-0.2 text-[8px] font-bold border rounded uppercase tracking-wider ${tk.priority.includes('High') ? 'bg-red-50 text-red-800 border-red-200' : 'bg-stone-50 text-stone-600 border-stone-200'}`}>
                        {tk.priority.includes('High') ? 'High' : 'Normal'}
                      </span>
                      <button onClick={() => handleMoveToken(tk.id, 'in_progress')} className="w-6 h-6 flex items-center justify-center bg-editorial-wine text-white rounded hover:bg-stone-900 transition-colors" title="Acquire Token">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-sans flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-editorial-gold rounded-full animate-pulse"></span>
                    In Progress
                  </span>
                  <span className="px-1.5 py-0.2 font-mono bg-stone-200 border border-stone-300 rounded text-[9px] font-bold text-stone-600">{progressCol.length}</span>
                </div>
                {progressCol.map((tk) => (
                  <div key={tk.id} className="bg-white border-l-4 border-l-editorial-wine border border-stone-250 rounded-md p-4 shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-stone-450 transition-all flex flex-col justify-between">
                    <div>
                      <p className="text-[9px] font-mono text-stone-450 mb-1">{tk.code}</p>
                      <h5 className="text-xs font-serif font-bold text-stone-900 mb-3 leading-tight leading-relaxed">{tk.title}</h5>
                    </div>
                    <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-stone-50">
                      <div className="flex items-center gap-1 overflow-hidden max-w-[65%]">
                        <img alt="Assignee" className="w-4.5 h-4.5 rounded-md object-cover" referrerPolicy="no-referrer" src={tk.assignee?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpDK1cBpeD9dlaYcswiz_3n52_jnPu1ZOMetdxUi1RVPnOyjL7s6Jlkwg6EVKY1dOIGAIYV0HBcmjbXOMQTGHp11iZOfMC4bHb26b8tBa1boJymMS29fhzT23CBSufk1nHxiSGL14YmEf0kEsKKe54lpEajBKHIU7JGLvTHL-b4atJtLHHVEiWsx6_LNcbA0W-YOYWqKNcMiRWRkBFJRF4dW-5hS7qXfKq1g6BfsaSFfXqjR2kLwl5d5jQqJN34CUw3n8Wm6VBy9M'} />
                        <span className="text-[9px] font-bold text-stone-600 truncate">{tk.assignee?.name.split(' ')[0] || 'Alex'}</span>
                      </div>
                      <button onClick={() => handleMoveToken(tk.id, 'completed')} className="w-6 h-6 flex items-center justify-center bg-emerald-700 text-white rounded hover:bg-emerald-800 transition-colors" title="Sign off task">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-sans flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                    Completed
                  </span>
                  <span className="px-1.5 py-0.2 font-mono bg-stone-200 border border-stone-300 rounded text-[9px] font-bold text-stone-600">{completedCol.length}</span>
                </div>
                {completedCol.map((tk) => (
                  <div key={tk.id} className="bg-stone-50/80 border border-stone-200 rounded-md p-4 shadow-sm opacity-80 hover:opacity-100 transition-all flex flex-col justify-between">
                    <div>
                      <p className="text-[9px] font-mono text-stone-400 mb-1">{tk.code}</p>
                      <h5 className="text-xs font-serif font-bold text-stone-700 mb-3 leading-tight line-through opacity-70 leading-relaxed">{tk.title}</h5>
                    </div>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-stone-100">
                      <div className="flex items-center gap-1 overflow-hidden">
                        <img alt="Tester" className="w-4.5 h-4.5 rounded-md object-cover grayscale" referrerPolicy="no-referrer" src={tk.assignee?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0_bWxRztfV42w1DcNpdXQOSVKPfY6Jt2WyUfgB9M7bi-fm4wSSTj0nPYYTUH6RGdBPutWIVBzO1YoU5VRhqJSXthG_T8Nzj6bjozSdk8RjGoZr5sPaYdl5UorlU5gwXjfPlGwQmFUwsz_Z7q1a9_iYoyQDVbY7Pi0s8pYZnODd7wXfsbBLDfOvWpHKDcjNCVkX7ZOA8mgs9o3JNHpsD7u0i-VuKiOq-Q0CFyOBV3UBELpY1eDDwT53pCe46G4oTVBNZHe1yFtbs'} />
                        <span className="text-[9px] font-medium text-stone-500 truncate">{tk.assignee?.name.split(' ')[0] || 'Tester'}</span>
                      </div>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 space-y-6">
          <div className="bg-white border border-stone-200 rounded-lg flex flex-col h-[520px] overflow-hidden shadow-[0_1px_3px_rgba(28,25,23,0.01)]">
            <div className="p-4 border-b border-stone-200 bg-stone-50/80">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-editorial-wine" />
                <span>WORKSPACE COMMUNICATION</span>
              </h3>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
              {discussions.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                  <img alt={msg.author} className="w-6 h-6 rounded-md flex-shrink-0 border border-stone-200 object-cover" referrerPolicy="no-referrer" src={msg.avatarUrl} />
                  <div className={`max-w-[80%] ${msg.isMe ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-1.5 mb-1 justify-start">
                      <span className="font-bold text-stone-900 text-[10px]">{msg.author}</span>
                      <span className="text-[8px] font-mono text-stone-400">{msg.timestamp}</span>
                    </div>
                    <div className={`p-3 rounded-md text-[11px] leading-relaxed text-left border ${msg.isMe ? 'bg-editorial-wine text-stone-100 border-transparent rounded-tr-none font-sans' : 'bg-stone-50 text-stone-800 border-stone-200 rounded-tl-none font-editorial'}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-200 bg-stone-50 flex gap-2">
              <input type="text" placeholder="Submit dispatch message..." className="flex-1 bg-white border border-stone-250 px-3 py-2 rounded-md font-sans text-xs outline-none focus:border-editorial-wine focus:ring-1 focus:ring-editorial-gold text-stone-900" value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} />
              <button type="submit" className="px-3 bg-editorial-wine text-white rounded-md hover:bg-stone-900 transition-colors uppercase font-bold text-[10px] tracking-wide" title="Send Message">Send</button>
            </form>
          </div>
          <div className="bg-stone-50 border border-stone-200 p-5 rounded-lg">
            <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-[#1c1917] mb-3">Cluster Replication Logs</h4>
            <ul className="space-y-4 text-xs font-editorial">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-editorial-wine rounded-full mt-1.5 shrink-0"></span>
                <span className="text-stone-600 leading-relaxed">Sarah Chen is adjusting <span className="font-serif font-bold text-stone-900">Replication_V5.sql</span> container parameters.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 shrink-0"></span>
                <span className="text-stone-600 leading-relaxed">Jenkins dispatch pipeline status <span className="font-serif font-bold text-stone-900">#242-Deployment</span> is functional.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
