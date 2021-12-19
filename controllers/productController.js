const BigPromise = require('../middlewares/bigPromise')

exports.testProduct = (req, res) => {
  res.status(200).json({
    success: true,
    greeting: `Test Passed!`,
  })
}
