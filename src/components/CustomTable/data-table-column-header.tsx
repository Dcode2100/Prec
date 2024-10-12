import { Column } from '@tanstack/react-table'

import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className, 'text-xs')}>{title}</div>
  }

  return (
    <div className={cn('flex items-center text-nowrap  space-x-2', className)}>
      <span className="cursor-pointer text-xs">{title}</span>
    </div>
  )
}
