import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/70 bg-white/95 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.30)] backdrop-blur',
        className,
      )}
      {...props}
    />
  )
}
