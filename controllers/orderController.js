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

  if (
    !shippingInfo &&
    !orderItems &&
    !paymentInfo &&
    !taxAmount &&
    !shippingAmount &&
    !totalAmount
  ) {
    return next(new customError(res, 'Please enter valid values', 400))
  }

  orderItems.forEach(async (prod) => {
    if ((await updateProductStock(prod.product, prod.qty)) === null)
      return next(new customError(res, 'Please enter valid quantity', 400))
  })

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

  if (!order) return next(new customError(res, 'Order does not exist!', 400))

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

exports.getAllOrders = BigPromise(async (req, res, next) => {
  const orders = await Order.find()

  res.status(200).json({
    success: true,
    orders,
  })
})

exports.adminUpdateOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id)

  if (order.orderStatus === 'delivered') {
    return next(new customError(res, 'Order already marked for delivered', 400))
  }
  order.orderStatus = req.body.orderStatus

  order.orderItems.forEach(async (prod) => {
    if (
      orderStatus === 'delivered' &&
      (await updateProductStock(prod.product, prod.qty)) === null
    )
      return next(new customError(res, 'Please enter valid quantity', 400))
  })

  await order.save()

  res.status(200).json({
    success: true,
    order,
  })
})

exports.adminDeleteOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id)

  await order.remove()

  res.status(200).json({
    success: true,
    message: 'order deleted',
  })
})

async function updateProductStock(productId, quantity) {
  const product = await Product.findById(productId)

  if (product.stock < quantity) return null

  product.stock -= quantity

  await product.save({ validateBeforeSave: false })
}
