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






  const getCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.render('categories', { categories });
    } catch (err) {
      console.error(err);
    }
  };



  const postAddCategory = async (req, res) => {
    try {
      const category = new Category({
        name: req.body.name
      });
      await category.save();
      res.redirect('/admin/categories');
    } catch (err) {
      console.error(err);
    }
  };



const getEditCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.render('editCategory', { category });
  } catch (err) {
    console.error(err);
  }
};



const postEditCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { name: req.body.name });
    res.redirect('/admin/categories');
  } catch (err) {
    console.error(err);
  }
};




const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/admin/categories');
  } catch (err) {
    console.error(err);
  }
};



  const unlistcategory = async (req, res) => {
    const productId = req.query.id;
  
    try {
      const cat= await Category.findById(productId);
      if(cat.isListed===true){
        cat.isListed = false;
        await cat.save();
      }
      else{
        cat.isListed = true;
        await cat.save();
      }
      
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: err
      });
    }
  };


  const adminCouponAddLoad=async(req,res)=>{
    try {
       res.render('addCoupon')
    } catch (error) {
       console.log('error');
    }
  }



const insertCoupon = async (req, res) => {
  try {
    console.log(req.body);
    const { code, discount, expires,maxDiscount,maxPrice,minPrice,numberOfCoupon } = req.body;
    
    // Check if coupon with given code already exists
    const existingCoupon = await Coupons.findOne({ code: code });
    if (existingCoupon) {
      return res.render('addCoupon', { error: 'Coupon with this code already exists!' });
    }
    
    // Create new coupon instance
    const coupon = new Coupons({
      code,
      discount,
      expires,
      maxDiscount:maxDiscount,
      maxAmount:maxPrice,
      MinAmount:minPrice,
      noOfCoupon:numberOfCoupon
    });
    
    // Save new coupon to database
    await coupon.save();
    console.log(coupon)
    
    // Redirect to coupon list page
    res.render('adminHome');
  } catch (err) {
    console.error(err);
    res.render('error');
  }
};

const getAddCategory = (req, res) => {
  res.render('addCategory');
};
















module.exports={
  getAddCategory,
      adminCouponAddLoad,
      insertCoupon,
      getCategories,  
      postAddCategory,
      getEditCategory,
      postEditCategory,
      deleteCategory,    
      unlistcategory, 
  }