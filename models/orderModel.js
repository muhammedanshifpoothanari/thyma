const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    ref:{
        type:String
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    address:{
        type:String
    },
    phone:{
        type:Number
    },
    payMode:{
        type:String
    },
    total:{
        type:String
    },
    paymentStatus:{
        type:String
    },
    deliveryStatus:{
        type:String
    }
})
module.exports=mongoose.model('order',orderSchema);