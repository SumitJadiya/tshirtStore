const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromise')
const customError = require('../utils/customError')
const { cookieToken } = require('../utils/cookieToken')
const cloudinary = require('cloudinary').v2
const mailHelper = require('../utils/emailHelper')

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

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(200).json({ success: true, message: 'logout success' })
})

exports.forgotPassword = BigPromise(async (req, res, next) => {
  //extract the email
  const { email } = req.body

  if (!email) return next(new customError(res, 'Please enter email and password', 400))

  const user = await User.findOne({ email })

  if (!user)
    return next(new customError(res, 'User not registered or email is incorrect!', 400))

  const forgotToken = user.getForgotPasswordToken()

  await user.save({ validateBeforeSave: false })

  const myUrl = `${req.protocol}://${req.get('host')}/password/reset/${forgotToken}`

  const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`

  try {
    const option = {
      email,
      subject: 'tshirtStore | password reset email',
      message,
    }
    await mailHelper(option)

    res.status(200).json({ success: true, message: 'Email sent successfully!' })
  } catch (err) {
    // flush the values in database
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    // save the object
    await user.save({ validateBeforeSave: false })
    return next(new customError(res, err.message, 500))
  }
})
