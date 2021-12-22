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
