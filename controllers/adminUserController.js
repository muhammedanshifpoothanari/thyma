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



const updateUser=async (req, res) => {
    try {
      const { name, email, password,mobile,is_admin} = req.body;
      await users.findByIdAndUpdate(req.params.id,{ name, email, password,mobile,is_admin}); 
      res.redirect('userList'); 
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };



  const unlistUser = async (req, res) => {
    const userId = req.query.id;
  
    try {
      const user= await users.findById(userId);
      if(user.is_varified===1){
        user.is_varified = 0;
        await user.save();
      }
      else{
        user.is_varified = 1;
        await user.save();
 
      }
     
      
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: err
      });
    }
  };


  const showUser=async (req, res) => {
    try {
      const Users = await users.find(); 
      res.render('userList', { users:Users}); 
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };














module.exports={
      showUser,
      unlistUser,
      updateUser,
  }
  
  