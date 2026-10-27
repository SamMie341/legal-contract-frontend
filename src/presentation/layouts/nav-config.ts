import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Scale,
  Users,
  Building2,
  History,
  FilePlus,
  ClockAlert,
} from 'lucide-react';
import { UserPermissions } from '@core/entities';
import { DivisionAccessKey } from '@/presentation/hooks';

export interface NavItem {
  title: string;
  titleEn: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPermission?: keyof UserPermissions;
  adminOnly?: boolean;
  badge?: string;
  badgeColor?: string;
}

export interface NavGroup {
  groupName: string;
  groupNameEn: string;
  adminOnly?: boolean;
  divisionKey?: DivisionAccessKey;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    groupName: 'ພາບລວມລະບົບ',
    groupNameEn: 'Overview',
    items: [
      {
        title: 'ໜ້າຫຼັກ (Dashboard)',
        titleEn: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    groupName: '1. ພະແນກສັນຍາທົ່ວໄປ',
    groupNameEn: 'General Contracts Division',
    divisionKey: 'CONTRACTS',
    items: [
      {
        title: 'ສະຖິຕິສັນຍາ (Dashboard)',
        titleEn: 'Contracts Dashboard',
        href: '/contracts/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'ລາຍການສັນຍາທັງໝົດ',
        titleEn: 'All Contracts',
        href: '/contracts',
        icon: Briefcase,
      },
      {
        title: 'ສັນຍາໃກ້ໝົດອາຍຸ (≤ 60 ວັນ)',
        titleEn: 'Expiring Soon',
        href: '/contracts?status=EXPIRING_SOON',
        icon: ClockAlert,
        badgeColor: 'bg-amber-500 text-white',
      },
      {
        title: 'ສ້າງສັນຍາໃໝ່',
        titleEn: 'New Contract',
        href: '/contracts/create',
        icon: FilePlus,
        requiredPermission: 'canUpload',
      },
    ],
  },
  {
    groupName: '2. ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ',
    groupNameEn: 'Legal Affairs & Dispute Resolution Division',
    divisionKey: 'LEGAL_AND_DISPUTE',
    items: [
      {
        title: 'ສະຖິຕິນິຕິກຳ (Dashboard)',
        titleEn: 'Documents Dashboard',
        href: '/legal-documents/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'ຄຸ້ມຄອງນິຕິກຳ ແລະ ລະບຽບການ',
        titleEn: 'Regulations & Notices',
        href: '/legal-documents',
        icon: FileText,
      },
      {
        title: 'ສະຖິຕິຄະດີ (Dashboard)',
        titleEn: 'Cases Dashboard',
        href: '/legal-cases/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'ສຳນວນຄະດີ ແລະ ຂໍ້ຂັດແຍ່ງ',
        titleEn: 'Legal Cases & Disputes',
        href: '/legal-cases',
        icon: Scale,
      },
    ],
  },
  {
    groupName: 'ການຕັ້ງຄ່າລະບົບ',
    groupNameEn: 'Administration',
    adminOnly: true,
    items: [
      {
        title: 'ຈັດການຜູ້ໃຊ້ງານ & ສິດທິ',
        titleEn: 'User Management',
        href: '/users',
        icon: Users,
        adminOnly: true,
      },
      {
        title: 'ຈັດການຫ້ອງການ / ຝ່າຍ',
        titleEn: 'Departments (HRM)',
        href: '/departments',
        icon: Building2,
        adminOnly: true,
      },
      {
        title: 'ປະຫວັດການດຳເນີນງານ (Audit Logs)',
        titleEn: 'Audit Logs',
        href: '/audit-logs',
        icon: History,
        adminOnly: true,
      },
    ],
  },
];
