import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from './Card'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  action,
}: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center gap-4 p-8 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
        <Icon className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      {action}
    </Card>
  )
}
