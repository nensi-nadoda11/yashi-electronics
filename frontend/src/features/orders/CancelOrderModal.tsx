import { ConfirmDialog } from '../../components/common/ConfirmDialog'

type CancelOrderModalProps = {
  isOpen: boolean
  orderNumber?: string
  error?: string | null
  isLoading?: boolean
  onCancel: () => void
  onConfirm: () => void | Promise<void>
}

export function CancelOrderModal({
  isOpen,
  orderNumber,
  error,
  isLoading = false,
  onCancel,
  onConfirm,
}: CancelOrderModalProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Cancel this order?"
      description={
        orderNumber
          ? `Order ${orderNumber} will be marked as cancelled. This action is only available for pending payment orders.`
          : 'This order will be marked as cancelled. This action is only available for pending payment orders.'
      }
      confirmLabel="Cancel Order"
      loadingLabel="Cancelling..."
      cancelLabel="Keep Order"
      error={error}
      isLoading={isLoading}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
