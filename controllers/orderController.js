const Order = require('../models/order')
const Product = require('../models/product')
const BigPromise = require('../middlewares/bigPromise')
const customError = require('../utils/customError')

exports.createOrder = BigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body

  const { address, city, phoneNumber, postalCode, state, country } = shippingInfo

  const { name, qty, image, price, product } = orderItems

  if (
    !shippingInfo &&
    !orderItems &&
    !paymentInfo &&
    !taxAmount &&
    !shippingAmount &&
    !totalAmount
  ) {
    next(new customError(res, 'Please enter valid values', 400))
  }

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    user: req.user._id,
  })

  res.status(200).json({
    success: true,
    order,
  })
})

exports.getOrderById = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email role') // populate will drill down the json further

  if (!order) next(new customError(res, 'Order does not exist!', 400))

  res.status(200).json({
    success: true,
    order,
  })
})

exports.getAllOrdersForUser = BigPromise(async (req, res, next) => {
  const loggedInUser = req.user._id

  const order = await Order.find({ user: loggedInUser })

  if (!order) next(new customError(res, 'Order does not exist!', 400))

  res.status(200).json({
    success: true,
    order,
  })
})
