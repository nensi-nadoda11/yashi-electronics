import { Router } from 'express'
import { validate } from '../../middlewares/validate.middleware'
import { getBrandsController } from './brand.controller'
import { getCategoriesController } from './category.controller'
import { getProductBySlugController, getProductsController } from './product.controller'
import { productListQuerySchema } from './product.schemas'

export const catalogRouter = Router()

catalogRouter.get('/products', validate({ query: productListQuerySchema }), getProductsController)
catalogRouter.get('/products/:slug', getProductBySlugController)
catalogRouter.get('/categories', getCategoriesController)
catalogRouter.get('/brands', getBrandsController)
