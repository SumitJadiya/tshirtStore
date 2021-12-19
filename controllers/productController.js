const Product = require('../models/product')
const BigPromise = require('../middlewares/bigPromise')
const customError = require('../utils/customError')
const cloudinary = require('cloudinary').v2
const WhereClause = require('../utils/whereClause')

exports.addProduct = BigPromise(async (req, res, next) => {
  // image part
  let imageArray = []

  if (!req.files) return next(new customError(res, 'Images are required', 400))

  for (let index = 0; index < req.files.photos.length; index++) {
    let result = await cloudinary.uploader.upload(req.files.photos[index].tempFilePath, {
      folder: 'products',
    })

    imageArray.push({
      id: result.public_id,
      secure_url: result.secure_url,
    })
  }

  req.body.photos = imageArray
  req.body.user = req.user.id

  // data part
  const product = await Product.create(req.body)

  res.status(200).json({
    success: true,
    product,
  })
})

exports.getAllProducts = BigPromise(async (req, res, next) => {
  const resultPerPage = 6
  const totalProductCount = await Product.countDocuments()

  const products = new WhereClause(Product.find(), req.query).search().filter()

  const filteredProductNumber = products.length

  products.pager(resultPerPage)
  products = await products.base

  res.status(200).json({
    success: true,
    products,
    totalProductCount,
    filteredProductNumber,
    resultPerPage,
  })
})
