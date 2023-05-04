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


const getOrigin = async (req, res) => {
    try {
      const origin = await origin.find();
      res.render('origins', { origin });
    } catch (err) {
      console.error(err);
    }
  };
  
  const getAddOrigin = (req, res) => {
    res.render('addOrigin');
  };



const getEditOrigin = async (req, res) => {
    try {
      const origin = await origin.findById(req.params.id);
      res.render('editOrigin', { origin });
    } catch (err) {
      console.error(err);
    }
  };


  const postAddOrigin= async (req, res) => {
    try {console.log('hihihih');
      const origins = new origin({
        name: req.body.name
      });
      await origins.save();
      console.log('hihihiihhihhihihi');
      res.redirect('/admin/origins');
    } catch (err) {
      console.error(err);
    }
  };
  
  const postEditOrigin = async (req, res) => {
    try {
      await origin.findByIdAndUpdate(req.params.id, { name: req.body.name });
      res.redirect('/admin/origins');
    } catch (err) {
      console.error(err);
    }
  };
  
  const deleteOrigin = async (req, res) => {
    try {
      await origins.findByIdAndDelete(req.params.id);
      res.redirect('/admin/origins');
    } catch (err) {
      console.error(err);
    }
  };
  








module.exports={

      getOrigin,
      getAddOrigin,
      postAddOrigin,
      postEditOrigin,
      deleteOrigin,
      getEditOrigin,
  }
  
  