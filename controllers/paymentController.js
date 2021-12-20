const BigPromise = require('../middlewares/bigPromise')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.sendStripeKey = BigPromise(async (re, res, next) => {
  res.status(200).json({
    stripeKey: process.env.STRIPE_API_KEY,
  })
})

exports.captureStripePayment = BigPromise(async (re, res, next) => {
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
