import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export const TableCellCostume = ({
  children,
  className: c
}: {
  children: ReactNode;
  id: string;
  className?: string;
}) => {
  return (
    <span data-slot="grid-cell-content" className={cn('', c)}>
      {children || '-'}
    </span>
  );
};
