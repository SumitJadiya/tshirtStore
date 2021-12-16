const nodemailer = require('nodemailer')

const mailHelper = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  })

  const message = {
    from: '"Sumit Jadiya 👻" <jadiyaskj@gmail.com>', // sender address
    to: option.email, // list of receivers
    subject: option.subject, // Subject line
    text: option.message, // plain text body
  }

  // send mail with defined transport object
  const info = await transporter.sendMail(message)
}

module.exports = mailHelper
