const bodyParser = require('body-parser');
const express=require('express');
const userRoutes=express();
//.......
const userController=require('../controllers/userController');
const userProductController=require('../controllers/userProductController');
const userUserController=require('../controllers/userUserController');
const userCartController=require('../controllers/userCartController');
const userWishController=require('../controllers/userWishController');
const userCheckoutController=require('../controllers/userCheckoutController');
const userCouponController=require('../controllers/userCouponController');



//.........
// Inside app.js

const Razorpay = require('razorpay');

// This razorpayInstance will be used to
// access any resource from razorpay
const instance = new Razorpay({
  
    // Replace with your key_id
    key_id: 'rzp_test_oSYwBgXHVa3UuF',
  
    // Replace with your key_secret
    key_secret: '9QUqwyOIzeESkNJ8RzrBcsA5'
});

const { v4: uuidv4 } = require('uuid');

// generate a random order_id
const order_id = uuidv4();
// ..........

//   
userRoutes.set('views','./views/user');

userRoutes.get('/',userController.homeRender);
userRoutes.get('/loginUser',userUserController.getUserLogin);
userRoutes.post('/loginUser',userUserController.postUserLogin);
userRoutes.get('/home',userController.homeRender);
userRoutes.get('/profile',userUserController.auth,userUserController.profileRender);
userRoutes.post('/signup',userUserController.insertUser);
userRoutes.post('/verify',userUserController.verifyOtp);
userRoutes.get('/login',userController.loadLogin);
userRoutes.get('/order',userController.loadorder);
userRoutes.post('/login',userUserController.loginCheck);
userRoutes.get('/productDetails',userUserController.auth, userProductController.getProduct);
userRoutes.post('/cart/add',userUserController.auth, userCartController.addToCart);
userRoutes.post('/wish/add',userUserController.auth, userWishController.addToWish);
userRoutes.get('/cart',userUserController.auth, userCartController.getCart);
userRoutes.get('/wish',userUserController.auth, userWishController.getWish);
userRoutes.get('/checkout',userUserController.auth, userCheckoutController.showCheckoutPage);
userRoutes.get('/processOrder',userUserController.auth, userController.processOrder);
userRoutes.get('/upiSuccess',userUserController.auth, userController.orderSuccuss);
userRoutes.get('/checkout/:total',userUserController.auth, userCheckoutController.showCheckoutPage);
userRoutes.post('/coupoun/check', userCouponController.getCoupon);
userRoutes.post('/update-quantity', userCartController.updateQuantity);
// 
//Inside app.js
userRoutes.post('/createOrder', async(req, res)=>{
	try {
		
	
   console.log('\n\n\n============\n\n\n');

   const sums =req.session.totals;
   
   console.log(sums);
var options = {
  amount: sums*100,  // amount in the smallest currency unit
  currency: "INR",
  receipt: "order_rcptid_11"
};
 const order=await instance.orders.create(options);
 console.log(order);

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



  const orderData=await order.save();
  console.log(orderData);
 res.render('upi',{name,email,address,phone,payMode,total})

	
res.json({order})
} catch (error) {
		console.log(error);
}
})
//Inside app.js
userRoutes.post('/verifyOrder', (req, res)=>{
	
	// STEP 7: Receive Payment Data
	const {order_id, payment_id} = req.body;	
	const razorpay_signature = req.headers['x-razorpay-signature'];

	// Pass yours key_secret here
	const key_secret = '9QUqwyOIzeESkNJ8RzrBcsA5';	

	// STEP 8: Verification & Send Response to User
	
	// Creating hmac object
	let hmac = crypto.createHmac('sha256', key_secret);

	// Passing the data to be hashed
	hmac.update(order_id + "|" + payment_id);
	
	// Creating the hmac in the required format
	const generated_signature = hmac.digest('hex');
	
	
	if(razorpay_signature===generated_signature){
		res.json({success:true, message:"Payment has been verified"})
	}
	else
	res.json({success:false, message:"Payment verification failed"})
});

userRoutes.get('/profiles',userUserController.auth,userUserController.loadProfile);
userRoutes.get('/orderDetails',userUserController.auth,userController.orderDetails);
userRoutes.get('/test',userUserController.loadRegister);
userRoutes.post('/profileDefault',userUserController.profileDefault);
userRoutes.post('/profileCancel',userUserController.profileCancel);
userRoutes.post('/profileUpdate',userUserController.profileUpdate);
userRoutes.post('/profileUpdate_',userUserController.profileUpdate_);
userRoutes.post('/cart/update',userCartController.updateCartItemQuantity);
userRoutes.post('/cart/update/code',userCartController.updateCartItem);
userRoutes.post('/cancel',userCartController.cancelFromCart);
userRoutes.post('/cancelOrder',userController.cancelFromOrder);
userRoutes.post('/cancelWish',userWishController.cancelFromWish);
userRoutes.post('/sub',userUserController.sub);
userRoutes.get('/logout',userUserController.logout);


userRoutes.get('/feedback',userUserController.feedbackLoad);
userRoutes.post('/feedback',userUserController.feedback);

module.exports=userRoutes;