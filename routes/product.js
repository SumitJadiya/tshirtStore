const express = require('express')
const { testProduct } = require('../controllers/productController')
const { isLoggedIn, customRole } = require('../middlewares/user')

const router = express.Router()

router.route('/test').get(testProduct)

module.exports = router
