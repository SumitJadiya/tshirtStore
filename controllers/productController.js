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

  const productsObj = new WhereClause(Product.find(), req.query).search().filter()
  let products = await productsObj.base

  const filteredProductNumber = products.length

  productsObj.pager(resultPerPage)
  products = await productsObj.base.clone()

  res.status(200).json({
    success: true,
    products,
    totalProductCount,
    filteredProductNumber,
    resultPerPage,
  })
})

exports.getSingleProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) next(new customError(res, 'No product found with this ID', 401))

  res.status(200).json({
    success: true,
    product,
  })
})

exports.addReview = BigPromise(async (req, res, next) => {
  const { rating, comment, productId } = req.body

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  }

  const product = await findById(productId)

  const checkIfAlreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id
  )

  if (checkIfAlreadyReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id) {
        review.comment = comment
        review.rating = rating
      }
    })
  } else {
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
  }

  // adjust ratings
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

  // save
  await product.save({ validateBeforeSave: false })

  res.status(200).json({ success: true })
})

exports.adminUpdateSingleProduct = BigPromise(async (req, res, next) => {
  let product = await Product.findById(req.params.id)

  let imagesArray = []

  if (!product) next(new customError(res, 'No product found with this ID', 401))

  if (req.files) {
    // destroy existing image
    for (let index = 0; index < product.photos.length; index++)
      await cloudinary.uploader.destroy(product.photos[index].id)
  }

  for (let index = 0; index < product.photos.length; index++) {
    let result = await cloudinary.uploader.upload(req.files.photos[index].tempFilePath, {
      folder: 'products',
    })

    imagesArray.push({
      id: result.public_id,
      secure_url: result.secure_url,
    })
  }

  req.body.photos = imagesArray

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
    product,
  })
})

exports.adminDeleteSingleProduct = BigPromise(async (req, res, next) => {
  let product = await Product.findById(req.params.id)

  if (!product) next(new customError(res, 'No product found with this ID', 401))

  // destroy existing image
  for (let index = 0; index < product.photos.length; index++)
    await cloudinary.uploader.destroy(product.photos[index].id)

  await product.remove()

  res.status(200).json({
    success: true,
    message: 'product deleted successfully!',
  })
})

exports.adminGetAllProducts = BigPromise(async (req, res, next) => {
  const products = await Product.find()

  res.status(200).json({
    success: true,
    products,
  })
})
