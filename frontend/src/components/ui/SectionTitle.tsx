import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface SectionTitleProps {
  title: string
  description: string
  eyebrow?: string
  action?: ReactNode
  className?: string
}

export function SectionTitle({
  title,
  description,
  eyebrow,
  action,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl space-y-3">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {title}
          </h2>
          <p className="text-base leading-7 text-slate-600">{description}</p>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
