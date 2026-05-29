export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

export const calculateDiscountPercentage = (mrp: number, price: number) =>
  Math.round(((mrp - price) / mrp) * 100)
