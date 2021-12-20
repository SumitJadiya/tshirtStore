const express = require('express')
const {
  addProduct,
  getAllProducts,
  adminGetAllProducts,
  getSingleProduct,
} = require('../controllers/productController')
const { isLoggedIn, customRole } = require('../middlewares/user')

const router = express.Router()

// user route
router.route('/products').get(getAllProducts)
router.route('/product/:id').get(getSingleProduct)

// admin route
router.route('/admin/products').get(isLoggedIn, customRole('admin'), adminGetAllProducts)
router.route('/admin/product/add').post(isLoggedIn, customRole('admin'), addProduct)

module.exports = router
