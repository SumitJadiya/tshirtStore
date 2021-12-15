const express = require('express')
const { signup, login, logout, forgotPassword } = require('../controllers/userController')
const router = express.Router()

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotPassword').get(forgotPassword)
// router.route('/password/route/:token').get(forgotPassword)

module.exports = router
