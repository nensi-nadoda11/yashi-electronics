import { CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from './Card'

interface ErrorStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function ErrorState({
  title,
  description,
  action,
}: ErrorStateProps) {
  return (
    <Card className="flex flex-col items-start gap-5 border-rose-100 bg-rose-50/70 p-8 text-left">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm">
        <CircleAlert className="h-7 w-7" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
        <p className="max-w-2xl text-base leading-7 text-slate-600">
          {description}
        </p>
      </div>
      {action}
    </Card>
  )
}
