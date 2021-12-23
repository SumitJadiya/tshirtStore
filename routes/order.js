const express = require('express')
const {
  createOrder,
  getOrderById,
  getAllOrdersForUser,
  getAllOrders,
  adminUpdateOrder,
} = require('../controllers/orderController')
const router = express.Router()
const { isLoggedIn, customRole } = require('../middlewares/user')

router.route('/order/create').post(isLoggedIn, createOrder)
router.route('/order/:id').get(isLoggedIn, getOrderById)
router.route('/orders').get(isLoggedIn, getAllOrdersForUser)
router.route('/admin/orders').get(isLoggedIn, customRole('admin'), getAllOrders)
router.route('/admin/order/:id').get(isLoggedIn, customRole('admin'), adminUpdateOrder)

module.exports = router
