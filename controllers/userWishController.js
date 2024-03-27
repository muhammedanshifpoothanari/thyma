const users=require("../models/userModel");
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const products=require("../models/productModel");
const carts=require("../models/cartModel");
const orders=require("../models/orderModel");
const Orders=require("../models/orderModel");
const wishs=require("../models/wishModel");
const coupons=require("../models/coupenModel");
const Category = require("../models/categoryModel");
const e = require("express");
const { default: mongoose } = require("mongoose");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
const mobileNumberRegex = /^\d{10}$/;
require('mongoose')

const { v4: uuidv4 } = require('uuid');


const addToWish = async (req, res) => {
  try {
      const username = req.session.username;
     const existing =  await wishs.findOne({ ref: req.body.id }, {username: username});
     let wishData;
     if(!existing) {
      const wish = new wishs({
          ref: req.body.id,
          userRef: username
      });
       wishData = await wish.save();
    }
      if (wishData) {
          console.log(wishData);
          res.status(200).json({ success: true });
      } else {
          res.status(200).json({ success: true });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Server Error" });
  }
};

  
  const getWish = async (req, res) => {
    try {
      const wishedRef = await wishs.find({ isWished: 1 }, { ref: 1, _id: 0 });
      const cartItemIds = wishedRef.map((item) => {
        return new mongoose.Types.ObjectId(item.ref);
      });
  
      const product = await products.find({ _id: { $in: cartItemIds } });
  
    
        
        res.render('cart', { product });
      
    } catch (error) {
      console.log(error);
    }
  };

  const cancelFromWish=async(req,res)=>{
    try {
      console.log('hdsfjhdfvjhvdfhjdf');
      const cartItemId=req.body.cartItemId;
      const result = await wishs.deleteOne({ ref: cartItemId });
  
  if (result.deletedCount === 1) {
    console.log(`wish  with ref ${cartItemId} was deleted successfully.`);
  } else {
    console.log(`No wish document with ref ${cartItemId} was found.`);
  }
  
     res.redirect('/wish');
    } catch (error) {
      
    }
  }

    
module.exports={
   
    addToWish,
 
    getWish,
    cancelFromWish
}