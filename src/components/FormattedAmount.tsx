import React from 'react';
import { formatAmount, FormatAmountOptions } from '@/utils/amountFormatter';

interface FormattedAmountProps {
  amount: number | string | null | undefined;
  options?: Omit<FormatAmountOptions, 'locale'>;
}

export const FormattedAmount: React.FC<FormattedAmountProps> = ({ amount, options }) => {
    const locale = 'uk'

  return <>{formatAmount(amount, { ...options, locale })}</>;
};
