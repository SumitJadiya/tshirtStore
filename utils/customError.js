class customError extends Error {
  constructor(res, message, code) {
    super(message)
    res.status(code)
  }
}

module.exports = customError
