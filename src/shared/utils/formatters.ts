import { CURRENCY } from '../../config/constants';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CURRENCY.CODE,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercent = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export const formatCompactCurrency = (amount: number): string => {
  if (Math.abs(amount) >= 1000000) {
    return `${CURRENCY.SYMBOL}${(amount / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1000) {
    return `${CURRENCY.SYMBOL}${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
};
