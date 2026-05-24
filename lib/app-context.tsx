'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Persona, Project, Token, Comment, UpdateLog } from './types';
import {
  INITIAL_PERSONAS,
  INITIAL_PROJECTS,
  INITIAL_TOKENS,
  INITIAL_DISCUSSIONS,
  INITIAL_UPDATES,
} from './data';

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  currentPersonaId: string;
  handleChangePersona: (id: string) => void;
  currentPersona: Persona;
  personas: Persona[];
  setPersonas: React.Dispatch<React.SetStateAction<Persona[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  tokens: Token[];
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>;
  discussions: Comment[];
  setDiscussions: React.Dispatch<React.SetStateAction<Comment[]>>;
  updates: UpdateLog[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (o: boolean) => void;
  handleToggleCheckIn: () => void;
  handleCompleteToken: (tokenId: string) => void;
  handleTakeToken: (tokenId: string) => void;
  handleLoginSuccess: (email: string) => void;
  handleLogout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPersonaId, setCurrentPersonaId] = useState<string>('alex');
  const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS);
  const [discussions, setDiscussions] = useState<Comment[]>(INITIAL_DISCUSSIONS);
  const [updates, setUpdates] = useState<UpdateLog[]>(INITIAL_UPDATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const currentPersona = personas.find(p => p.id === currentPersonaId) || personas[0];

  const handleToggleCheckIn = useCallback(() => {
    setPersonas(prev =>
      prev.map(p => {
        if (p.id === currentPersonaId) {
          return {
            ...p,
            checkedIn: !p.checkedIn,
            checkInTime: !p.checkedIn
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          };
        }
        return p;
      })
    );
  }, [currentPersonaId]);

  const handleChangePersona = useCallback((personaId: string) => {
    setCurrentPersonaId(personaId);
  }, []);

  const handleCompleteToken = useCallback((tokenId: string) => {
    setTokens(prev =>
      prev.map(t => {
        if (t.id === tokenId) {
          return { ...t, status: 'completed' as const };
        }
        return t;
      })
    );
  }, []);

  const handleTakeToken = useCallback(
    (tokenId: string) => {
      setTokens(prev =>
        prev.map(t => {
          if (t.id === tokenId) {
            return {
              ...t,
              status: 'in_progress' as const,
              assignee: {
                name: currentPersona.name,
                avatarUrl: currentPersona.avatarUrl,
              },
            };
          }
          return t;
        })
      );
    },
    [currentPersona]
  );

  const handleLoginSuccess = useCallback((_email: string) => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsLoggedIn(false);
    setSearchQuery('');
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        currentPersonaId,
        handleChangePersona,
        currentPersona,
        personas,
        setPersonas,
        projects,
        setProjects,
        tokens,
        setTokens,
        discussions,
        setDiscussions,
        updates,
        searchQuery,
        setSearchQuery,
        activeTab,
        setActiveTab,
        isCreateModalOpen,
        setIsCreateModalOpen,
        handleToggleCheckIn,
        handleCompleteToken,
        handleTakeToken,
        handleLoginSuccess,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
