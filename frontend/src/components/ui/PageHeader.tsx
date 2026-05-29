import type { ReactNode } from 'react'
import { Container } from './Container'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <section className="py-10 sm:py-12">
      <Container className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              {eyebrow}
            </p>
          ) : null}
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {title}
            </h1>
            <p className="text-base leading-7 text-slate-600 sm:text-lg">
              {description}
            </p>
          </div>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </Container>
    </section>
  )
}
