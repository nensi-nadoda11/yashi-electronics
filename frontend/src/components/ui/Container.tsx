import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1680px] px-3 sm:px-4 lg:px-6 xl:px-8', className)}
      {...props}
    />
  )
}
