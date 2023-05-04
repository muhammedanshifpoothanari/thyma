const mongoose=require('mongoose');

const wishSchema=new mongoose.Schema({
    ref:{
        type:String
    },
   isWished:{
    type:Number,
    default:1
   },
   userRef:{
       type:String
   }
})
module.exports=mongoose.model('wish',wishSchema);