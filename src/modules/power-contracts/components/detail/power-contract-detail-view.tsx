'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Paperclip,
  History,
  Edit2,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  usePowerContract,
  usePowerContractHistory,
  useDeletePowerContract,
} from '../../hooks/use-power-contracts';
import { PowerContractInfo } from './power-contract-info';
import { PowerContractAttachments } from './power-contract-attachments';
import { PowerContractHistory as PowerContractHistoryCard } from './power-contract-history';
import { usePermissions } from '@/presentation/hooks';
import { useRouter } from 'next/navigation';

interface PowerContractDetailViewProps {
  id: string;
}

type TabType = 'info' | 'attachments' | 'history';

export function PowerContractDetailView({ id }: PowerContractDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('info');

  const { data: contract, isLoading, error } = usePowerContract(id);
  const { data: historyLogs = [], isLoading: isLoadingHistory } =
    usePowerContractHistory(id);
  const deleteMutation = useDeletePowerContract();
  const { canEdit, canDelete } = usePermissions();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-28 bg-surface rounded-2xl border border-border-line animate-pulse" />
        <div className="h-64 bg-surface rounded-2xl border border-border-line animate-pulse" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="bg-surface p-12 rounded-2xl border border-border-line text-center shadow-xs">
        <p className="text-sm font-bold text-text-primary">
          ບໍ່ພົບຂໍ້ມູນສັນຍາຊື້-ຂາຍໄຟຟ້າ
        </p>
        <p className="text-xs text-text-secondary mt-1">
          ສັນຍານີ້ອາດຖືກລົບແລ້ວ ຫຼື ທ່ານບໍ່ມີສິດເຂົ້າເຖິງ
        </p>
        <Link
          href="/power-contracts"
          className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>ກັບຄືນໜ້າລາຍການ</span>
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm('ທ່ານຕ້ອງການລົບສັນຍານີ້ແທ້ຫຼືບໍ່?')) {
      await deleteMutation.mutateAsync(id);
      router.push('/power-contracts');
    }
  };

  const attachmentCount = contract.attachments?.length || 0;

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/power-contracts"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ກັບຄືນລາຍການສັນຍາຊື້-ຂາຍໄຟ</span>
        </Link>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Link
              href={`/power-contracts/${id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border-line bg-white hover:bg-slate-50 text-xs font-semibold text-text-primary transition-colors shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-600" />
              <span>ແກ້ໄຂ</span>
            </Link>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 transition-colors disabled:opacity-50"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>ລົບສັນຍາ</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'info'
              ? 'bg-white text-text-primary shadow-xs'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ຂໍ້ມູນສັນຍາ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('attachments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'attachments'
              ? 'bg-white text-text-primary shadow-xs'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Paperclip className="w-4 h-4" />
          <span>ໄຟລ໌ແນບ ({attachmentCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-white text-text-primary shadow-xs'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <History className="w-4 h-4" />
          <span>ປະຫວັດການແກ້ໄຂ</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'info' && (
        <PowerContractInfo
          contract={contract}
          onNavigateToAttachments={() => setActiveTab('attachments')}
        />
      )}

      {activeTab === 'attachments' && (
        <PowerContractAttachments
          powerContractId={contract.id}
          attachments={contract.attachments || []}
        />
      )}

      {activeTab === 'history' && (
        <PowerContractHistoryCard auditLogs={historyLogs} />
      )}
    </div>
  );
}
