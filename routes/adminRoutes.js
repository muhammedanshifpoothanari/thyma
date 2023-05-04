const bodyParser = require('body-parser');
const { application } = require('express');
const express=require('express');
const adminRoutes=express();

const adminController=require('../controllers/adminController');

const adminProductController=require('../controllers/adminProductController');
const adminCategoryController=require('../controllers/adminCategoryController');
const adminUserController=require('../controllers/adminUserController');
const adminOrderController=require('../controllers/adminOrderController');
const adminOriginController=require('../controllers/adminOriginController');
const adminBannerController=require('../controllers/adminBannerController');
const adminSalesController=require('../controllers/adminSalesController');
const adminCouponController=require('../controllers/adminCouponController');
adminRoutes.set('views','./views/admin');

const multer = require('multer');
const sharp = require('sharp')

const path=require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,'../public/userimages'));
    },
    filename: function (req, file, cb) {
        const name=Date.now() + '-' + file.originalname;
      cb(null,name);
    }
  });
  const upload = multer({ storage: storage });

 
adminRoutes.use(bodyParser.json());
adminRoutes.use(bodyParser.urlencoded({extended:true}))
adminRoutes.get('/',adminController.loadLogin);
adminRoutes.post('/',adminController.adminLoginCheck);


adminRoutes.get('/adminHome',adminController.auth,adminSalesController.sales);
adminRoutes.post('/adminHome',adminSalesController.getSalesByDate);
adminRoutes.get('/addproduct',adminController.auth,adminProductController.adminProductAddLoad);
adminRoutes.get('/addCoupon',adminController.auth,adminCategoryController.adminCouponAddLoad)
adminRoutes.post('/addproduct',upload.any('images'),adminProductController.insertProduct );
adminRoutes.post('/addCoupon',adminCategoryController.insertCoupon );
adminRoutes.get('/productList',adminController.auth,adminProductController.showProduct);

adminRoutes.get('/userList',adminController.auth,adminUserController.showUser);
adminRoutes.get('/unlist-product',adminController.auth,adminProductController.unlistProduct);
adminRoutes.get('/list-product',adminController.auth,adminProductController.unlistProduct);
adminRoutes.get('/unlist-category',adminController.auth,adminCategoryController.unlistcategory);
adminRoutes.get('/list-category',adminController.auth,adminCategoryController.unlistcategory);
adminRoutes.get('/unlist-user',adminController.auth,adminUserController.unlistUser);
adminRoutes.get('/list-coupon',adminController.auth,adminCouponController.unlistcoupon);
adminRoutes.get('/unlist-coupon',adminController.auth,adminCouponController.unlistcoupon);
adminRoutes.get('/list-user',adminController.auth,adminUserController.unlistUser);
adminRoutes.get('/updateProduct',adminController.auth,adminProductController.editProductPage);
adminRoutes.post('/update/:id',adminProductController.postingEditProductPage);
adminRoutes.post('/userList/update/:id',adminUserController.updateUser);
adminRoutes.get('/coupons',adminController.auth,adminCouponController.showCoupon);

adminRoutes.get('/orderDetails',adminController.auth,adminOrderController.orderDetails);
adminRoutes.get('/unlist-order',adminController.auth,adminOrderController.unlistOrder);
adminRoutes.get('/list-order',adminOrderController.unlistOrder);
adminRoutes.get('/unlist-orders',adminController.auth,adminOrderController.unlistOrders);
adminRoutes.get('/list-orders',adminController.auth,adminOrderController.unlistOrders);
adminRoutes.get('/order',adminController.auth, adminOrderController.getOrder);
adminRoutes.get('/categories',adminController.auth, adminCategoryController.getCategories);
adminRoutes.get('/addCategory',adminController.auth, adminCategoryController.getAddCategory);
adminRoutes.post('/addCategory', adminCategoryController.postAddCategory);
adminRoutes.get('/editCategory/:id',adminController.auth, adminCategoryController.getEditCategory);
adminRoutes.get('/editPostProduct/:id',adminController.auth, adminProductController.getEditPro);
adminRoutes.post('/editCategory/:id', adminCategoryController.postEditCategory);
adminRoutes.post('/editPostProduct/:id',upload.any('images'), adminProductController.postEditPro);
adminRoutes.get('/deleteCategory/:id',adminController.auth, adminCategoryController.deleteCategory);
adminRoutes.get('/orderDetails',adminController.auth,adminOrderController.orderDetails);
adminRoutes.post('/dispatchs',adminOrderController.dispatch);
       

adminRoutes.get('/banners',adminController.auth, adminBannerController.getBannerList);
adminRoutes.get('/banner',adminController.auth, adminBannerController.getBannerAddForm);
adminRoutes.post('/banner',upload.single('image'), adminBannerController.postBannerAddForm);
adminRoutes.get('/edit/:id',adminController.auth, adminBannerController.getBannerEditForm);
adminRoutes.post('/edit/:id',upload.single('image'), adminBannerController.postBannerEditForm);
adminRoutes.post('/delete/:id', adminBannerController.deleteBanner);



adminRoutes.get('/origins', adminOriginController.getOrigin);
adminRoutes.get('/addOrigin', adminOriginController.getAddOrigin);
adminRoutes.post('/addOrigin', adminOriginController.postAddOrigin);
adminRoutes.get('/editOrigin/:id', adminOriginController.getEditOrigin);
adminRoutes.post('/editOrigin/:id', adminOriginController.postEditOrigin);
adminRoutes.get('/deleteOrigin/:id', adminOriginController.deleteOrigin);
adminRoutes.get('/logout',adminController.logout);
adminRoutes.get('/sales',adminController.auth,adminSalesController.sales);
adminRoutes.post('/sales',adminSalesController.getSalesByDate);


module.exports=adminRoutes;