'use client';

import React, { useState } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/app-context';

export default function Header() {
  const {
    searchQuery,
    setSearchQuery,
    currentPersona,
    personas,
    handleToggleCheckIn,
    handleChangePersona,
    activeTab,
    setActiveTab,
  } = useApp();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2000);
  };

  const dummyNotifications = [
    { id: 1, title: 'Database switchover', body: 'Sarah merged PRD database replication strategy', time: '10m ago', unread: true },
    { id: 2, title: 'Active Token Staged', body: 'PRJ-109 WCAG Accessibility Audit Staged on Core UI', time: '45m ago', unread: true },
    { id: 3, title: 'Check-In reminder', body: 'Check-in period closes soon for your region', time: '1h ago', unread: false },
  ];

  return (
    <header className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-8 h-auto md:h-16 sticky top-0 bg-editorial-paper/90 backdrop-blur-md z-40 border-b border-stone-200 gap-4 py-3 md:py-0 text-stone-900 font-sans">
      {showToast && (
        <div className="fixed top-20 right-8 bg-stone-900 text-stone-100 border border-stone-800 px-4 py-2 text-xs font-semibold rounded-md shadow-lg flex items-center gap-2 z-[99] animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-editorial-gold" />
          <span className="font-serif italic">{showToast}</span>
        </div>
      )}

      <div className="flex items-center gap-6 w-full md:w-auto flex-1">
        <div className="relative w-full max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-md focus:border-editorial-gold focus:ring-1 focus:ring-editorial-gold focus:bg-white transition-all text-xs outline-none text-stone-900 placeholder:text-stone-455"
            placeholder="Search terminal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <nav className="hidden md:flex gap-6">
          {['Overview', 'Reports', 'Schedule'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                triggerToast(`Switched active tab to ${tab}`);
              }}
              className={`text-xs font-bold uppercase tracking-wider pb-1 transition-all border-b-2 ${
                activeTab === tab
                  ? 'text-editorial-wine border-editorial-wine font-extrabold'
                  : 'text-stone-500 border-transparent hover:text-stone-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-end">
        <button
          onClick={() => {
            handleToggleCheckIn();
            triggerToast(currentPersona.checkedIn ? 'Checked out successfully' : 'Checked in! Status: Active');
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold tracking-wider rounded-md transition-all shadow-sm uppercase border ${
            currentPersona.checkedIn
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-editorial-wine text-white hover:bg-stone-900 hover:border-stone-950 border-editorial-wine'
          }`}
        >
          {currentPersona.checkedIn ? (
            <>
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-ping"></span>
              <span>Online Terminal</span>
            </>
          ) : (
            <span>Connect Device</span>
          )}
        </button>

        <div className="flex items-center gap-1.5">
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowPersonaMenu(false);
              }}
              className="p-1.5 hover:bg-stone-100/80 border border-stone-200 rounded-md transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5 text-stone-500" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2.5 w-80 bg-white border border-stone-200 rounded-lg p-4 shadow-lg z-50 text-xs text-stone-900">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold uppercase tracking-wider text-stone-800 font-sans text-[10px]">Recent Dispatch</p>
                  <button onClick={() => triggerToast('Cleared all alerts')} className="text-[10px] text-editorial-wine font-bold uppercase tracking-wider hover:underline">Dismiss</button>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {dummyNotifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-md bg-stone-50 border border-stone-200/60 hover:border-stone-300 transition-all">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-stone-900 text-[11px] leading-tight">{n.title}</p>
                        <span className="text-[8px] font-mono text-stone-400">{n.time}</span>
                      </div>
                      <p className="text-stone-600 text-[10px] leading-relaxed">{n.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => triggerToast('Help system initialized')}
            className="p-1.5 hover:bg-stone-100/80 border border-stone-200 rounded-md transition-colors"
            title="Help Desk"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
          </button>
        </div>

        <div className="relative border-l border-stone-200 pl-3.5 flex items-center">
          <button
            onClick={() => {
              setShowPersonaMenu(!showPersonaMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 hover:bg-stone-50 p-1 rounded-md transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-md overflow-hidden border border-stone-200 bg-stone-100">
              <img alt={currentPersona.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" src={currentPersona.avatarUrl} />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-bold leading-none text-stone-900">{currentPersona.name}</p>
              <p className="text-[8px] font-bold text-stone-450 uppercase tracking-widest mt-0.5 leading-none">{currentPersona.roleType}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-stone-400 hidden sm:block" />
          </button>

          {showPersonaMenu && (
            <div className="absolute right-0 top-11 mt-1.5 w-60 bg-white border border-stone-200 rounded-lg p-3 shadow-lg z-50 text-stone-900">
              <p className="text-[8px] font-bold text-stone-450 uppercase tracking-widest px-2.5 mb-2 font-sans-expanded">Switch Active Identity</p>
              <div className="space-y-1">
                {personas.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      handleChangePersona(p.id);
                      setShowPersonaMenu(false);
                      triggerToast(`Identity shifted to ${p.name}`);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left transition-all ${
                      p.id === currentPersona.id
                        ? 'bg-stone-50 text-stone-900 border-l-2 border-editorial-wine rounded-l-none font-bold'
                        : 'hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <img alt={p.name} className="w-5.5 h-5.5 rounded-md border border-stone-200" referrerPolicy="no-referrer" src={p.avatarUrl} />
                    <div>
                      <p className="text-[11px] font-bold leading-tight">{p.name}</p>
                      <p className="text-[8px] text-stone-400 uppercase tracking-wider leading-none mt-0.5">{p.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
