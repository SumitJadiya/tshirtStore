const express = require('express')
const { addProduct } = require('../controllers/productController')
const { isLoggedIn, customRole } = require('../middlewares/user')

const router = express.Router()

router.route('/test').post(addProduct)

module.exports = router
