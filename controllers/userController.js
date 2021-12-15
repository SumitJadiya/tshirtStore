const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromise')
const customError = require('../utils/customError')
const { cookieToken } = require('../utils/cookieToken')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2

exports.signup = BigPromise(async (req, res, next) => {
  let result

  if (req.files) {
    let file = req.files.photo
    result = await cloudinary.uploader.upload(file, {
      folder: 'users',
      width: 150,
      crop: 'scale',
    })
  }

  // grab all the info from json
  const { name, email, password } = req.body

  if (!email || !name || !password)
    return next(new customError('Please enter name, email and password', 400))

  const user = await User.create({
    name,
    email,
    password,
    photo: { id: result.public_id, secure_url: result.secure_url },
    role,
  })

  cookieToken(user, res)
})
