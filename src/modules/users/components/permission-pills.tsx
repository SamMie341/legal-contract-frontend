import React from 'react';
import { User } from '@core/entities';
import { ShieldCheck, Award, Sparkles } from 'lucide-react';
import { getAccessiblePillarsForUser } from '../utils/user-permissions.util';

interface PermissionPillsProps {
  user: User;
  onViewDetail?: () => void;
}

interface PillarPill {
  key: string;
  label: string;
  color: string;
}

const PILLAR_CONFIGS: {
  key: string;
  label: string;
  color: string;
  matches: (mods: string[]) => boolean;
}[] = [
  {
    key: 'CONTRACTS',
    label: 'ສັນຍາທົ່ວໄປ',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    matches: (mods) => mods.includes('CONTRACTS'),
  },
  {
    key: 'POWER_CONTRACTS',
    label: 'ສັນຍາໄຟຟ້າ',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    matches: (mods) => mods.includes('POWER_CONTRACTS'),
  },
  {
    key: 'LEGAL_AND_DISPUTE',
    label: 'ນິຕິກຳ & ແກ້ໄຂຂໍ້ຂັດແຍ່ງ',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    matches: (mods) => mods.includes('LEGAL_DOCUMENTS') || mods.includes('LEGAL_CASES'),
  },
];

export function PermissionPills({ user, onViewDetail }: PermissionPillsProps) {
  const roleName = String(user.role || '');

  if (roleName === 'ADMIN') {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <ShieldCheck className="w-3 h-3 text-purple-600" />
          <span>ສິດສູງສຸດ (Full Access)</span>
        </span>
      </div>
    );
  }

  if (roleName === 'DEPARTMENT_HEAD') {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Award className="w-3 h-3 text-amber-600" />
          <span>Audit ທຸກໂມດູນ (View & Download)</span>
        </span>
      </div>
    );
  }

  // Find modules user can view based on centralized permission resolution
  const accessible = getAccessiblePillarsForUser(user);

  const hasOverride = Boolean(user.modulePermissions && user.modulePermissions.length > 0);

  // Group into 3 Core Modules
  const matchedPillars = PILLAR_CONFIGS.filter((cfg) => cfg.matches(accessible));

  if (matchedPillars.length === 0) {
    return (
      <span className="text-[11px] text-text-muted italic">
        ບໍ່ມີສິດເຂົ້າເຖິງໂມດູນ
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {matchedPillars.map((p) => (
        <span
          key={p.key}
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${p.color}`}
        >
          {p.label}
        </span>
      ))}

      {hasOverride && (
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200"
          title="ກຳນົດສິດພິເສດສະເພາະຄົນ (Custom Override)"
        >
          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
          <span>Override</span>
        </span>
      )}
    </div>
  );
}
