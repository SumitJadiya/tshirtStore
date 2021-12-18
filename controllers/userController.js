const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromise')
const customError = require('../utils/customError')
const { cookieToken } = require('../utils/cookieToken')
const cloudinary = require('cloudinary').v2
const mailHelper = require('../utils/emailHelper')
const crypto = require('crypto')
const user = require('../models/user')

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

  // find user in database
  const user = await User.findOne({ email })

  if (!user)
    return next(new customError(res, 'User not registered or email is incorrect!', 400))

  // get token from user model method
  const forgotToken = user.getForgotPasswordToken()

  await user.save({ validateBeforeSave: false })

  // generate URL
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

exports.passwordReset = BigPromise(async (req, res, next) => {
  const token = req.params.token
  const encryptedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
    encryptedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  })

  if (!user) return next(new customError(res, 'Token is invalid or expired!', 400))

  if (req.body.password != req.body.confirmPassword)
    return next(new customError(res, 'Both password do not match!', 400))

  user.password = req.body.password

  user.forgotPasswordToken = undefined
  user.forgotPasswordExpiry = undefined

  await user.save()

  // send a response or token
  cookieToken(user, res)
})

exports.getLoggedInUserDetail = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  // user.password = undefined
  res.status(200).json({
    success: true,
    user,
  })
})

exports.changePassword = BigPromise(async (req, res, next) => {
  const userId = req.user.id

  const user = await User.findById(userId).select('+password')

  const validateOldPassword = await user.isValidatedPassword(req.body.oldPassword)

  if (!validateOldPassword) return next(new customError('old password is incorrect', 400))

  user.password = req.body.newPassword

  await user.save()

  cookieToken(user, res)
})

exports.updateUserDetails = BigPromise(async (req, res, next) => {
  const { name, email } = req.body

  if (!email || !name)
    return next(
      new customError(res, 'Please enter name and email to update the profile', 400)
    )

  const newData = {
    name,
    email,
  }

  // check if user wants to update photo
  if (req.files) {
    const user = await User.findById(req.user.id)

    const imageId = user.photo.id
    // delete photo on cloudinary
    const resp = await cloudinary.uploader.destroy(imageId)

    let result = await cloudinary.uploader.upload(req.files.photo.tempFilePath, {
      folder: 'users',
      width: 150,
      crop: 'scale',
    })

    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    }
  }

  // find and update data
  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
})

exports.adminAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({})

  res.status(200).json({
    success: true,
    users,
  })
})

exports.managerAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({ role: 'user' })

  res.status(200).json({
    success: true,
    users,
  })
})

exports.adminGetSingleUser = BigPromise(async (req, res, next) => {
  let user
  const { id } = req.params

  // check if the id is 24 char long string as per mongodb standard
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    user = await User.findById(id)
  }

  if (!user) return next(new customError(res, 'No User Found', 404))

  res.status(200).json({
    success: true,
    user,
  })
})

exports.adminUpdateSingleUser = BigPromise(async (req, res, next) => {
  const { name, email, role } = req.body

  if (!email && !name && !role)
    return next(
      new customError(res, 'Please enter name, email or role to update the profile', 400)
    )

  const newData = {
    name,
    email,
    role,
  }

  // find and update data
  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
})

exports.adminDeleteSingleUser = BigPromise(async (req, res, next) => {
  const { id } = req.params

  const user = await User.find(id)

  if (!user) return next(new customError(res, 'User not found!', 404))

  await cloudinary.uploader.destroy(user.photo.id)

  await User.remove(id)

  res.status(200).json({
    success: true,
  })
})
