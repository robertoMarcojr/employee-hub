'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export interface PermissionData {
  id: string;
  tagId: string;
  resource: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAssign: boolean;
}

export interface TagData {
  id: string;
  name: string;
  color: string;
}

const RESOURCES = [
  { key: 'users', label: 'Users' },
  { key: 'projects', label: 'Projects' },
  { key: 'tokens', label: 'Tokens' },
  { key: 'tags', label: 'Tags' },
];

const PERMISSIONS = [
  { key: 'canView' as const, label: 'View' },
  { key: 'canCreate' as const, label: 'Create' },
  { key: 'canEdit' as const, label: 'Edit' },
  { key: 'canDelete' as const, label: 'Delete' },
  { key: 'canAssign' as const, label: 'Assign' },
];

export default function PermissionsEditor({
  tag,
  initialPermissions,
}: {
  tag: TagData;
  initialPermissions: PermissionData[];
}) {
  const router = useRouter();
  const [permissions, setPermissions] = useState<PermissionData[]>(initialPermissions);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (resource: string, perm: keyof PermissionData) => {
    setPermissions(prev =>
      prev.map(p =>
        p.resource === resource
          ? { ...p, [perm]: !p[perm] }
          : p
      )
    );
  };

  const selectAll = (resource: string, checked: boolean) => {
    setPermissions(prev =>
      prev.map(p =>
        p.resource === resource
          ? { ...p, canView: checked, canCreate: checked, canEdit: checked, canDelete: checked, canAssign: checked }
          : p
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await Promise.all(
      permissions.map(p =>
        fetch(`/api/tags/${tag.id}/permissions`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resource: p.resource,
            canView: p.canView,
            canCreate: p.canCreate,
            canEdit: p.canEdit,
            canDelete: p.canDelete,
            canAssign: p.canAssign,
          }),
        })
      )
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-6 font-sans text-stone-900">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/admin/tags')} className="p-1.5 hover:bg-stone-100 rounded text-stone-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-bold">Tag Permissions</h1>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold inline-block mt-1" style={{ backgroundColor: tag.color + '20', color: tag.color, border: `1px solid ${tag.color}40` }}>
            #{tag.name}
          </span>
        </div>
      </div>

      <div className="text-[11px] text-stone-500 bg-stone-50 border border-stone-200 rounded-lg p-3">
        Set permissions for this tag. Users with this tag inherit the union of all their tags&apos; permissions.
      </div>

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-widest text-[9px] border-b border-stone-200">
            <tr>
              <th className="px-5 py-3">Resource</th>
              {PERMISSIONS.map(p => (
                <th key={p.key} className="px-4 py-3 text-center">{p.label}</th>
              ))}
              <th className="px-4 py-3 text-center">All</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {RESOURCES.map(r => {
              const perm = permissions.find(p => p.resource === r.key);
              const allOn = perm && perm.canView && perm.canCreate && perm.canEdit && perm.canDelete && perm.canAssign;
              return (
                <tr key={r.key} className="hover:bg-stone-50/70 transition-colors">
                  <td className="px-5 py-4 font-bold text-stone-700">{r.label}</td>
                  {PERMISSIONS.map(p => (
                    <td key={p.key} className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggle(r.key, p.key)}
                        className={`w-6 h-6 rounded border transition-all ${
                          perm?.[p.key]
                            ? 'bg-editorial-wine border-editorial-wine text-white'
                            : 'bg-white border-stone-300 hover:border-stone-400'
                        }`}
                      >
                        {perm?.[p.key] && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 mx-auto">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        )}
                      </button>
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => selectAll(r.key, !allOn)}
                      className={`w-6 h-6 rounded border transition-all ${
                        allOn
                          ? 'bg-stone-900 border-stone-900 text-white'
                          : 'bg-white border-stone-300 hover:border-stone-400'
                      }`}
                      title={allOn ? 'Deselect all' : 'Select all'}
                    >
                      {allOn && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 mx-auto">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center gap-4">
        {saved && <span className="text-emerald-700 text-xs font-bold">Permissions saved</span>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-editorial-wine hover:bg-stone-900 text-white px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : 'Save Permissions'}
        </button>
      </div>
    </div>
  );
}
