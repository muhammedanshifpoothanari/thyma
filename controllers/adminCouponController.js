const users=require("../models/userModel");
const Banner=require("../models/bannerModel");
const carts=require("../models/cartModel");
const Orders=require("../models/orderModel");
const Sales=require("../models/salesReport");
const products=require("../models/productModel");
 const Coupons= require('../models/coupenModel');
const bcrypt=require('bcrypt');
const sharp= require('sharp');
const path = require('path');
const Category = require("../models/categoryModel");
const origin = require("../models/originModel");
const { default: mongoose } = require("mongoose");
const { render } = require("../routes/adminRoutes");


const showCoupon=async (req, res) => {
    try {console.log('test coupon show');
      const coupons = await Coupons.find();
      res.render('showCoupon', { coupons:coupons}); 
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  const deleteCoupon=async (req, res) => {
    try {
      await Coupon.findByIdAndDelete(req.params.id);
      res.redirect('showCoupon'); 
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }



  const createCoupon=async (req,res) => {
    try {console.log('inserted coupon');
      res.redirect('createCoupon'); 
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
  const unlistcoupon = async (req, res) => {
    const couponId = req.query.id;
  
    try {
      const coupon= await Coupons.findById(couponId);
      if(coupon.isListed===true){
        coupon.isListed = false;
        await coupon.save();
      }
      else{
        coupon.isListed = true;
        await coupon.save();
      }
      
      
      
  
      res.status(200).json({
        message: 'coupon unlisted successfully',
        product: coupon
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: err
      });
    }
  };






module.exports={
        unlistcoupon,
        showCoupon,
        deleteCoupon,
        createCoupon,
    }