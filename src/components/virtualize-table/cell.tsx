import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { match } from 'ts-pattern';

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
      {match(children)
        .with(null, () => 'NULL')
        .with(undefined, () => 'UNDEFINED')
        .with(NaN, () => 'NaN')
        .with(Infinity, () => 'Infinity')
        .with(-Infinity, () => '-Infinity')
        .with(0, () => '0')
        .with(1, () => '1')
        .otherwise(() => children)}
    </span>
  );
};
