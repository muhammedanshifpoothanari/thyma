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

const adminHomeLoad=async(req,res)=>{
    try {
       res.render('adminHome')
    } catch (error) {
       console.log('error');
    }
}


const adminLoginCheck=async(req,res)=>{
    try {console.log('hit');
        const name=req.body.name;
        const password=req.body.password;
        const adminDetails=await users.findOne({email:name});
        if(adminDetails){
            console.log(adminDetails);
            const passwordMatch=await bcrypt.compare(password,adminDetails.password)
            if(passwordMatch){
                if(adminDetails.is_admin===1){
                    req.session.adminName=name;
                    console.log(('admin found'));
                    res.redirect('/admin/adminHome');
                }
            }else{
                console.log('admin not found');
                res.render('loginAdmin',{
                    msg:'invalid password'
                }) 
            }

        }else{
            console.log('admin not found');
            res.render('loginAdmin',{
                msg:'invalid username'
            })
        }
    } catch (error) {
        console.log(error);
    }
}


const loadLogin=async(req,res)=>{
    try {
       res.render('loginAdmin')
    } catch (error) {
       console.log('error');
    }
}
// 

// 
const auth=async(req,res,next)=>{
    try {
        const adminname=req.session.adminName;
      const userSearchForVerify = await users.findOne({ email:adminname,is_admin:1});
      console.log(userSearchForVerify);
      console.log('hihihihihihihii');
      if(userSearchForVerify){
        console.log(userSearchForVerify);
        console.log('hihihih');
 next()
      }
      else{
        res.redirect('/admin')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const logout = (req, res) => {
	req.session.destroy((err) => {
	  if (err) {
		console.log(err);
	  } else {
		res.redirect('/admin');
	  }
	});
  }
module.exports={
    loadLogin,
    adminLoginCheck,
    adminHomeLoad,
    auth,
    logout
}

