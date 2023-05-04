const mongoose = require('mongoose');


const couponSchema = new mongoose.Schema({
  code: {
    type: String
    
  },
  discount: {
    type:Number 
  },
  expires: {
    type:Date
  },
  maxAmount:{
    type:Number
  },
  MinAmount:{
    type:Number
  },
  noOfCoupon:{
    type:Number,
    requied:true
  },
  maxDiscount:{
    type:Number
  },
  userRef:[{
    type:String
  }],
  isListed: {
    type: Boolean,
    default: true
}
});

module.exports = mongoose.model('Coupon', couponSchema);

