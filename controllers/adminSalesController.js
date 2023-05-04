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









const getSalesByDate = async (req, res) => {
    try {
      const userSub=await users.find({isSubscribed:1});
      const startDate = new Date(req.body.date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1); 
      const date = { $gte: startDate, $lte: endDate }
  
      let salesData = await Sales.find({
        date: date
      });
      console.log(salesData);
      // Calculate total revenue and total expenses
      let totalRevenue = 0;
      let totalExpense = 0;
      salesData.forEach((sale) => {
        totalRevenue += sale.revenue;
        totalExpense += sale.quantiyOut * sale.expensePerUnit;
      });
      let profit=totalRevenue-totalExpense;
      let exp=((totalExpense/totalRevenue)*100).toFixed(0)
      let percentage=((profit/totalRevenue)*100).toFixed(0)
      const chartData = salesData.map((sale) => ({ name: sale.nameOfProduct, revenue: sale.revenue }));
      res.render('bookkeeping', {
        sales:salesData,
        totalRevenue,
        percentage,exp,
        profit,
        totalExpense,
        chartData,
        userSub
      });
    } catch (error) {
      console.log(error);
      res.render('error', {
        message: 'Error retrieving sales data'
      });
    }
  };
  
  const sales = async (req, res) => {
    try {
      const userSub=await users.find({isSubscribed:1});
  
      const salesData = await Sales.find();
      console.log(salesData);
  
      // Calculate total revenue and total expenses
      let totalRevenue = 0;
      let totalExpense = 0;
      salesData.forEach((sale) => {
        totalRevenue += sale.revenue;
        totalExpense += sale.quantiyOut * sale.expensePerUnit;
      });
     
      // Prepare chart data
      const chartData = salesData.map((sale) => ({ name: sale.nameOfProduct, revenue: sale.revenue }));
      let profit=totalRevenue-totalExpense;
      let exp=((totalExpense/totalRevenue)*100).toFixed(0)
      let percentage=((profit/totalRevenue)*100).toFixed(0)
      res.render('bookkeeping', { sales: salesData,percentage,exp, totalRevenue, profit,totalExpense, chartData ,userSub});
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  
  
  
module.exports={
    sales,
    getSalesByDate,
}
