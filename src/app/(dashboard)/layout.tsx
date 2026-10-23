import React from 'react';
import { MainLayout } from '@/presentation/layouts';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
