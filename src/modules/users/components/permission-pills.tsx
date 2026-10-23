import React from 'react';
import { User } from '@core/entities';
import { Eye, Upload, Edit3, Trash2, Download } from 'lucide-react';

interface PermissionPillsProps {
  user: User;
}

export function PermissionPills({ user }: PermissionPillsProps) {
  const permissions = [
    { key: 'canView', label: 'ເບິ່ງ', active: user.canView, icon: Eye },
    { key: 'canUpload', label: 'ອັບໂຫຼດ', active: user.canUpload, icon: Upload },
    { key: 'canEdit', label: 'ແກ້ໄຂ', active: user.canEdit, icon: Edit3 },
    { key: 'canDelete', label: 'ລົບ', active: user.canDelete, icon: Trash2 },
    { key: 'canDownload', label: 'ດາວໂຫຼດ', active: user.canDownload, icon: Download },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {permissions.map((p) => {
        const Icon = p.icon;
        if (!p.active) return null;

        return (
          <span
            key={p.key}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
            title={`ມີສິດ: ${p.label}`}
          >
            <Icon className="w-2.5 h-2.5 text-slate-500" />
            <span>{p.label}</span>
          </span>
        );
      })}
    </div>
  );
}
