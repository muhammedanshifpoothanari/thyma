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






const getBannerList = async (req, res) => {
    try {
      const banners = await Banner.find();
      res.render('banners', { banners });
    } catch (error) {
      res.render('error', { error });
    }
  };
  
  const getBannerAddForm = (req, res) => {
    res.render('banner');
  };
  


const postBannerAddForm = async (req, res) => {
  try {
    // Get the form data from the request body
    const { title, link } = req.body;
    const filename = req.file.filename;

    // Read the uploaded image file from disk
    const imageBuffer = await sharp(req.file.path).toBuffer();

    // Crop and resize the image using sharp
    const croppedImageBuffer = await sharp(imageBuffer)
      .resize(800, 400) // Resize the image to a maximum of 800x400 pixels
      .toBuffer();

    // Save the cropped and resized image to disk
    const croppedImageFilename = `cropped-${filename}`;
    await sharp(croppedImageBuffer).toFile(`public/userimages/${croppedImageFilename}`);

    // Create the banner object and save it to the database
    const banner = new Banner({ title, image: croppedImageFilename, link });
    await banner.save();

    // Redirect to the banners list page
    res.redirect('/admin/banners');
  } catch (error) {
    // Render an error page if something goes wrong
    res.render('error', { error });
  }
};
  
  const getBannerEditForm = async (req, res) => {
    try {
      const banner = await Banner.findById(req.params.id);
      console.log(banner);
      res.render('editBanner', { banner });
    } catch (error) {
      res.render('error', { error });
    }
  };
  
  const postBannerEditForm = async (req, res) => {
    try {
      const { title, image, link } = req.body;
      await Banner.findByIdAndUpdate(req.params.id, { title, image, link });
      res.redirect('/admin/banners');
    } catch (error) {
      res.render('error', { error });
    }
  };
  
  const deleteBanner = async (req, res) => {
    try {
      await Banner.findByIdAndDelete(req.params.id);
      res.redirect('/admin/banners');
    } catch (error) {
      res.render('error', { error });
    }
  };











module.exports={
      getBannerList,
  getBannerAddForm,
  postBannerAddForm,
  getBannerEditForm,
  postBannerEditForm,
  deleteBanner 
  }
  
  