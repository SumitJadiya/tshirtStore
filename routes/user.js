const express = require('express')
const {
  signup,
  login,
  logout,
  forgotPassword,
  passwordReset,
  getLoggedInUserDetail,
} = require('../controllers/userController')
const { isLoggedIn } = require('../middlewares/user')
const router = express.Router()

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotPassword').post(forgotPassword)
router.route('/password/reset/:token').post(passwordReset)
router.route('/userDashboard').get(isLoggedIn, getLoggedInUserDetail) // isLoggedIn middleware will be triggered first

module.exports = router
