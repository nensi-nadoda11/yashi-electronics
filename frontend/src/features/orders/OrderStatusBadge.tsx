import { Badge, type BadgeVariant } from '../../components/ui/Badge'
import { ORDER_STATUS_LABELS, type OrderStatus } from './orders.types'

const orderStatusVariants: Record<OrderStatus, BadgeVariant> = {
  pending_payment: 'warning',
  confirmed: 'brand',
  processing: 'brand',
  shipped: 'brand',
  delivered: 'success',
  cancelled: 'neutral',
  failed: 'danger',
}

type OrderStatusBadgeProps = {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <Badge variant={orderStatusVariants[status]}>{ORDER_STATUS_LABELS[status]}</Badge>
}
