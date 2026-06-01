import { Badge, type BadgeVariant } from '../../components/ui/Badge'
import { PAYMENT_STATUS_LABELS, type PaymentStatus } from './orders.types'

const paymentStatusVariants: Record<PaymentStatus, BadgeVariant> = {
  pending: 'warning',
  paid: 'success',
  failed: 'danger',
  refunded: 'neutral',
}

type PaymentStatusBadgeProps = {
  status: PaymentStatus
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return <Badge variant={paymentStatusVariants[status]}>{PAYMENT_STATUS_LABELS[status]}</Badge>
}
