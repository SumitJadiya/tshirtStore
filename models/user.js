const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [40, 'Name should be under 40 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    validate: [validator.isEmail, 'Please enter email in correct format'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password should be aleast 6 char'],
    select: false,
  },
  role: {
    type: String,
    default: 'user',
  },
  photo: {
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

// encrypt password before save - Hooks
userSchema.pre('save', async function (next) {
  // this solves the problem of unnecessary encryption when password is not updated.
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 10)
})

// validate the password with passed on user password
userSchema.methods.isValidatedPassword = async function (passedPassword) {
  console.log(passedPassword)
  return await bcrypt.compare(passedPassword, this.password)
}

// create and return jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  })
}

// generate forgot password token (string)
userSchema.methods.getForgotPasswordToken = function () {
  // generate a long and random string
  const forgotToken = crypto.randomBytes(20).toString('hex')

  // getting a hash - this hash value will be stored in database
  this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex')

  // time of token
  this.forgotPasswordExpiry = Date.now() + process.env.FORGOT_PASSWORD_EXPIRY

  return forgotToken
}

module.exports = mongoose.model('User', userSchema)