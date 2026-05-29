import { findActiveCategories } from './product.repository'

export const getCategories = async () => {
  return findActiveCategories()
}
