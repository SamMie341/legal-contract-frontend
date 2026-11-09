import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Scale,
  Users,
  ShieldCheck,
  Building2,
  History,
  FilePlus,
  ClockAlert,
  Zap,
  LifeBuoy,
} from 'lucide-react';
import { UserPermissions, SystemModuleKey } from '@core/entities';
import { DivisionAccessKey } from '@/presentation/hooks';

export interface NavItem {
  title: string;
  titleEn: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPermission?: keyof UserPermissions;
  adminOnly?: boolean;
  canManageUsersOnly?: boolean;
  badge?: string;
  badgeColor?: string;
}

export interface NavGroup {
  groupName: string;
  groupNameEn: string;
  adminOnly?: boolean;
  divisionKey?: DivisionAccessKey;
  systemModule?: SystemModuleKey;
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
    groupName: 'ພະແນກສັນຍາທົ່ວໄປ',
    groupNameEn: 'General Contracts Division',
    divisionKey: 'CONTRACTS',
    systemModule: 'CONTRACTS',
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
    groupName: 'ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ',
    groupNameEn: 'Legal Affairs & Dispute Resolution Division',
    divisionKey: 'LEGAL_AND_DISPUTE',
    systemModule: 'LEGAL_AND_DISPUTE',
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
    groupName: 'ພະແນກສັນຍາຊື້-ຂາຍໄຟຟ້າ',
    groupNameEn: 'Power Purchase & Sale Division',
    divisionKey: 'POWER_CONTRACTS',
    systemModule: 'POWER_CONTRACTS',
    items: [
      {
        title: 'ສະຖິຕິຊື້-ຂາຍໄຟ (Dashboard)',
        titleEn: 'Power Contracts Dashboard',
        href: '/power-contracts/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'ລາຍການສັນຍາຊື້-ຂາຍໄຟ',
        titleEn: 'All Power Contracts',
        href: '/power-contracts',
        icon: Zap,
      },
      {
        title: 'ສັນຍາໃກ້ໝົດອາຍຸ (≤ 60 ວັນ)',
        titleEn: 'Expiring Soon',
        href: '/power-contracts?status=EXPIRING_SOON',
        icon: ClockAlert,
        badgeColor: 'bg-amber-500 text-white',
      },
      {
        title: 'ສ້າງສັນຍາໃໝ່',
        titleEn: 'New Power Contract',
        href: '/power-contracts/create',
        icon: FilePlus,
        requiredPermission: 'canUpload',
      },
    ],
  },
  {
    groupName: 'ການຕັ້ງຄ່າລະບົບ',
    groupNameEn: 'Administration',
    items: [
      {
        title: 'ຈັດການບົດບາດ & ສິດ (Roles)',
        titleEn: 'Roles Management',
        href: '/roles',
        icon: ShieldCheck,
        adminOnly: true,
      },
      {
        title: 'ຈັດການຜູ້ໃຊ້ງານ & ສິດທິ',
        titleEn: 'User Management',
        href: '/users',
        icon: Users,
        canManageUsersOnly: true,
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
  {
    groupName: 'ສູນຊ່ວຍເຫຼືອ',
    groupNameEn: 'Support & Help',
    items: [
      {
        title: 'ຊ່ວຍເຫຼືອ & ແຈ້ງບັນຫາ',
        titleEn: 'Help & Support',
        href: '/support',
        icon: LifeBuoy,
      },
    ],
  },
];
