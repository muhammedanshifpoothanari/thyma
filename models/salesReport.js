const mongoose=require('mongoose');

const salesSchema=new mongoose.Schema({
    invoice:{
        type:String
    },
    nameOfProduct:{
        type:String
    },
    productId:{
        type:String
    },
    pricePerUnit:{
        type:Number
    },
    payStatus:{
        type:String
    },
    delStatus:{
        type:String
    },
    quantiyOut:{
       type:Number
    },
    expensePerUnit:{
      type:Number
    },
    revenue:{
        type:Number
    },
    outcome:{
       type:String
    },
    date:{
        type:Date
    }
})
module.exports=mongoose.model('sales',salesSchema);