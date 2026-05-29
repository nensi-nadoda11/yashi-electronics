import { findActiveBrands } from './product.repository'

export const getBrands = async () => {
  return findActiveBrands()
}
