const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromise')
const customError = require('../utils/customError')
const { cookieToken } = require('../utils/cookieToken')
const cloudinary = require('cloudinary').v2

exports.signup = BigPromise(async (req, res, next) => {
  if (!req.files) return next(new customError(res, 'Photo is required field!', 400))

  // grab all the info from json
  const { name, email, password } = req.body

  if (!email || !name || !password)
    return next(new customError(res, 'Please enter name, email and password', 400))

  let file = req.files.photo
  let result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: 'users',
    width: 150,
    crop: 'scale',
  })

  const user = await User.create({
    name,
    email,
    password,
    photo: { id: result.public_id, secure_url: result.secure_url },
  })

  cookieToken(user, res)
})

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password)
    return next(new customError(res, 'Please enter email and password', 400))

  // get user from db
  const user = await User.findOne({ email }).select('+password')

  console.log(user)

  // if user not found in db
  if (!user)
    return next(new customError(res, 'User not registered or email is incorrect!', 400))

  // check if password is correct
  const isPasswordCorrect = await user.isValidatedPassword(password)

  // handle incorrect password
  if (!isPasswordCorrect) {
    return next(
      new customError(res, 'User not registered or credentials are incorrect!', 400)
    )
  }

  cookieToken(user, res)
})
