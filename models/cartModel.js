const mongoose=require('mongoose');

const cartSchema=new mongoose.Schema({
    ref:{
        type:String
    },
    isOrdered:{
        type:Boolean,
        default:true
    },
    quantity:{
        type:Number,
        default:1
    },
    userRef:{
        type:String
    }
})
module.exports=mongoose.model('cart',cartSchema);