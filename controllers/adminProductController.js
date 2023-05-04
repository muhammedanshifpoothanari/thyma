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

const fs = require('fs');


const postingEditProductPage = async (req, res) => {
    try {
      const productForUpdateId = req.params.id;
      const product = await products.findById(productForUpdateId);
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.catogery = req.body.catogery || product.catogery;
      product.origin = req.body.origin || product.origin;
      product.expiryDate = req.body.expiryDate || product.expiryDate;
      product.unitInStock = req.body.unitInStock || product.unitInStock;
      product.price = req.body.price || product.price;
      product.image = req.body.image || product.image;
      const validationError = product.validateSync();
      if (validationError) {
        throw new Error(`Error: product validation failed: ${validationError.message}`);
      }
      await product.save();
      res.redirect('/admin/productList');
    } catch (err) {
      console.log(err);
    }
  };



  const adminProductAddLoad=async(req,res)=>{
    try {
      const categories = await Category.find();
       res.render('addProduct',{categories})
    } catch (error) {
       console.log('error');
    }
}




const insertProduct = async (req, res) => {
    try {
        console.log('insertProduct');
console.log(req.body);
        
          const filenames = req.files.map(file => file.filename);
       
        const expire=req.body.expiryDate
        const PSTTime = expire.toLocaleString("en-US", { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g,'')
       console.log(PSTTime);
        const Product = new products({
            name: req.body.name,
            description: req.body.description,
            category:req.body.category,
            origin: req.body.origin,
            expiryDate: PSTTime,
            unitInStock: req.body.stock,
            image: filenames,
            price: req.body.price,
            expensePerUnit:req.body.expense,
            offer:req.body.offer
        });
        const productData = await Product.save();
        console.log(productData);
        res.redirect('productList');
    } catch (error) {
        console.log(error);
    }
  };




  const showProduct=async (req, res) => {
    try {
      let offer;
      const Products = await products.find().sort({ _id: -1 });
       let offerPrice
      if (Products.offer!==null&&Products.offer!==0) {
        offerPrice=(Products.price*(1-(Products.offer/100))).toFixed(2);
      }
     
      const total=Products.offerPrice
      
      res.render('productList', { products:Products,total}); 
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };



  const editProductPage=async (req, res) => {
    try {
      const productForUpdateId = req.query.id;
      console.log(productForUpdateId);
      const product =await products.findById(productForUpdateId);
      console.log(product);
      const name = product.name;
      const price = product.price;
      const description = product.description;
      const catogery= product.catogery;
      const origin= product.origin;
      const expiryDate= product.expiryDate;
      const unitInStock= product.unitInStock;
      const image=product.image;
      console.log('hihihih')
      res.render('updateProduct',{productForUpdateId,name,price,description,catogery,origin,expiryDate,unitInStock,image}) 
    } catch (err) {
      console.error(err);
      res.status(500).json({
      error: err
      });
    }
  };




  const updateProduct=async (req, res) => {
    try {console.log('tt');
      const { name, price, description,catogery,expiryDate,unitInStock,image } = req.body;
      await products.findByIdAndUpdate(req.body.id,{ name, price, description,catogery,expiryDate,unitInStock,image } ); 
      res.redirect('productList'); 
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };



  const adminCouponAddLoad=async(req,res)=>{
    try {
       res.render('addCoupon')
    } catch (error) {
       console.log('error');
    }
  }

  

  const unlistProduct = async (req, res) => {
    try {
   
      console.log(req.query);
     
      const productId =new mongoose.Types.ObjectId(req.query.id); ;
      const product= await products.findOne(productId);
      console.log(product);
      if(product.isListed===true){
      
        product.isListed = false;
        await product.save();
      }
      else{ 
        product.isListed = true;
        await product.save();
      }
      
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: err
      });
    }
  };



  const getEditPro = async (req, res) => {
    try {
      console.log(req.params);
      const product = await products.findById(req.params.id);
      res.render('updateProduct', { product });
    } catch (err) {
      console.error(err);
    }
  };




  const postEditPro = async (req, res) => {
    try {
      console.log('---------------------');
      console.log(req.files);
      console.log(req.body);
  
      const product = await products.findById(req.params.id);
  
      // Handle image uploads
      let imagePaths = product.image;
      if (req.files) {
        const newImagePaths = req.files.map(file => path.relative('public', file.path).substring('userimages/'.length));
        imagePaths = imagePaths.concat(newImagePaths);
      }
  
      // Handle image deletions
      if (req.body.deleteImage) {
        const deletedImagePath = req.body.deleteImage;
        imagePaths = imagePaths.filter(imagePath => imagePath !== deletedImagePath);
        await fs.unlink(`public/userimages/${deletedImagePath}`, function (err) {
          if (err) throw err;
          console.log('File deleted!');
        });
      }
  
      // Update the product
      product.name = req.body.name;
      product.description = req.body.description;
      product.category = req.body.category;
      product.origin = req.body.origin;
      product.expiryDate = req.body.expiryDate;
      product.unitInStock = req.body.unitInStock;
      product.offer = req.body.offer;
      product.expensePerUnit = req.body.expense;
      product.price = req.body.price;
      product.image = imagePaths;
      await product.save();
  
      console.log(product);
  
      res.redirect('/admin/productList');
    } catch (err) {
      console.error(err);
    }
  };





module.exports={

    postingEditProductPage,
     
      adminProductAddLoad,
      adminCouponAddLoad,
      insertProduct,
      showProduct,
      editProductPage,
      updateProduct,
    
      unlistProduct,
   
      getEditPro,
      postEditPro,
   
  }
  
  