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





const dispatch=async(req,res)=>{
    try {
      console.log('hihihihihi');
      console.log(req.body);
      const proinvoice=req.body.orderItemId
      const invoice=req.body.orderId;
      const quantity=req.body.quantity;
      const pay=req.body.pay;
      const del=req.body.del;
      const date = Date.now();
      const productItemIds =proinvoice
      
      const productData=await products.findById(productItemIds);
      const totalQuantity=productData.unitInStock;
      console.log(totalQuantity+'totalQuantity');
      const newQuantity=totalQuantity-quantity;
      productData.unitInStock=newQuantity;
      productData.isDispatched=true;
      productData.invoiceDispatched=invoice;
      productData.dispatchDate=date
      await productData.save();
      console.log(productData+'productData');
      const name=productData.name;
      const id=productData._id;
      const price=productData.price;
      const expensePerUnit=productData.expensePerUnit;
      const payStatus=pay;
      const delStatus=del;
      const revenue=quantity*price;
      const outcome=(revenue/quantity)-expensePerUnit;
      
       const sale = new Sales({
        invoice:invoice,
        nameOfProduct:name,
        productId:id,
        pricePerUnit:price,
        payStatus:payStatus,
        delStatus:delStatus,
        quantiyOut:quantity,
        expensePerUnit:expensePerUnit,
        revenue:revenue,
        outcome:outcome,
        date:date
      });
      const saleData=await sale.save();
      console.log(saleData+'saledata');
      const msg=`dispached succesfully.`
      res.status(200).send({
        msg
      })
    } catch (error) {
      console.log(error);
    }
  }
  const orderDetails=async(req,res)=>{
    try {
      console.log(req.query);
      const id=req.query.id;
  
      const orders = await Orders.findOne({ _id: id });
      console.log(orders);
      const ref=orders.ref;
      const wishedRef = await carts.find({ isOrdered: true,userRef:ref }, { ref: 1, _id: 0});
      // console.log(wishedRef);
      const cartItemIds = wishedRef.map((item) => {
        return new mongoose.Types.ObjectId(item.ref);
      });
  
  
      const productsInCart = await products.find({ _id: { $in: cartItemIds } });
      const quantities = await carts.find({ ref:cartItemIds}, {quantity:1,_id:0});
      // console.log(quantities);
     
     
      
      // Combine products with quantities
      const combined = productsInCart.map((p, i) => ({ ...p.toObject(), quantity: quantities[i].quantity }));
  
  
      res.render('orderDetails',{ orders,combined })
    } catch (error) {
      console.log(error)
    }
  }
  
  const getOrder=async(req,res)=>{
    try {
      const orders = await Orders.find();
  
  
      res.render('orderList',{ orders })
    } catch (error) {
      console.log(error)
    }
  }




  const unlistOrders = async (req, res) => {
    const orderId = req.query.id;
  
    try {
      const order= await Orders.findById(orderId);
      if(order.paymentStatus==='paid'){
        order.paymentStatus = 'unpaid';
        await order.save();
       
      }
      else{
        order.paymentStatus = 'paid';
        await order.save();
      }
     
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: err
      });
    }
  };
  const unlistOrder = async (req, res) => {
    const orderId = req.query.id;
  
    try {
      const order= await Orders.findById(orderId);
      if(order.deliveryStatus==='delivered'){
        order.deliveryStatus = 'pending';
        await order.save();
       
      }
      else{
        order.deliveryStatus = 'delivered';
        await order.save();
      }
     
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: err
      });
    }
  };



















module.exports={ 
      getOrder,
      unlistOrder,
      unlistOrders,
      orderDetails,
      dispatch
  }
  
  