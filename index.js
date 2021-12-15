require('dotenv').config()
const app = require('./app')
const connectWithDB = require('./config/db')
const cloudinary = require('cloudinary')

// Connect with database
connectWithDB()

// cloudinary config goes here
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

app.listen(process.env.PORT, () => {
  console.log(`server is running at ${process.env.PORT}`)
})
