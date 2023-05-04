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
const Banner=require("../models/bannerModel");
const e = require("express");
const { default: mongoose } = require("mongoose");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
const mobileNumberRegex = /^\d{10}$/;
require('mongoose')

const { v4: uuidv4 } = require('uuid');




// generate a random order_id
const test=async(req,res)=>{
  try {
    const categories = await Category.find();
    res.render('test', { categories });
  } catch (error) {
    
  }
}

const placeOrder = async (req, res) => {
  try {

      const userId = req.session.user_Id
      const orderDate = new Date()
      const orderArrivingDate = new Date()
      orderArrivingDate.setDate(orderDate.getDate() + 7)
      const payment = req.body
      const { name, house, phone, email, town, district, state, pincode } = req.body
      const paymentmethod = req.body.paymentOrder
      if (payment.paymentOrder == 'COD') {
          const cartData = await User.findOne({ _id: userId }).populate('cart.product')

          const orderItem = cartData.cart.map((value) => {
              return {
                  product: value.product._id,
                  price: value.product.price,
                  quantity: value.quantity,
                  total: value.total,
                  date: orderDate,
                  arrivingDate: orderArrivingDate
              }
          })
          const grandTot = cartData.cart.map((value) => {
              return value.total
          }).reduce((a, b) => {
              return a = a + b
          })
          console.log(grandTot)
          const order = await Order({
              user: userId,
              order: orderItem,
              grandTotal: grandTot,
              address: [{
                  name: name,
                  house: house,
                  mobileNo: phone,
                  email: email,
                  townCity: town,
                  district: district,
                  state: state,
                  pincode: pincode,

              }],
              paymentMethod: paymentmethod,


          })
          const saveOrder = await order.save()

          const orderData = await Order.findOne({ _id: saveOrder._id }).populate('order.product')
          cartData.cart = [];
          const Ucart = await cartData.save()
          orderItem.forEach(async (element) => {
              const product = await Product.findById({ _id: element.product })
              const inventoryUpdate = await Product.updateOne({ _id: element.product }, { $set: { quantity: Number(product.quantity) - Number(element.quantity) } })
          })
          res.redirect(`/orderSuccess?id=${orderData._id}`)

      } else if (payment.paymentOrder == 'razorpay') {

          const cartData = await User.findOne({ _id: userId }).populate('cart.product')
          const orderItem = cartData.cart.map((value) => {
              return {
                  product: value.product._id,
                  price: value.product.price,
                  quantity: value.quantity,
                  total: value.total,
                  date: orderDate,
                  arrivingDate: orderArrivingDate
              }
          })
          const grandTot = cartData.cart.map((value) => {
              return value.total
          }).reduce((a, b) => {
              return a = a + b
          })

          // create a Razorpay order
          const options = {
              amount: grandTot * 100, // amount in paisa (multiply by 100)
              currency: "INR", // currency code
              receipt: "order_" + orderDate.getTime(), // unique order ID
          }
          const order = await instance.orders.create(options)
          req.session.order = order
          req.session.orderDatas = {
              amount: grandTot * 100,
              currency: "INR",
              orderId: order.id,
              address: {
                  name: name,
                  house: house,
                  mobileNo: phone,
                  email: email,
                  townCity: town,
                  district: district,
                  state: state,
                  pincode: pincode
              },
              order: orderItem,
              grandTotal: grandTot,
              paymentMethod: paymentmethod
          };

          res.redirect("/checkout?orderId=" + order.id)


      } else {
          res.redirect("/checkout")
      }
  } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
  }
}

const razorpay = async (req, res) => {
  const orderDatas = req.session.orderDatas
  const userId = req.session.user_Id
  const order = new Order({
      user: userId,
      order: orderDatas.order,
      paymentId: orderDatas.orderId,
      grandTotal: orderDatas.grandTotal,
      address: [orderDatas.address],
      paymentMethod: orderDatas.paymentMethod,

  });
  const save = await order.save();
  const orderData = await Order.findOne({ _id: save._id }).populate('order.product')
  const cartData = await User.findOne({ _id: userId }).populate('cart.product')
  cartData.cart = [];
  const Ucart = await cartData.save()

  orderDatas.order.forEach(async (element) => {
      const product = await Product.findById({ _id: element.product })
      const inventoryUpdate = await Product.updateOne({ _id: element.product }, { $set: { quantity: Number(product.quantity) - Number(element.quantity) } })
  })



  res.json({ orderData })


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
const loadorder=async(req,res)=>{
  try {
    const username=req.session.username;
    const orders = await Orders.find({ref:username});


    res.render('order',{ orders })
  } catch (error) {
    console.log(error)
  }
}



const orderSuccuss=async(req,res)=>{
  res.render('orderSucces')
}
const processOrder = async(req, res) => {
  const { name, email, address, phone, payMode,total } = req.query;
  console.log(req.query);
  console.log(name);
  console.log(address);
  console.log(phone);
  console.log(payMode);
  console.log(total);
  const username = req.session.username;
   
   
  const unpaid='unpaid';
  const paid='paid';
  const pending='pending';


  if(payMode==='cod'){
    const order=orders({
      ref:username,
      name:name,
      email:email,
      address:address,
      phone:phone,
      payMode:payMode,
      total:total,
      paymentStatus:unpaid,
      deliveryStatus:pending
     })
     const orderData=await order.save();
     console.log(orderData);
    res.render('orderSucces')
  }
else{
  const order=orders({
    ref:username,
    name:name,
    email:email,
    address:address,
    phone:phone,
    payMode:payMode,
    total:total,
    paymentStatus:paid,
    deliveryStatus:pending
   })
   const orderData=await order.save();
   console.log(orderData);
  res.render('upi',{name,email,address,phone,payMode,total})
}
  

  // Here you can process the order and redirect to a thank you page

};

const cancelFromOrder=async(req,res)=>{
  try {
    console.log('hdsfjhdfvjhvdfhjdf');
    const cartItemId=req.body.cartItemId;
    const result = await Orders.deleteOne({ _id: cartItemId });
    console.log(result);

   res.redirect('/order');
  } catch (error) {
    console.log(error);
  }
}






let productId


const loadLogin=async(req,res)=>{
    try {
       res.render('login')
    } catch (error) {
       console.log('error');
    }
}
// 


const homeRender = async (req, res) => {
  try {
    const banners = await Banner.find();
    let modalData;

    const sort = req.query.sort || 'price.asc';
     if(req.session.searchQuery&&req.query.origin=='all'){
      console.log('jihih');
      req.session.searchQuery=''
      }
    else if(req.query.Search){
    const searchQuery = req.query.Search;
    req.session.searchQuery=searchQuery
    }
    if(req.query.origin=='all'){
      req.session.origin='';
    }
    else if(req.query.origin){
   const originQuery = req.query.origin;
   req.session.origin=originQuery
    }

   
    const page = req.query.page || 1;
    const limit = req.query.limit || 9;
    console.log(page);

    const sortField = sort.split('.')[0];
    const sortOrder = sort.split('.')[1] === 'desc' ? -1 : -1;

    const skip = (page - 1) * limit;

    let Products;

    if (req.session.origin) {
      Products = await products
        .find({ origin: { $regex: req.session.origin, $options: 'i' }, isListed: true })
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit);
    } else if (req.session.searchQuery) {
      Products = await products
        .find({ name: { $regex: req.session.searchQuery, $options: 'i' }, isListed: true })
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit);
    } else {
      Products = await products
        .find({ isListed: true })
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit);
    }

    res.render('home', { Products, modalData, originQuery:req.session.origin,banners });
  } catch (error) {
    console.log(error);
  }
};




module.exports={
    loadLogin,
    homeRender,
    processOrder,
    orderSuccuss,
    loadorder,
    orderDetails,
    cancelFromOrder,
    placeOrder,
    razorpay,
    test
}