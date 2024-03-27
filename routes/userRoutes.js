const bodyParser = require('body-parser');
const express=require('express');
const userRoutes=express();
const Orders=require("../models/orderModel");

//.......
const userController=require('../controllers/userController');
const userProductController=require('../controllers/userProductController');
const userUserController=require('../controllers/userUserController');
const userCartController=require('../controllers/userCartController');
const userWishController=require('../controllers/userWishController');
const userCheckoutController=require('../controllers/userCheckoutController');
const userCouponController=require('../controllers/userCouponController');


const Razorpay = require('razorpay');


const instance = new Razorpay({
  

    key_id: 'rzp_test_oSYwBgXHVa3UuF',
  

    key_secret: '9QUqwyOIzeESkNJ8RzrBcsA5'
});

const { v4: uuidv4 } = require('uuid');


const order_id = uuidv4();


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

userRoutes.post('/createOrder', async(req, res)=>{
	try {
		

   const sums =req.session.totals;
   

var options = {
  amount: sums*100, 
  currency: "INR",
  receipt: "order_rcptid_11"
};
 const order=await instance.orders.create(options);
 console.log(order);

	
res.json({order})
} catch (error) {
		console.log(error);
}
})

userRoutes.post('/verifyOrder', async (req, res) => {
    const { order_id, payment_id } = req.body;
    const razorpay_signature = req.headers['x-razorpay-signature'];
    const key_secret = '9QUqwyOIzeESkNJ8RzrBcsA5';

    try {

        let hmac = crypto.createHmac('sha256', key_secret);
        hmac.update(order_id + "|" + payment_id);
        const generated_signature = hmac.digest('hex');

        if (razorpay_signature === generated_signature) {
            // Extract order details from req.body or req.session, replace with your own logic
            const { username, email, address, phone, payMode, total } = req.body;

            // Create a new order document
            const newOrder = new Orders({
                ref: username,
                name: username,
                email: email,
                address: address,
                phone: phone,
                payMode: payMode,
                total: total,
                paymentStatus: 'unpaid', 
                deliveryStatus: 'pending' 
            });

            // Save the new order to the database
            const savedOrder = await newOrder.save();
                
            // Respond to the client
            res.render('orderSuccess'); // Render your success page
        } else {
            res.json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "An error occurred while processing the order" });
    }
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