import { Currency } from '@core/entities';

/**
 * Formats a number with thousands separators (e.g. 1,500,000)
 */
export function formatNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return '0';
  }
  return new Intl.NumberFormat('en-US').format(Number(value));
}

/**
 * Formats monetary amounts with currency symbol and appropriate decimal handling
 */
export function formatCurrency(
  amount: number | string | undefined | null,
  currency: Currency = Currency.LAK
): string {
  const num = Number(amount) || 0;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currency === Currency.LAK ? 0 : 2,
    maximumFractionDigits: currency === Currency.LAK ? 0 : 2,
  }).format(num);

  switch (currency) {
    case Currency.USD:
      return `$ ${formatted}`;
    case Currency.CNY:
      return `¥ ${formatted}`;
    case Currency.LAK:
    default:
      return `₭ ${formatted}`;
  }
}

/**
 * Formats dates into human-readable Lao / ISO display (DD/MM/YYYY)
 */
export function formatDate(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '-';
  }
}
