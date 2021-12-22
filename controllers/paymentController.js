const { nanoid } = require('nanoid')
const Razorpay = require('razorpay')
const BigPromise = require('../middlewares/bigPromise')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.sendStripeKey = BigPromise(async (req, res, next) => {
  res.status(200).json({
    key: process.env.STRIPE_API_KEY,
  })
})

exports.sendRazorpayKey = BigPromise(async (req, res, next) => {
  res.status(200).json({
    key: process.env.RAZORPAY_API_KEY,
  })
})

// implement stripe
exports.captureStripePayment = BigPromise(async (req, res, next) => {
  const { amount } = req.body

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'inr',

    // optional
    metadata: { integration_check: 'accept_a_payment' },
  })

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
    // optionally id can be included
  })
})

// implement razorpay
exports.captureRazorpayPayment = BigPromise(async (req, res, next) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  })

  const amount = req.body.amount

  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: nanoid(),
  }

  const myOrder = await instance.orders.create(options)

  res.status(200).json({
    success: true,
    amount,
    order: myOrder,
  })
})
