const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
   
  },
  description: {
    type: String,
   
  },
  category: {
    type: String,
    
  },
  origin: {
    type: String,
   
  },
  expiryDate: {
    type: Date,
  
  },
  unitInStock: {
    type: String,
   
  },
  image: [{
    type: String,
    
  }],
  price: {
    type: Number,
    
  },
  isListed: {
    type: Boolean,
    default: true
  },
  isDispatched: {
    type: Boolean,
    default: false
  },
  invoiceDispatched: {
    type: String
  },
  dispatchDate: {
    type: Date
  },
  expensePerUnit: {
    type: Number
  },
  offer: {
    type: Number
  },
  offerPrice: {
    type: Number
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
     
    },
    rating: {
      type: Number,
     
    }
  }]
});

module.exports = mongoose.model('product', productSchema);