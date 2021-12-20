const express = require('express')
const {
  addProduct,
  getAllProducts,
  adminGetAllProducts,
  getSingleProduct,
  adminUpdateSingleProduct,
} = require('../controllers/productController')
const { isLoggedIn, customRole } = require('../middlewares/user')

const router = express.Router()

// user route
router.route('/products').get(getAllProducts)
router.route('/product/:id').get(getSingleProduct)

// admin route
router.route('/admin/products').get(isLoggedIn, customRole('admin'), adminGetAllProducts)
router.route('/admin/product/add').post(isLoggedIn, customRole('admin'), addProduct)
router
  .route('/admin/product/update')
  .post(isLoggedIn, customRole('admin'), adminUpdateSingleProduct)

module.exports = router
