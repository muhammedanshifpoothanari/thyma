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


const addToCart = async (req, res) => {
    console.log(req.body);
    try {
      console.log('test addcart///////////////////////////////////');
      const quantity = parseInt(req.body.quantity);
  
      const existingCart = await carts.findOne({ ref: req.body.id });
      
      if (existingCart) {
        existingCart.quantity += quantity;
        const updatedCart = await existingCart.save();
        console.log(updatedCart);
        res.redirect('/productDetails?productId=' + req.body.id);
      } else {
        const username = req.session.username;
        const cart = new carts({
          ref: req.body.id,
          quantity: quantity,
          userRef: username
        });
        const cartData = await cart.save();
        if (cartData) {
          console.log(cartData);
          let redirect = '/productDetails?productId=' + req.body.id;
          res.redirect(redirect);
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  //.......
  const getCart = async (req, res) => {
    try {
      const username = req.session.username;
      console.log(username,'tfgtdhntmnj');
      const wishedRef = await carts.find({ isOrdered: true,userRef:username }, { ref: 1, _id: 0});
      
      const cartItemIds = wishedRef.map((item) => {
        return new mongoose.Types.ObjectId(item.ref);
      });
  
      let discount = parseFloat(req.query.discount);
      if (isNaN(discount)) {
        discount = null;
      }
  
      const productsInCart = await products.find({ _id: { $in: cartItemIds } });
      console.log(productsInCart);
      const quantities = await carts.find({ ref:cartItemIds}, {quantity:1,_id:0});
      // console.log(quantities);
     
     
      
      // Combine products with quantities
      const combined = productsInCart.map((p, i) => ({ ...p.toObject(), quantity: quantities[i].quantity }));
      
      
  
      // Calculate subtotal
      const subtotal = combined.reduce((total, item) => {
        if (typeof item.price === 'number') {
          return total + (item.price * item.quantity);
        } else {
          return total;
        }
      }, 0);
  
      if (discount) {
        if(subtotal>1000&&subtotal<15000){            
          const discountedSubtotal = ((subtotal * (1 - (discount/100)))).toFixed(2);
          console.log(discountedSubtotal);
          const msg='Discount only applicable to price range between 1000 and 15000'
          req.session.totals=discountedSubtotal
          res.render('wishList', { combined, subtotal, discount, discountedSubtotal ,msg});              
        }
      } else {
        console.log('jjjjj');
        req.session.totals=subtotal
        res.render('wishList', { combined, subtotal });
      }
    } catch (error) {
      console.log(error);
    }
  }; 
  const updateQuantity = (req, res) => {
    const { quantity } = req.body;
    console.log('updatequantity');
  
    // Update quantity in cart model
    const updatedCart = carts.updateQuantity(quantity);
    console.log(updatedCart);
  
    // Send updated quantity back to client
    res.json({ quantity: updatedCart.quantity });
  };

  const updateCartItemQuantity = async (req, res) => {

    const cartItemId = req.body.cartItemId;
    const quantity = parseInt(req.body.quantity); // Parse quantity as integer
    let discount = null;
    let subtotal = parseFloat(req.body.subtotal); // Parse subtotal as float
    console.log(subtotal+'subtotal old');
    const price = parseFloat(req.body.price); // Parse price as float
    const code = req.body.code;
    console.log(req.body);
    try {
      const q_p=price*quantity;
      // Update the cart item quantity
      const cart = await carts.findOne({ ref: cartItemId });
      console.log(cart);
      const oldQuantity = cart.quantity;
      console.log(oldQuantity);
      
      cart.quantity = quantity;
      await cart.save();
      console.log(cart);
      const coupon = await coupons.findOne({ code: code, isListed: true });
      
      if (coupon) {
        discount = coupon.discount;
      }
      const username = req.session.username;
      const wishedRef = await carts.find({ isOrdered: true,userRef:username }, { ref: 1, _id: 0});
      // console.log(wishedRef);
      const cartItemIds = wishedRef.map((item) => {
        return new mongoose.Types.ObjectId(item.ref);
      });
      if(req.query.discount){
       discount = parseFloat(req.query.discount);
      }
      if (isNaN(discount)) {
        discount = null;
      }
      const productsInCart = await products.find({ _id: { $in: cartItemIds } });
    
     
  // Retrieve quantities using the _id field
  const quantities = await carts.find({ ref: { $in: cartItemIds } }, { quantity: 1, _id: 0 }).sort({_id: -1});

  console.log(quantities);
  // Combine products with quantities
  const combined = productsInCart.map((p, i) => ({ ...p.toObject(), quantity: quantities[i].quantity }));
  
      // Calculate subtotal
      const subtotal = combined.reduce((total, item) => {
        if (typeof item.price === 'number') {
          return total + (item.price * item.quantity);
        } else {
          return total;
        }
      }, 0);
  
      if (discount) {

        if(combined[i].unitInStock>=quantity){ 
          const discountedSubtotal = ((subtotal * (1 - (discount/100)))).toFixed(2);
          console.log(discountedSubtotal+'nd fxfdg'); 
          res.status(200).send({
            msg: 'Cart item quantity updated successfully',
            quantity: quantity,
            discount: discount,
            newDiscountedSubtotal: discountedSubtotal,
            cartItemId: cartItemId,
            subtotal:discountedSubtotal,
            total: discountedSubtotal,
            q_p:q_p
          });            
        
      }else{
        res.status(200).send({
          msg: 'product is out of stock',
          quantity: quantity,
          subtotal:subtotal,  
          cartItemId: cartItemId,
          total: subtotal,
          q_p:q_p
        });
      }

    } else {
        res.status(200).send({
          msg: 'Cart item quantity updated successfully',
          quantity: quantity,
          subtotal:subtotal,  
          cartItemId: cartItemId,
          total: subtotal,
          q_p:q_p
        });
      }
    } catch (err) {
      // Send an error response
      res.status(500).send({ msg: 'Failed to update cart item quantity', error: err });
    }
  };

  const updateCartItem = async (req, res) => {
    console.log(req.body);
    console.log('+++++++++++++++++++++++++++++++++++');
    let discount = null;
    let subtotal = parseFloat(req.body.subtotal); // Parse subtotal as float
    console.log(subtotal + 'subtotal old');
    const code = req.body.code;
    try {
      console.log('try');
      const coupon = await coupons.findOne({ code: code, isListed: true });
      console.log(coupon);
      const username = req.session.username;
      console.log('===========================');
      if(coupon.userRef==username){
        console.log(username);
        console.log(coupon.userRef);
        res.status(200).send({
          msg: 'Coupon already used'
        });            
        console.log('========================');
      }
      else{
      if (coupon) {
        const minDiscountPercentage = coupon.discount; // Get the minimum discount percentage from the coupon
        const maxDiscountPercentage = coupon.maxDiscount; // Get the maximum discount percentage from the coupon
        const minAmount = coupon.MinAmount; // Get the minimum amount from the coupon
        const maxAmount = coupon.maxAmount; // Get the maximum amount from the coupon
        let discountPercentage = null;
        if (subtotal >= minAmount && subtotal <= maxAmount) { // Check if subtotal is within the range
          const amountRange = maxAmount - minAmount;
          const discountRange = maxDiscountPercentage - minDiscountPercentage;
          const amountPercentage = (subtotal - minAmount) / amountRange;
          discountPercentage = minDiscountPercentage + (amountPercentage * discountRange);
          const discountAmount = (subtotal * (discountPercentage/100)).toFixed(2); // Calculate the discount amount
          discount = discountPercentage.toFixed(2);
        } else if (subtotal > maxAmount) { // Check if subtotal exceeds maxAmount
          discountPercentage = maxDiscountPercentage;
          const discountAmount = (subtotal * (discountPercentage/100)).toFixed(2); // Calculate the discount amount
          discount = discountPercentage.toFixed(2);
        }
      }
      console.log(discount);
      if (discount) {
        console.log('test 10+///////////////////////////////////////////////');
        const discountedSubtotal = ((subtotal * (1 - (discount/100)))).toFixed(2);
        console.log(discountedSubtotal+'nd fxfdg'); 
        res.status(200).send({
          msg: 'Cart item quantity updated successfully',
          discount: discount,
          subtotal: discountedSubtotal
        });            
      } else {
        console.log('test 11+/////////////////////////////////////////');
        res.status(200).send({
          msg: 'Cart item quantity updated successfully',
          quantity: quantity,
          subtotal:subtotal,   
          total: subtotal,
        });
      }
    }
    } catch (err) {
      // Send an error response
      res.status(500).send({ msg: 'Failed to update cart item quantity', error: err });
    }
  };
  
  const cancelFromCart=async(req,res)=>{
    try {
      console.log('hdsfjhdfvjhvdfhjdf');
      const cartItemId=req.body.cartItemId;
      const result = await carts.deleteOne({ ref: cartItemId });
  
      if (result.deletedCount === 1) {
        console.log(`Cart  with ref ${cartItemId} was deleted successfully.`);
      } else {
        console.log(`No cart  with ref ${cartItemId} was found.`);
      }
      
         res.redirect('/cart');
    }catch (error) {
      console.log(error)
    }
  }
  // 
        

module.exports={
    addToCart,
    getCart,
    updateQuantity,
    updateCartItemQuantity,
    updateCartItem,
    cancelFromCart,
}