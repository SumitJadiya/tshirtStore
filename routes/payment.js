const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../middlewares/user')
const {
  sendStripeKey,
  sendRazorpayKey,
  captureStripePayment,
  captureRazorpayPayment,
} = require('../controllers/paymentController')

router.route('/stripeKey').get(isLoggedIn, sendStripeKey)
router.route('/razorpayKey').get(isLoggedIn, sendRazorpayKey)

router.route('/captureStripePayment').post(isLoggedIn, captureStripePayment)
router.route('/captureRazorpayPayment').post(isLoggedIn, captureRazorpayPayment)

module.exports = router
