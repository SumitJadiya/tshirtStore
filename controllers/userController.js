const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromise')
const customError = require('../utils/customError')
const { cookieToken } = require('../utils/cookieToken')

exports.signup = BigPromise(async (req, res, next) => {
  // grab all the info from json
  const { name, email, password } = req.body

  if (!email || !name || !password)
    return next(new customError('Please enter name, email and password', 400))

  const user = await User.create({
    name,
    email,
    password,
  })

  cookieToken(user, res)
})
