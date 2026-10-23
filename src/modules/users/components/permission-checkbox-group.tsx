import React from 'react';
import { UserPermissions } from '@core/entities';
import { Eye, Upload, Edit3, Trash2, Download } from 'lucide-react';

interface PermissionCheckboxGroupProps {
  permissions: UserPermissions;
  onChange: (permissions: UserPermissions) => void;
  disabled?: boolean;
}

export function PermissionCheckboxGroup({
  permissions,
  onChange,
  disabled = false,
}: PermissionCheckboxGroupProps) {
  const togglePermission = (key: keyof UserPermissions) => {
    onChange({
      ...permissions,
      [key]: !permissions[key],
    });
  };

  const items: {
    key: keyof UserPermissions;
    title: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }[] = [
    {
      key: 'canView',
      title: 'ສິດທິເບິ່ງຂໍ້ມູນ (canView)',
      desc: 'ເບິ່ງລາຍການສັນຍາ, ນິຕິກຳ, ຄະດີຄວາມ ແລະ ເບິ່ງໄຟລ໌ແນບແບບ Inline Preview',
      icon: Eye,
      accentColor: 'text-blue-600',
    },
    {
      key: 'canUpload',
      title: 'ສິດທິສ້າງ ແລະ ອັບໂຫຼດ (canUpload)',
      desc: 'ສ້າງລາຍການໃໝ່ ແລະ ອັບໂຫຼດໄຟລ໌ແນບ PDF/ຮູບພາບ (≤ 25MB)',
      icon: Upload,
      accentColor: 'text-emerald-600',
    },
    {
      key: 'canEdit',
      title: 'ສິດທິແກ້ໄຂຂໍ້ມູນ (canEdit)',
      desc: 'ແກ້ໄຂລາຍລະອຽດ, ສະຖານະ, ມູນຄ່າການເງິນ ແລະ ຂໍ້ມູນທີ່ກ່ຽວຂ້ອງ',
      icon: Edit3,
      accentColor: 'text-amber-600',
    },
    {
      key: 'canDelete',
      title: 'ສິດທິລົບຂໍ້ມູນ (canDelete)',
      desc: 'ຍົກເລີກສັນຍາ ຫຼື ລົບຂໍ້ມູນອອກຈາກລະບົບ (Soft Delete)',
      icon: Trash2,
      accentColor: 'text-red-600',
    },
    {
      key: 'canDownload',
      title: 'ສິດທິດາວໂຫຼດໄຟລ໌ຕົ້ນສະບັບ (canDownload)',
      desc: 'ດາວໂຫຼດໄຟລ໌ເອກະສານສັນຍາ ຫຼື ສຳນວນຄະດີລົງເຄື່ອງ',
      icon: Download,
      accentColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
        ກຳນົດສິດທິລະອຽດ (Fine-Grained Permissions)
      </label>

      <div className="grid grid-cols-1 gap-2.5">
        {items.map((item) => {
          const isChecked = permissions[item.key];
          const Icon = item.icon;

          return (
            <label
              key={item.key}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                isChecked
                  ? 'bg-blue-50/50 border-blue-200'
                  : 'bg-surface border-border-line hover:border-slate-300'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => togglePermission(item.key)}
                disabled={disabled}
                className="mt-0.5 w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary/20 cursor-pointer"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${item.accentColor}`} />
                  <span className="text-xs font-bold text-text-primary">
                    {item.title}
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
