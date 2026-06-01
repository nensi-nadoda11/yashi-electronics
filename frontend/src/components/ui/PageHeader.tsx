import type { ReactNode } from 'react'
import { Container } from './Container'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({
  eyebrow,
  title,
  actions,
}: PageHeaderProps) {
  return (
    <section className="py-7 sm:py-9">
      <Container className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-2">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h1>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </Container>
    </section>
  )
}
