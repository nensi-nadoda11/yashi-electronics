import { LoaderCircle } from 'lucide-react'
import { Card } from './Card'
import { cn } from '../../utils/cn'

interface LoadingStateProps {
  title?: string
  description?: string
  cardCount?: number
  className?: string
}

export function LoadingState({
  title = 'Loading content',
  cardCount = 3,
  className,
}: LoadingStateProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-3 rounded-3xl border border-brand-100 bg-brand-50/70 px-5 py-4 text-brand-700">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        <p className="font-semibold">{title}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cardCount }).map((_, index) => (
          <Card key={index} className="animate-pulse space-y-4 p-5">
            <div className="h-44 rounded-3xl bg-slate-200" />
            <div className="h-4 w-24 rounded-full bg-slate-200" />
            <div className="h-6 w-3/4 rounded-full bg-slate-200" />
            <div className="h-4 w-full rounded-full bg-slate-200" />
            <div className="h-4 w-2/3 rounded-full bg-slate-200" />
          </Card>
        ))}
      </div>
    </div>
  )
}
