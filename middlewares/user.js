const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromise')
const customError = require('../utils/customError')
const jwt = require('jsonwebtoken')

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  if (!req.cookies.token && !req.header('Authorization'))
    return next(new customError(res, 'Please login before accessing this page', 401))

  const token = req.cookies.token || req.header('Authorization').replace('Bearer ', '')

  if (!token)
    return next(new customError(res, 'Please login before accessing this page', 401))

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  req.user = await User.findById(decoded.id)

  next()
})

exports.customRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new customError(res, 'You are not allowed for this resouce', 403))

    next()
  }
}
