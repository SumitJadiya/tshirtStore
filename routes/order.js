const express = require('express')
const {
  createOrder,
  getOrderById,
  getAllOrdersForUser,
} = require('../controllers/orderController')
const router = express.Router()
const { isLoggedIn } = require('../middlewares/user')

router.route('/order/create').post(isLoggedIn, createOrder)
router.route('/order/:id').get(isLoggedIn, getOrderById)
router.route('/orders').get(isLoggedIn, getAllOrdersForUser)

module.exports = router
