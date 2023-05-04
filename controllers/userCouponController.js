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

const getCoupon = async (req, res) => {
    try {
      console.log('=========================');
      const code = req.body.code;
      const coupon = await coupons.findOne({ code: code, isListed: true });
      const username = req.session.username;
      console.log('===========================');
      if(coupon.userRef==username){
        console.log(username);
        console.log(coupon.userRef);
        res.send('Coupon already used');  
        console.log('========================');
      }
  
      else{
        console.log('==========/////==========////////====');
      if (coupon) {
        // Apply discount to cart items
        const cartItems = await carts.find({ isOrdered: true, ref: { $in: coupon.items } });
        const discount = coupon.discount;
        for (let i = 0; i < cartItems.length; i++) {
          const item = cartItems[i];
          const product = await products.findById(item.ref);
          item.price = product.price * (1 - discount);
          await item.save();
        }
        // Redirect to cart page with discount
        res.redirect('/cart?discount=' + discount);
      } else {
        res.send('Invalid coupon code');
      }
    }
     }
    catch (error) {
      console.log(error);
    }
  };
module.exports={
    getCoupon
}