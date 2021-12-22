const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },

  user: {
    type: mongoose.Schema.objectId, // or mongoose.Schema.Types.objectId
    ref: 'User',
    required: true,
  },

  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.objectId,
        ref: 'Product',
        required: true,
      },
    },
  ],

  paymentInfo: {
    id: {
      type: String,
    },
  },

  taxAmount: {
    type: Number,
    required: true,
  },
  shippingAmount: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    default: 'processing',
    enum: {
      values: ['processing', 'dispatched', 'delivered'],
      message:
        'please select category only from - short-sleeves, long-sleeves, sweat-shirt, hoodies',
    },
    required: true,
  },

  deliveredAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Order', orderSchema)
