const express = require('express')
const { addProduct, getAllProducts } = require('../controllers/productController')
const { isLoggedIn, customRole } = require('../middlewares/user')

const router = express.Router()

// user route
router.route('/products').get(getAllProducts)

// admin route
router.route('/admin/product/add').post(isLoggedIn, customRole('admin'), addProduct)

module.exports = router
