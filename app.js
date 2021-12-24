const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const app = express()

// for swagger documentation
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocument = yaml.load('./swagger/swagger.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// regular middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// cookie and file middleware
app.use(cookieParser())
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
)

// temp check
// app.set('view engine', 'ejs')

// morgan middleware
app.use(morgan('tiny'))

// import all routes
const home = require('./routes/home')
const user = require('./routes/user')
const order = require('./routes/order')
const product = require('./routes/product')
const payment = require('./routes/payment')

// router middleware
app.use('/api/v1', home)
app.use('/api/v1', user)
app.use('/api/v1', product)
app.use('/api/v1', payment)
app.use('/api/v1', order)

// export app js
module.exports = app
