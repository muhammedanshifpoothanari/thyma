const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    is_admin:{
        type:Number,
        required:true
    },
    otp:{
        type:String
    },
    is_varified:{
        type:Number,
        default:0
    },
    wishList:{
        ref:{
            type:String
        }
    },
    otpExpiry:{
        type:Date
    },
    address:[{
        type:String
    }],
    addIndex:{
        type:Number,
      default:0
    },
    isSubscribed:[{
        type:String
    }],
    subDate:{
        type:Date
    }
})

module.exports=mongoose.model('user',userSchema);

