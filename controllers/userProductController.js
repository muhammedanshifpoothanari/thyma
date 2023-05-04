const users=require("../models/userModel");
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const products=require("../models/productModel");
const carts=require("../models/cartModel");
const orders=require("../models/orderModel");
const Orders=require("../models/orderModel");
const wishs=require("../models/wishModel");
const coupons=require("../models/coupenModel");
const Rate=require("../models/rateModel");
const Banner=require("../models/bannerModel");
const Count=require("../models/countModel");
const Category = require("../models/categoryModel");
const e = require("express");
const { default: mongoose } = require("mongoose");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
const mobileNumberRegex = /^\d{10}$/;
require('mongoose')

const { v4: uuidv4 } = require('uuid');
















const getProduct= async(req,res)=>{
    try {console.log('hi');
    const banners = await Banner.find();
    console.log(req.query)
       productId = req.query.productId; // Retrieve the product ID from the query parameters
    const product = await products.findById(productId); // Retrieve the product from MongoDB using Mongoose
   
    // 
    // 
      const rate = await Rate.find({product:productId})
    // 
    const userId = rate.map((item) => {
        return  item.userId
      });
  
  
      const userData = await users.find({ _id: { $in: userId  } },{name:1,_id:0});
   
     
     
      
      // Combine products with quantities
      const combined = rate.map((p, i) => ({ ...p.toObject(), name: userData[i].name}));  
    // 
      let avg
      const count = await Count.findOne({product:productId})
      if(count){
      let one=count.countOne;
      one=one*1; 
      let two=count.countTwo;
      two=two*2
      let three=count.countThree;
      three=three*3
      let four=count.countFour;
      four=four*3
      let five=count.countFive;
      five=five*5
       avg=(one+two+three+four+five)/5
      console.log(avg);
      avg=avg*5;
      }
     
     
  
    res.render('productDetails', { product,combined,count,avg,banners }); // Render the product details page using the EJS template
    } catch (error) {
      console.log(error);
    }
  };



  let productId

const getProductTwo=async(req,res)=>{
  try {console.log('hi');
      // Retrieve the product ID from the query parameters
  const product = await products.findById(productId); // Retrieve the product from MongoDB using Mongoose
  res.render('productDetails', { product }); // Render the product details page using the EJS template
  } catch (error) {
    console.log(error);
  }
};



  module.exports={
    getProduct,
    getProductTwo
}