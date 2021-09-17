const express = require('express');
const auth = require('../config/auth');
const adminAuth = require('../config/adminAuth');
const vendorAuth = require('../config/vendorAuth');
const admin_controller = require('../controller/admin_controller');
const home_controller = require('../controller/home_controller');
const bannerModel = require('../model/banner_model')
const router = express.Router();
const profileImgUpload = require('../services/ImageUpload')
const pdfUpload = require('../services/pdfUpload')
const {check,body} = require('express-validator/check');
router.post('/banner' , profileImgUpload.single('file'), (req,res,next)=>{
  

  if (req.file===undefined) {
    let banner = new bannerModel({
      title: req.body.title,
      file: null
    })

    banner.save()
    .then(data=>{
           // console.log(data);
            req.flash('success' ,'data save success');
           //res.redirect('/admin/index')
           res.redirect('/viewBanner')
          })     
          .catch(err=>{
            console.log(err);
          })
  } else {
    let banner = new bannerModel({
      title: req.body.title,
      file: req.file.location
    })

    banner.save()
    .then(data=>{
            console.log(data);
            req.flash('success' ,'data save success');
          
           res.redirect('/viewBanner')
          })     
          .catch(err=>{
            console.log(err);
          })


  }

 
})



router.get('/viewBanner' ,admin_controller.viewBanner)
router.get('/editBanner/:id' ,  admin_controller.editBanners);
 router.post('/ban_update' , profileImgUpload.single('file'), admin_controller.bannerUpdates);
router.get('/deleteBanner/:id',admin_controller.deleteBanners)

router.get('/contactDetail',admin_controller.getContactdetails);
router.post('/contactAddress',admin_controller.postContactAddress);

router.get('/viewContactAddress' ,admin_controller.viewcontactAddress);
router.get('/deletedata/:id' ,admin_controller.deletecontactAddress);
router.get('/editUContactAddressser/:id' ,admin_controller.doEditContactAddress);
router.post('/contact_update' ,admin_controller.doUpdateContactAddress);


router.get('/addOffer',admin_controller.addOffers);
router.post('/addOffer', profileImgUpload.single('file'), admin_controller.postOffer);
router.get('/viewOffer' ,admin_controller.viewOffers);
router.get('/deleteOffer/:id' ,admin_controller.deleteOffers);
router.get('/editOffer/:id' ,admin_controller.doEditOffer);
router.post('/offer_update' , profileImgUpload.single('file'), admin_controller.doUpdateOffer);


router.get('/dashboard',auth,admin_controller.getDashboard);

router.get('/admin/index',adminAuth,admin_controller.getAdmin );
router.get('/userList',adminAuth,admin_controller.getUser);
router.get('/editUser/:id' ,adminAuth,admin_controller.doEdit);
router.post('/update' ,adminAuth,admin_controller.doUpdate);
router.post('/updateuser' ,adminAuth,admin_controller.doUpdateUser);
router.get('/deleteUser/:id' ,adminAuth,admin_controller.doDelete);
router.get('/statusUser/:id' ,adminAuth,admin_controller.doUpdatestatus);
router.get('/statusUsers/:id' ,adminAuth,admin_controller.doUpdatestatuss);

router.get('/category',adminAuth,admin_controller.getCategory);
router.get('/editCategory/:id',admin_controller.categoryEdit);
router.post('/cat_update',admin_controller.catUpdate);
router.get('/deleteCategory/:id' ,admin_controller.deleteCategory);


router.get('/subCategory',adminAuth,admin_controller.getSubCategory);
router.get('/editSubCategory/:id',admin_controller.subCategoryEdit);
router.post('/subcat_update',admin_controller.subCatUpdate);
router.get('/deleteSubCategory/:id' ,admin_controller.deleteSubCategory);

router.get('/viewcategory',admin_controller.viewsCategory);
router.get('/viewsubCategory',admin_controller.viewsSubCategory);
router.get('/viewAbout',admin_controller.viewAbout);


// router.get('/addproduct',admin_controller.getProduct);
// router.get('/productList',admin_controller.getProductList);

router.get('/admin',admin_controller.adminLogin);

router.get('/vendor',admin_controller.vendorRegistration);
router.post('/vendor' ,[check('phone').isLength({min:10,max:10}).isMobilePhone()
.withMessage('phone number should be 10 digits')]
,admin_controller.vendorRegistrationcomplete);


// router.get('/vendor',admin_controller.vendorRegistration);
// router.get('/vendor/account_page' ,home_controller.accountPage);
router.get('/vendor/account_page' ,admin_controller.vendoraccountPage);

router.post('/vendor_auth', pdfUpload.array('doc', 2),admin_controller.postRegistration);
router.post('/login_authen' ,admin_controller.postloginvendor);
router.get('/vendor/index',vendorAuth,admin_controller.getVendor);
router.get('/vendorList'  ,admin_controller.getVendorList);
router.get('/vendorProfile',admin_controller.profile);


router.post('/login_admin' ,admin_controller.postAdmin);

//category route
router.post('/category' ,admin_controller.postCategory);
router.post('/subCategory' ,admin_controller.postSubCategory);



router.get('/orderData',admin_controller.getOrder);
router.get('/vendorOrder' ,admin_controller.getVendorOrder);


router.get('/rating' ,adminAuth,admin_controller.adminRating);
router.get('/edit-rating/:id' ,admin_controller.editRating);
router.post('/updateRating/:id' ,admin_controller.updateRating);
router.get('/delete-rating/:id',admin_controller.deleteRating);

//vendor route
// router.get('/vendor_list' ,admin_controller.adminRating);
// router.get('/edit-vendor/:id' ,admin_controller.editRating);
// router.post('/updatevendor/:id' ,admin_controller.updateRating);
// router.get('/delete-vendor/:id',admin_controller.deleteRating);



router.get('/about',admin_controller.about);
router.post('/addAbout' , admin_controller.addAbout);
router.get('/editAbout/:id',admin_controller.editAbout);
router.post('/about_update',admin_controller.about_updates);
router.get('/deleteAbout/:id' ,admin_controller.deleteAbout);

router.post('/contact',admin_controller.contact);//home
router.get('/offer' ,admin_controller.offer);//home
router.get('/faq' ,admin_controller.help);   //home
router.get('/policy' ,admin_controller.policy);  //home
router.get('/condition' ,admin_controller.condition);  //home
router.get('/return' ,admin_controller.return);   //home


router.get('/adminPpolicy' ,admin_controller.addPrivacyPolicy);  //admin get
router.get('/adminCondition' ,admin_controller.addCondition);
router.get('/adminRpolicy' ,admin_controller.addReturnPolicy);
router.get('/adminFaq' ,admin_controller.addFaq);

router.post('/postfaq' ,admin_controller.posthelp);   //admin post
router.post('/postprivacy' ,admin_controller.postprivacy);  
router.post('/postCondition' ,admin_controller.postcondition);  
router.post('/postReturn' ,admin_controller.postreturn);  


router.get('/viewFaq' ,admin_controller.viewhelp);   //admin view
router.get('/viewPolicy' ,admin_controller.viewpolicy);  //admin
router.get('/viewCondition' ,admin_controller.viewcondition);  //admin
router.get('/viewReturn' ,admin_controller.viewreturn);   //admin

router.get('/editFaq/:id',admin_controller.editFaq); //admin edit

router.get('/editCondition/:id',admin_controller.editcondition); //admin edit

router.get('/editPrivacy/:id',admin_controller.editprivacy); //admin edit

router.get('/editReturn/:id',admin_controller.editreturn); //admin edit

router.get('/deleteFaq/:id',admin_controller.deletefaq); //admin delete

router.get('/deleteCondition/:id',admin_controller.deletecondition); //admin delete

router.get('/deletePrivacy/:id',admin_controller.deleteprivacy); //admin delete

router.get('/deleteReturn/:id',admin_controller.deletereturn); //admin delete

router.post('/faq_update',admin_controller.updatefaq);
router.post('/condition_update',admin_controller.updatecondition);
router.post('/privacy_update',admin_controller.updateprivacy);
router.post('/return_update',admin_controller.updatereturn);




//deliverCharge
router.get('/adminshipcharge',admin_controller.getshipcharge);
router.post('/shipcharge', admin_controller.createcharge);
router.get('/viewCharge' ,admin_controller.viewcharge);   //admin view
router.get('/editCharge/:id',admin_controller.editCharge);
router.post('/charge_update',admin_controller.chargeUpdates);
router.get('/deleteCharge/:id' ,admin_controller.deleteCharge);

//vendor

router.get('/vendor_edit/:id' , admin_controller.vendorEdit);
router.post('/vendor_update' , admin_controller.vendor_updates);

//admin user
router.get('/user_edit_by_admin/:id' , admin_controller.UserUpdateByAdmin);
router.post('/user_edit_by_admin_update' , admin_controller.user_updates_By_Admin);




router.get('/viewContact',admin_controller.viewContact);
router.get('/editcontact/:id',admin_controller.editContact);
router.post('/contact_update/:id',admin_controller.contactUpdates);
router.get('/deletecontact/:id' ,admin_controller.deleteContact);

router.get('/banner' ,admin_controller.banner)



router.get('/admminLogout',(req,res,next)=>{
  req.logout();


  req.flash('success', 'You are admin and u r logged out!');
  return res.redirect('/admin')
})

router.get('/vendorLogout',(req,res,next)=>{
  req.logout();

  req.flash('success', 'You are vendor and u r logged out!');
  return res.redirect('/vendor')
})
// router.get('/addbook' ,authCheck,admin_controller.doAddBook);
// router.post('/book_auth',authCheck,admin_controller.addBook);

//new added 13-8-21
router.get('/loggedadmin' ,admin_controller.getlogUser);
router.get('/admin_account_page' ,home_controller.accountPage);
router.get('/admin_changePassword' ,home_controller.forgotPassword);

router.get('/adminprofile' ,auth,home_controller.getlogUser);
//new added 13-8-21

module.exports = router;