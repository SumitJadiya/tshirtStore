require('dotenv').config()
const app = require('./app')
const connectWithDB = require('./config/db')

// Connect with database
connectWithDB()

app.listen(process.env.PORT, () => {
  console.log(`server is running at ${process.env.PORT}`)
})
