const express = require('express')
const {
  signup,
  login,
  logout,
  forgotPassword,
  passwordReset,
  getLoggedInUserDetail,
  changePassword,
  updateUserDetails,
  adminAllUsers,
} = require('../controllers/userController')
const { isLoggedIn, customRole } = require('../middlewares/user')
const router = express.Router()

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotPassword').post(forgotPassword)
router.route('/password/reset/:token').post(passwordReset)
router.route('/userDashboard').get(isLoggedIn, getLoggedInUserDetail) // isLoggedIn middleware will be triggered first
router.route('/password/update').post(isLoggedIn, changePassword)
router.route('/userDashboard/update').post(isLoggedIn, updateUserDetails)
router.route('/admin/users').get(isLoggedIn, customRole('admin'), adminAllUsers)

module.exports = router
