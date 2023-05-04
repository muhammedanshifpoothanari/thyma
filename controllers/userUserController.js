const users=require("../models/userModel");
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const products=require("../models/productModel");
const carts=require("../models/cartModel");
const orders=require("../models/orderModel");
const Orders=require("../models/orderModel");
const wishs=require("../models/wishModel");
const coupons=require("../models/coupenModel");
const Rate=require("../models/rateModel");
const Count=require("../models/countModel");
const Category = require("../models/categoryModel");
const e = require("express");
const { default: mongoose } = require("mongoose");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
const mobileNumberRegex = /^\d{10}$/;
require('mongoose')

const { v4: uuidv4 } = require('uuid');

const loginCheck=async(req,res)=>{
    try {
  

console.log('kjhgfjh');
        const name=req.body.email;
        const password=req.body.mobile;
        const userDetails= await users.findOne({email:name,is_varified:1});
        if(userDetails){
            console.log(userDetails);
             const passwordMatch=await bcrypt.compare(password,userDetails.password)

             console.log(passwordMatch);
            if(passwordMatch){
                console.log('password also matched');
                res.redirect('signup');
            }

        }
    } catch (error) {
        
    }
}

const securePassword=async(password)=>{
   try {
    const passwordHash=await bcrypt.hash(password,10);
    return passwordHash
   } catch (error) {
    console.log('error');
   }
}

const loadRegister=async(req,res)=>{
     try {
        res.render('signup')
     } catch (error) {
        console.log('error');
     }
}


const profileRender=async(req,res)=>{
    try {
      
      
    const sort = req.query.sort || 'price.asc';
    const searchQuery = req.query.Search;
    const originQuery = req.query.origin;
    const page = req.query.page || 1;
    const limit = req.query.limit || 9;
    console.log(page);
  
    const sortField = sort.split('.')[0];
    const sortOrder = sort.split('.')[1] === 'desc' ? -1 :-1;
  
    
    const skip = (page - 1) * limit; 
    if (originQuery) {console.log('test search');
      Products = await products.find({ origin: { $regex: originQuery, $options: 'i' } })
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);
      res.render('home', { Products});
    }
    if (searchQuery) {console.log('test search');
      Products = await products.find({ name: { $regex: searchQuery, $options: 'i' } })
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);
      res.render('home', { Products ,searchQuery});
    } else{
     const Products = await products.find({isListed:true})
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);
      
      res.render('home', { Products });
     
    }
      
      }
       
    catch (error) {
       console.log('error');
    }
  }

  const postUserLogin=async(req,res)=>{
    try {
      const email=req.body.email;
      const password=req.body.mobile;
      const userSearchForVerif = await users.findOne({ email:email,is_varified:1})
      console.log(userSearchForVerif+'////////////////////////');
     
     
      console.log(req.body);
      const passwordMatch=await bcrypt.compare(password,userSearchForVerif.password);
      console.log(passwordMatch+'ijkhgftgdthjy');
      if(passwordMatch){
      const userSearchForVerify = await users.findOne({ email:email,is_varified:1});
      if(userSearchForVerify){
        console.log('hihihhii');
         emailUser=userSearchForVerify.name;
       
        req.session.username = emailUser;
        console.log('jgecghdn');
        res.redirect('/home')
      }
    } else{
      console.log('test');
        res.render('loginUser',{msg:'user not found,please retry with appropriate email and pasword'})
      }
      
      console.log('hmmm');
    } catch (error) {
      console.log(error);
    }
  }


    
let emailForVerify
let otpForVerify
const insertUser=async(req,res)=>{
    try {
        const sPassword=await securePassword(req.body.password)
        console.log('insertuser');
       emailForVerify=req.body.email;
        const rePassword=req.body.rePassword;
        const passwordMatch=await bcrypt.compare(rePassword,sPassword);
        if(passwordMatch){
          const otpExpiry = new Date();
          otpExpiry.setMinutes(otpExpiry.getMinutes() + 3.5);
          
          //...............
        

         const PSTTime = otpExpiry.toLocaleString("en-US", {timeZone: 'Asia/Kolkata'});

         console.log(PSTTime);

          //.....
            const User= new users({
                name:req.body.name,
                email:emailForVerify,
                mobile:req.body.mobile,
                password:sPassword,
                is_admin:0,
                otp: Math.floor(100000 + Math.random() * 900000),
                otpExpiry: PSTTime
            })
          const userData=await User.save();
          otpForVerify=userData.otp;
          
          console.log(userData); 
          if(emailRegex.test(userData.email)){console.log('hi');
            if(passwordRegex.test(userData.password)){console.log('h2');
              if(usernameRegex.test(userData.name)){console.log('name');
                if(mobileNumberRegex.test(userData.mobile)){console.log('mobile');
                  if(userData){
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'thymadatesandnuts@gmail.com',
                            pass: 'lelzandsawrjzxhb'
                        }
                    });
                    const mailOptions = {
                        from: 'thymadatesandnuts@gmail.com',
                        to: req.body.email,
                        subject: 'OTP Verification',
                        text: `Your OTP for verification is ${userData.otp}`
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if(error){
                            console.log(error);
                            res.send('Error sending OTP. Please try again.');
                        }else{
                            res.render('otpVerify');
                        }
                  })
                }
                  else{
                    res.render('signup',{msg:'youre registartion is failed.'})
                  }  
                }else{console.log('mobile');
                  res.render('signup',{msg:'The mobile number field should be 10 digits long, and should contain only digits.'})

                }

              }else{console.log('else name');
                res.render('signup',{msg:'The username field should be between 3 and 20 characters long, and should contain only letters and numbers.'})

              }

            }else{console.log('password else');
               res.render('signup',{msg:"The password field should be at least 8 characters long, and should contain at least one uppercase letter, one lowercase letter, one number, and one special character."})
            }

          }else{console.log('else email');
            res.render('signup',{msg:'The email id entered should contain a valid email address.'})
          }
        }
       else{
        res.render('signup',{msg:'your repassword does not match!.'})
       }
     
     }catch (error) {
        console.log(error)
     }
 } 


 const verifyOtp = async (req, res) => {
    try {
      console.log('verify');
      const numbers = req.body.otp.map(number => parseInt(number));
      const otpUserTyped = numbers.slice(0, 6).join('');
      console.log(otpUserTyped);
      const userSearchForVerify = await users.find({ email: req.body.email });
      console.log(userSearchForVerify);
      if (userSearchForVerify.length > 0) {
        if (parseInt(userSearchForVerify[userSearchForVerify.length-1].otp) === parseInt(otpUserTyped)) {
          if (userSearchForVerify[0].otpExpiry instanceof Date) {
            if(userSearchForVerify[0].is_varified!==1){
            userSearchForVerify[0].is_varified=1;
            const emailUser=userSearchForVerify[0].name;
            await userSearchForVerify[0].save();
            req.session.username = emailUser;}
            res.redirect('/');
          } else {
            res.send("OTP has expired");
          }
        } else {
          res.send("Incorrect OTP");
        }
      } else {
        res.send("User not found");
      }
    } catch (error) {
      console.log(error);
      res.send("Error verifying OTP");
    }
  };  





  const getUserLogin=async(req,res)=>{
    try {console.log('huguguhhuuh');
      res.render('loginUser')
      
    } catch (error) {
      console.log(error)
    }
    
    }
    const auth=async(req,res,next)=>{
      try {
          const username=req.session.username;
        const userSearchForVerify = await users.findOne({ name:username,is_varified:1});
        console.log(userSearchForVerify);
        console.log('hihihihihihihii');
        if(userSearchForVerify){
          console.log(userSearchForVerify);
          console.log('hihihih');
          next();
        }
        else{
          res.redirect('/loginUser')
        }
    
    
       
    
        
      } catch (error) {
        console.log(error)
      }
    }






    const loadProfile=async(req,res)=>{
        try {
      const username=req.session.username;
      
      console.log(username);
          const userSearchForVerify = await users.findOne({ name:username,is_varified:1})
          console.log(userSearchForVerify);
          const name=userSearchForVerify.name;
          const email=userSearchForVerify.email;
          const mobile=userSearchForVerify.mobile;
          const address=userSearchForVerify.address;
          
          res.render('profile',{name,email,mobile,address});
        } catch (error) {
          console.log(error);
        }
      }
      const profileUpdate=async(req,res)=>{
        try{
             console.log(req.body);
             const username=req.session.username;
             console.log('hhhhhhhhh--------------');
             console.log(username);
             const userSearchForVerify = await users.findOne({ name:username,is_varified:1})
             console.log(userSearchForVerify);
            
            const newName= userSearchForVerify.name=req.body.name;
            const newEmail=   userSearchForVerify.email=req.body.email;
            const newMobile= userSearchForVerify.mobile=req.body.mobile;
             const add=req.body.address;
             const check=req.body.check;
             console.log(check+'//////////');
            userSearchForVerify.address[check]=add;
             
            userSearchForVerify.addIndex=check;
             await userSearchForVerify.save();
             console.log(userSearchForVerify);
             res.status(200).send({
              newName,newEmail,newMobile,newAddress:add
             })
        }catch(error){
          console.log(error);
        }
      }
      const profileUpdate_=async(req,res)=>{
        try{
             console.log(req.body);
             const username=req.session.username;
             console.log(username);
             const userSearchForVerify = await users.findOne({ name:username,is_varified:1})
            
            const newAddress=req.body.address;
            console.log(newAddress);
      
            userSearchForVerify.address.push(newAddress);
             await userSearchForVerify.save();
             console.log(userSearchForVerify);
             console.log('----------------------------------------');
             res.status(200).send({
              msg:'address added successfully'
             })
        }catch(error){
          console.log(error);
        }
      }
      
      const profileCancel=async(req,res)=>{
        console.log('_______________________');
        const cancel=req.body.cancel;
        console.log(cancel);
        try {
          const username=req.session.username;
          console.log(username);
          const userSearchForVerify = await users.findOne({ name:username,is_varified:1})
         
      
         const index=userSearchForVerify.address.indexOf(cancel);
         
         userSearchForVerify.address.splice(index,1)
          await userSearchForVerify.save();
          console.log(userSearchForVerify);
          console.log('----------------------------------------');
          res.status(200).send({
           msg:'address added successfully'
          })
        } catch (error) {
          
        }
      
      }

      const profileDefault=async(req,res)=>{
  
        try {
          console.log('_______________________+hbjgredvwcjfker');
          console.log(req.body);
        const defaultadd=req.body.defaultadd;
        const check=req.body.check
        console.log(defaultadd);
          const username=req.session.username;
          console.log(username);
          const userSearchForVerify = await users.findOne({ name:username,is_varified:1})
         
         
         userSearchForVerify.addIndex=check
          await userSearchForVerify.save();
          console.log(userSearchForVerify);
          console.log('----------------------------------------');
          res.status(200).send({
           msg:'address added successfully'
          })
        } catch (error) {
          console.log(error);
        }
      
      }

      const sub=async(req,res)=>{
  
        try {
          console.log('_______________________');
       
          const email=req.body.sub;
          console.log(email);
          const username=req.session.username;
          console.log(username);
        
          const userSearchForVerify = await users.findOne({ name:username,is_varified:1})
          if (userSearchForVerify) {
            if(userSearchForVerify.isSubscribed.indexOf(email) !== -1){
              res.status(200).send({
                msg:'already_subscribed'
              });
            }
            else{
              userSearchForVerify.isSubscribed.push(email);
              userSearchForVerify.subDate=new Date();
               await userSearchForVerify.save();
               console.log(userSearchForVerify);
               res.status(200).send({
                msg:'subscribed'
              });
              console.log('---------============------------------================-------------');
            }
          }
          else{
            console.log('---------============---/-.-./-/-/-/-/-/-/-/-/-/----================-------------');
            res.status(200).send({
              msg:'Notsubscribed'
            });
          }
         
      
          console.log('----------------------------------------');
         
        } catch (error) {
          console.log(error);
          res.status(500).send('Server Error');
        }
      
      }
      


const feedbackLoad=async(req,res)=>{
  const productId=req.query.productId

  res.render('feedback',{productId})
}
const feedback = async(req,res)=>{
  try {
      console.log(req.body);
      const title =req.body.title
      const rated = req.body.rated
      const description = req.body.description

      // 
      const username=req.session.username;
      console.log(username);
      const userSearchForVerify = await users.findOne({ name:username,is_varified:1})
      // 
      const userID = userSearchForVerify._id
      console.log('11111111');
      const Uid=userID
      console.log('11111111');
      let id_ =req.body.id;
      console.log('11111111');
      const id=new mongoose.Types.ObjectId(id_);
      console.log('11111111');
      const rate_=await Rate.findOne({product:id,userId:Uid});
      console.log('11111111');
      console.log(rate_);
      if(rate_){
          console.log('==========================');
          rate_.title=title,
          rate_.description=description,
          rate_.rated=rated;
          await rate_.save();
      }
      else{  
          console.log('====//////////==========//////============');

          const rate =new Rate({
              userId:userID,
              title:title,
              rated:rated,
              description:description,
              product:id 
          });
        
          const rateLog=await rate.save();
          console.log(rateLog);
      }
      console.log('11111111');
      const count=await Count.findOne({product:id,userId:Uid});
      console.log('11111111');
      if(count){
          console.log('cccccccccc.........................');
      let sum;
      if(rated==1){
          sum=count.countOne;
          sum=sum+1;
          count.countOne=sum
          await count.save();
      }
      else if(rated==2){
          sum=count.countTwo;
          sum=sum+1
          count.countTwo=sum
          await count.save();
      }
      else if(rated==3){
          sum=count.countThree;
          sum=sum+1
          count.countThree=sum
          await count.save();
      }
      else if(rated==4){
          sum=count.countFour;
          sum=sum+1
          count.countFour=sum
          await count.save();
      }
      else if(rated==5){
          sum=count.countFive;
          sum=sum+1
          count.countFive=sum
          await count.save();
      }
  }
 else{
  console.log('--------------------------------');
  let countOne=0;
  let countTwo=0;
  let countThree=0;
  let countFour=0;
  let countFive=0;
  if(rated==1){
  countOne=1;
  }
  else if(rated==2){
      countTwo=1;
  }
  else if(rated==3){
      countThree=1;

  }
  else if(rated==4){
      countFour=1;

  }
  else if(rated==5){
      countFive=1;

  }

  console.log('11111111');
  const newCount= Count({
      product:id,
      countOne:countOne,
      countTwo:countTwo,
      countThree:countThree,
      countFour:countFour,
      countFive:countFive,
  })
  console.log('11111111');
  await newCount.save()
  console.log('11111111');
 }  
 console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  res.status(200).send({
     msg:'jhjfdjdfjhdf'
  })   
  } catch (error) {
      console.log(error.message);
  }
}


const logout = (req, res) => {
	req.session.destroy((err) => {
	  if (err) {
		console.log(err);
	  } else {
		res.redirect('/loginUser');
	  }
	});
  }

module.exports={
    loadRegister,
    insertUser,
    loginCheck,
    verifyOtp,
    auth,
    getUserLogin,
    postUserLogin,
    profileRender,
    loadProfile,
    profileUpdate,
    profileUpdate_,
    profileCancel,
    profileDefault,
    sub,
    feedbackLoad,
    feedback,
    logout
}