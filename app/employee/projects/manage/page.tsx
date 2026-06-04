'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Pencil, Trash2, Users, LayoutList } from 'lucide-react';

interface UserInfo {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
}

interface TokenCounts {
  open?: number;
  in_progress?: number;
  done?: number;
  cancelled?: number;
  [key: string]: number | undefined;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdBy: string;
  creator: { id: string; name: string };
  _count: { members: number };
  tokenCounts: TokenCounts;
}

interface ProjectMember {
  id: string;
  userId: string;
  role: string;
  user: UserInfo;
}

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '', status: 'planning' });

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', status: '' });

  const [showMembers, setShowMembers] = useState<string | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [addMemberUserId, setAddMemberUserId] = useState('');

  const [showTokens, setShowTokens] = useState<string | null>(null);
  const [projectTokens, setProjectTokens] = useState<any[]>([]);

  const fetchProjects = () => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => { setProjects(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const fetchUsers = () => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name) return;
    setCreating(true);
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createForm),
    });
    setCreating(false);
    setShowCreate(false);
    setCreateForm({ name: '', description: '', status: 'planning' });
    fetchProjects();
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    await fetch(`/api/projects/${editingProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditingProject(null);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    fetchProjects();
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setEditForm({ name: p.name, description: p.description || '', status: p.status });
  };

  const openMembers = async (projectId: string) => {
    setShowMembers(projectId);
    const res = await fetch(`/api/projects/${projectId}/members`);
    const data = await res.json();
    setMembers(data);
    setAddMemberUserId('');
  };

  const handleAddMember = async () => {
    if (!addMemberUserId || !showMembers) return;
    await fetch(`/api/projects/${showMembers}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: addMemberUserId }),
    });
    setAddMemberUserId('');
    const res = await fetch(`/api/projects/${showMembers}/members`);
    setMembers(await res.json());
  };

  const handleRemoveMember = async (projectId: string, userId: string) => {
    await fetch(`/api/projects/${projectId}/members/${userId}`, { method: 'DELETE' });
    const res = await fetch(`/api/projects/${projectId}/members`);
    setMembers(await res.json());
  };

  const openTokens = async (projectId: string) => {
    setShowTokens(projectId);
    const res = await fetch(`/api/projects/${projectId}`);
    const data = await res.json();
    setProjectTokens(data.tokens || []);
  };

  const statusColor: Record<string, string> = {
    planning: 'bg-stone-200 text-stone-700',
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    completed: 'bg-blue-50 text-blue-700 border border-blue-200',
    archived: 'bg-stone-100 text-stone-500',
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">Manage Projects</h2>
            <p className="text-xs text-stone-500 mt-1">Create, edit and oversee all projects</p>
          </div>
        </div>
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-8 animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-stone-100 rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">Manage Projects</h2>
            <p className="text-xs text-stone-500 mt-1">Create, edit and oversee all projects</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="px-3 py-2 bg-editorial-wine text-white rounded-md text-xs font-bold hover:bg-stone-900 transition-colors flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-100">
                <th className="text-left px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-stone-500">Name</th>
                <th className="text-left px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-stone-500">Status</th>
                <th className="text-center px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-stone-500">Members</th>
                <th className="text-center px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-stone-500">Tokens</th>
                <th className="text-left px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-stone-500">Creator</th>
                <th className="text-right px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-stone-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} className="border-b border-stone-200 hover:bg-white/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-stone-900">{p.name}</div>
                    {p.description && <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{p.description}</div>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColor[p.status] || 'bg-stone-100 text-stone-600'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center font-mono text-stone-700">{p._count.members}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-stone-600">
                      <span className="text-stone-400">{p.tokenCounts.open || 0}O</span>
                      <span className="text-editorial-gold">{p.tokenCounts.in_progress || 0}P</span>
                      <span className="text-emerald-600">{p.tokenCounts.done || 0}D</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-stone-600">{p.creator.name}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openMembers(p.id)} className="p-1.5 hover:bg-stone-200 rounded transition-colors text-stone-500 hover:text-stone-900" title="Members">
                        <Users className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => openTokens(p.id)} className="p-1.5 hover:bg-stone-200 rounded transition-colors text-stone-500 hover:text-stone-900" title="View Tokens">
                        <LayoutList className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-stone-200 rounded transition-colors text-stone-500 hover:text-editorial-wine" title="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded transition-colors text-stone-500 hover:text-red-700" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-stone-400">
                    <p className="text-sm font-medium">No projects yet</p>
                    <p className="text-[11px] mt-1">Create your first project to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-[99] flex items-center justify-center p-4">
          <div className="bg-editorial-paper w-full max-w-md rounded-lg border border-stone-300 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-editorial-wine to-editorial-gold"></div>
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-md font-serif font-bold">New Project</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-stone-200 rounded transition-colors text-stone-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Name *</label>
                <input type="text" required value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Description</label>
                <textarea value={createForm.description} onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white resize-none h-20" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Status</label>
                <select value={createForm.status} onChange={e => setCreateForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white">
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 border border-stone-200 rounded-md text-stone-600 bg-white hover:bg-stone-100">Cancel</button>
                <button type="submit" disabled={creating} className="px-5 py-2 bg-editorial-wine hover:bg-stone-900 text-white rounded-md text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 flex items-center gap-2">
                  {creating && <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingProject && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-[99] flex items-center justify-center p-4">
          <div className="bg-editorial-paper w-full max-w-md rounded-lg border border-stone-300 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-editorial-wine to-editorial-gold"></div>
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-md font-serif font-bold">Edit Project</h2>
              <button onClick={() => setEditingProject(null)} className="p-1 hover:bg-stone-200 rounded transition-colors text-stone-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Name *</label>
                <input type="text" required value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Description</label>
                <textarea value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white resize-none h-20" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Status</label>
                <select value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white">
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 border border-stone-200 rounded-md text-stone-600 bg-white hover:bg-stone-100">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-editorial-wine hover:bg-stone-900 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMembers && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-[99] flex items-center justify-center p-4">
          <div className="bg-editorial-paper w-full max-w-lg rounded-lg border border-stone-300 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-editorial-wine to-editorial-gold"></div>
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-md font-serif font-bold">Project Members</h2>
              <button onClick={() => setShowMembers(null)} className="p-1 hover:bg-stone-200 rounded transition-colors text-stone-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="flex gap-2">
                <select value={addMemberUserId} onChange={e => setAddMemberUserId(e.target.value)} className="flex-1 px-3 py-2 border border-stone-250 rounded-md outline-none focus:border-editorial-wine text-stone-900 bg-white">
                  <option value="">Select user...</option>
                  {users.filter(u => !members.some(m => m.userId === u.id)).map(u => (
                    <option key={u.id} value={u.id}>{u.name}{u.email ? ` (${u.email})` : ''}</option>
                  ))}
                </select>
                <button onClick={handleAddMember} disabled={!addMemberUserId} className="px-4 py-2 bg-editorial-wine text-white rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-stone-900 transition-colors disabled:opacity-50">
                  Add
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {members.map(m => (
                  <div key={m.id} className="flex items-center justify-between px-3 py-2.5 bg-white border border-stone-200 rounded-md">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-600">
                        {m.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">{m.user.name}</p>
                        {m.user.email && <p className="text-[10px] text-stone-500">{m.user.email}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 px-1.5 py-0.5 bg-stone-100 rounded">{m.role}</span>
                      <button onClick={() => handleRemoveMember(showMembers, m.userId)} className="p-1 hover:bg-red-50 rounded text-stone-400 hover:text-red-600 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {members.length === 0 && (
                  <p className="text-center text-stone-400 py-4">No members yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showTokens && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-[99] flex items-center justify-center p-4">
          <div className="bg-editorial-paper w-full max-w-2xl rounded-lg border border-stone-300 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-editorial-wine to-editorial-gold"></div>
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-md font-serif font-bold">Project Tokens</h2>
              <button onClick={() => setShowTokens(null)} className="p-1 hover:bg-stone-200 rounded transition-colors text-stone-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left pb-2 text-[9px] font-bold uppercase tracking-wider text-stone-500">Title</th>
                    <th className="text-left pb-2 text-[9px] font-bold uppercase tracking-wider text-stone-500">Status</th>
                    <th className="text-left pb-2 text-[9px] font-bold uppercase tracking-wider text-stone-500">Priority</th>
                    <th className="text-left pb-2 text-[9px] font-bold uppercase tracking-wider text-stone-500">Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTokens.map((t: any) => (
                    <tr key={t.id} className="border-b border-stone-100">
                      <td className="py-3 pr-4 font-bold text-stone-900">{t.title}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          t.status === 'open' ? 'bg-stone-100 text-stone-600' :
                          t.status === 'in_progress' ? 'bg-amber-50 text-amber-700' :
                          t.status === 'done' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-stone-100 text-stone-500'
                        }`}>
                          {t.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-[9px] font-bold ${
                          t.priority === 'urgent' ? 'text-red-700' :
                          t.priority === 'high' ? 'text-amber-700' :
                          'text-stone-500'
                        }`}>{t.priority}</span>
                      </td>
                      <td className="py-3 text-stone-600">{t.assignee?.name || '—'}</td>
                    </tr>
                  ))}
                  {projectTokens.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-stone-400">No tokens for this project</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
