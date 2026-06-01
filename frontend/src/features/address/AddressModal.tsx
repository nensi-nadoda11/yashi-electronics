import { X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Card } from '../../components/ui/Card'
import { cn } from '../../utils/cn'
import { getApiErrorMessage } from '../../lib/api-client'
import { AddressForm } from './AddressForm'
import {
  createEmptyAddressFormValues,
  validateAddressForm,
} from './address.validation'
import type { Address, AddressFormErrors, AddressFormValues, AddressUpsertPayload } from './address.types'

type AddressModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  address?: Address | null
  onClose: () => void
  onSubmit: (payload: AddressUpsertPayload) => Promise<unknown>
}

export function AddressModal({
  isOpen,
  mode,
  address = null,
  onClose,
  onSubmit,
}: AddressModalProps) {
  const [values, setValues] = useState<AddressFormValues>(createEmptyAddressFormValues(address))
  const [errors, setErrors] = useState<AddressFormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setValues(createEmptyAddressFormValues(address))
    setErrors({})
    setSubmitError('')
    setIsSubmitting(false)
  }, [address, isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) {
    return null
  }

  const handleFieldChange = <K extends keyof AddressFormValues>(
    field: K,
    value: AddressFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))

    setSubmitError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validation = validateAddressForm(values)
    setErrors(validation.errors)

    if (!validation.isValid) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await onSubmit(validation.payload)
      onClose()
    } catch (error) {
      setSubmitError(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
      onClick={() => {
        if (!isSubmitting) {
          onClose()
        }
      }}
      role="presentation"
    >
      <Card
        className={cn(
          'relative w-full max-w-3xl overflow-hidden p-6 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.45)]',
          'max-h-[calc(100vh-3rem)] overflow-y-auto',
        )}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-modal-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              {mode === 'create' ? 'New Address' : 'Edit Address'}
            </p>
            <h2 id="address-modal-title" className="text-2xl font-bold text-slate-950">
              {mode === 'create' ? 'Add delivery address' : 'Update delivery address'}
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-brand-200 hover:text-brand-700 disabled:opacity-60"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close address form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          <AddressForm
            values={values}
            errors={errors}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
            submitLabel={mode === 'create' ? 'Add Address' : 'Save Changes'}
          />
        </div>

        {submitError ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </div>
        ) : null}
      </Card>
    </div>
  )
}
