import type { FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import type { AddressFormErrors, AddressFormValues } from './address.types'

type AddressFormProps = {
  values: AddressFormValues
  errors: AddressFormErrors
  onChange: <K extends keyof AddressFormValues>(field: K, value: AddressFormValues[K]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  isSubmitting?: boolean
  submitLabel: string
}

export function AddressForm({
  values,
  errors,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel,
}: AddressFormProps) {
  const inputClassName = 'text-sm'

  const fieldErrorClassName = 'mt-2 text-xs font-medium text-rose-600'
  const requiredLabel = (label: string) => (
    <span className="inline-flex items-center gap-1">
      <span>{label}</span>
      <span className="text-rose-600">*</span>
    </span>
  )

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Input
            id="address-full-name"
            label={requiredLabel('Full Name')}
            placeholder="Rahul Sharma"
            value={values.fullName}
            onChange={(event) => onChange('fullName', event.target.value)}
            className={inputClassName}
          />
          {errors.fullName ? <p className={fieldErrorClassName}>{errors.fullName}</p> : null}
        </div>
        <div>
          <Input
            id="address-mobile"
            label={requiredLabel('Mobile')}
            placeholder="9876543210"
            inputMode="numeric"
            value={values.mobile}
            onChange={(event) => onChange('mobile', event.target.value)}
            className={inputClassName}
          />
          {errors.mobile ? <p className={fieldErrorClassName}>{errors.mobile}</p> : null}
        </div>
        <div>
          <Input
            id="address-line-1"
            label={requiredLabel('Address Line 1')}
            placeholder="House no, street, area"
            value={values.addressLine1}
            onChange={(event) => onChange('addressLine1', event.target.value)}
            className={inputClassName}
          />
          {errors.addressLine1 ? <p className={fieldErrorClassName}>{errors.addressLine1}</p> : null}
        </div>
        <div>
          <Input
            id="address-line-2"
            label="Address Line 2"
            placeholder="Apartment, sector, locality"
            value={values.addressLine2}
            onChange={(event) => onChange('addressLine2', event.target.value)}
            className={inputClassName}
          />
          {errors.addressLine2 ? <p className={fieldErrorClassName}>{errors.addressLine2}</p> : null}
        </div>
        <div>
          <Input
            id="address-city"
            label={requiredLabel('City')}
            placeholder="Noida"
            value={values.city}
            onChange={(event) => onChange('city', event.target.value)}
            className={inputClassName}
          />
          {errors.city ? <p className={fieldErrorClassName}>{errors.city}</p> : null}
        </div>
        <div>
          <Input
            id="address-state"
            label={requiredLabel('State')}
            placeholder="Uttar Pradesh"
            value={values.state}
            onChange={(event) => onChange('state', event.target.value)}
            className={inputClassName}
          />
          {errors.state ? <p className={fieldErrorClassName}>{errors.state}</p> : null}
        </div>
        <div>
          <Input
            id="address-pincode"
            label={requiredLabel('Pincode')}
            placeholder="201309"
            inputMode="numeric"
            value={values.pincode}
            onChange={(event) => onChange('pincode', event.target.value)}
            className={inputClassName}
          />
          {errors.pincode ? <p className={fieldErrorClassName}>{errors.pincode}</p> : null}
        </div>
        <div>
          <Input
            id="address-landmark"
            label="Landmark (optional)"
            placeholder="Near metro station"
            value={values.landmark}
            onChange={(event) => onChange('landmark', event.target.value)}
            required={false}
            className={inputClassName}
          />
          {errors.landmark ? <p className={fieldErrorClassName}>{errors.landmark}</p> : null}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={values.isDefault}
          onChange={(event) => onChange('isDefault', event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-300"
        />
        Set as default address
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
