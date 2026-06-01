import { CheckCircle2, Circle, Clock3, type LucideIcon } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { cn } from '../../utils/cn'
import type { OrderTimelineItem } from './orders.types'

type OrderTimelineProps = {
  timeline: OrderTimelineItem[]
}

const timelineIconStyles: Record<OrderTimelineItem['status'], string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  current: 'bg-brand-100 text-brand-700',
  pending: 'bg-slate-100 text-slate-400',
}

const timelineIcons: Record<OrderTimelineItem['status'], LucideIcon> = {
  completed: CheckCircle2,
  current: Clock3,
  pending: Circle,
}

const formatTimelineDate = (value?: string) => {
  if (!value) {
    return 'Date not available'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function OrderTimeline({ timeline }: OrderTimelineProps) {
  return (
    <div className="space-y-4">
      {timeline.map((item, index) => {
        const Icon = timelineIcons[item.status]

        return (
          <div key={`${item.label}-${index}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-full',
                  timelineIconStyles[item.status],
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              {index < timeline.length - 1 ? (
                <span className="mt-2 h-full min-h-10 w-px bg-slate-200" />
              ) : null}
            </div>

            <div className="min-w-0 flex-1 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-slate-950">{item.label}</h3>
                <Badge variant={item.status === 'completed' ? 'success' : item.status === 'current' ? 'brand' : 'neutral'}>
                  {item.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-600">{formatTimelineDate(item.date)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
