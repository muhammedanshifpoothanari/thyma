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
const showCheckoutPage = async(req, res) => {
    try{
      console.log(req.query);
      if(req.query.code&&req.query.discount){
        const coupon = await coupons.findOne({ code: req.query.code});
        const username = req.session.username;
        coupon.userRef.push(username);
      }
      console.log('hihihiih//////////////////////');
      const order_id = uuidv4();
      const username=req.session.username;
      console.log(username);
      const userSearchForVerify = await users.findOne({ name:username,is_varified:1})
      console.log(userSearchForVerify);
      const name=userSearchForVerify.name;
      const email=userSearchForVerify.email;
      const mobile=userSearchForVerify.mobile;
      const i=userSearchForVerify.addIndex;
      const address=userSearchForVerify.address[i];
      const wishedRef = await carts.find({ isOrdered: true,userRef:username }, { ref: 1, _id: 0});
      console.log(wishedRef);
      const cartItemIds = wishedRef.map((item) => {
        return new mongoose.Types.ObjectId(item.ref);
      });
      let discount = parseFloat(req.query.discount);
      if (isNaN(discount)) {
        discount = null;
      }
      const productsInCart = await products.find({ _id: { $in: cartItemIds } });
      const quantities = await carts.find({ ref:cartItemIds}, {quantity:1,_id:0});
      console.log(quantities); 
      // Combine products with quantities
      const combined = productsInCart.map((p, i) => ({ ...p.toObject(), quantity: quantities[i].quantity }));
      console.log(combined)
      const totals=req.query.total; 
      res.render('checkout',{total:totals,combined,name,email,mobile,address,order_id});
    }catch (error) {
         console.log(error);
    }
  };
module.exports={
    showCheckoutPage,
   
}