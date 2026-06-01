import { AlertTriangle, X } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'

type ConfirmDialogProps = {
  isOpen: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  error?: string | null
  isLoading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  error,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleEscape)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [isLoading, isOpen, onCancel])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
      onClick={() => {
        if (!isLoading) {
          onCancel()
        }
      }}
      role="presentation"
    >
      <Card
        className={cn(
          'w-full max-w-lg space-y-6 p-6 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.45)]',
          'max-h-[calc(100vh-3rem)] overflow-y-auto',
        )}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-brand-200 hover:text-brand-700 disabled:opacity-60"
            onClick={onCancel}
            disabled={isLoading}
            aria-label="Close confirmation dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h2 id="confirm-dialog-title" className="text-2xl font-bold text-slate-950">
            {title}
          </h2>
          <p className="text-base leading-7 text-slate-600">{description}</p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="danger" onClick={() => void onConfirm()} disabled={isLoading}>
            {isLoading ? 'Deleting...' : confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  )
}
