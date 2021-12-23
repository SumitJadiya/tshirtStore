const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide product name'],
    trim: true,
    maxlength: [120, 'Product name should not exceed 120 chars'],
  },
  price: {
    type: Number,
    required: [true, 'please provide product price'],
    maxlength: [5, 'Product name should not exceed 5 digits'],
  },
  description: {
    type: String,
    required: [true, 'please provide product description'],
  },
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
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
    type: String,
    required: [true, 'please add a brand'],
  },
  stock: {
    type: Number,
    default: 0,
    required: [true, 'please add stock'],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
      type: {
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
