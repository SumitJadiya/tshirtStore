const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    name: String,
    required: [true, 'please provide product name'],
    trim: true,
    maxlength: [120, 'Product name should not exceed 120 chars'],
  },
  price: {
    name: Number,
    required: [true, 'please provide product price'],
    maxlength: [5, 'Product name should not exceed 5 digits'],
  },
  description: {
    name: String,
    required: [true, 'please provide product description'],
  },
  photos: [
    {
      id: {
        name: String,
        required: true,
      },
      secure_url: {
        name: String,
        required: true,
      },
    },
  ],
  category: {
    name: String,
    required: [
      true,
      'please select category from - short-sleeves, long-sleeves, sweat-shirt, hoodies',
    ],
    enum: {
      values: ['shortSleeves', 'longSleeves', 'sweatShirt', 'hoodies'],
      message:
        'please select category only from - short-sleeves, long-sleeves, sweat-shirt, hoodies',
    },
  },
  brand: {
    name: String,
    required: [true, 'please add a brand'],
  },
  stock: {
    name: Number,
    default: 0,
  },
  ratings: {
    name: Number,
    default: 0,
  },
  numOfReviews: {
    name: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Product', productSchema)
