const productModel = require('../model/productModel');
const userModel = require('../model/user_model');
const order = require('../model/order');
const contactModel = require('../model/touchModel');
const aboutModel = require('../model/about_model');
const categorySubModel = require('../model/imageSubCategory');
const imageCategoryModel = require('../model/imageCategoryModel');
const ratingModel = require('../model/rating');
const bannerModel = require('../model/banner_model');
const galleryModel = require('../model/gallery');
const vidioModel = require('../model/vidio_model');
const pujaModel = require('../model/pujaheadModel');
const moment = require('moment');
const LocalStrategy = require('passport-local').Strategy
const path = require('path');
const { validationResult } = require('express-validator/check');
var fs = require('fs-extra');
const noty = require('noty');

var resizeImg = require('resize-img');
var mkdirp = require('mkdirp');
const { db, distinct, getMaxListeners } = require('../model/imageCategoryModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { resolve } = require('path');
const { json } = require('body-parser');
const flash = require('express-flash');
const { default: Axios } = require('axios');
const { constants } = require('buffer');
// const { match } = require('assert');
exports.forgotPassword =(req,res,next)=>{
   

    // console.log(req.user.email);
  
    const user_id = req.user.email;
    
    res.render('resetPassword' ,{
        title:"reset",
        error:[],
        datauser:user_id,
    })
   }

exports.resetPassword =(req,res,next)=>{
    const new_password = req.body.newPassword;
    const old_password = req.body.oldPassword;
    const emailId = req.user.email;
    
console.log("new" ,new_password);
console.log("old" ,old_password);
console.log("email" ,emailId);

    userModel.findOne({'email':emailId})
        .then(admin => {
            console.log("olda",admin);
            return bcrypt.compare(old_password, admin.password)
                .then(passwordMatch => {
                    if (passwordMatch) {
                        console.log("old",passwordMatch);
                        return bcrypt.hash(new_password, 12)
                            .then(hashpass => {
                                return bcrypt.compare(new_password, admin.password)
                                    .then(passmatch => {
                                        if (passmatch) {
                                            console.log('old and new password cannot be same');
                                            res.redirect('/new_reset');

                                        }
                                        else {
                                            return userModel.findOne({'email': emailId})
                                                .then(admin => {
                                                    console.log('passbefore' ,admin.password);
                                                    admin.password = hashpass;
                                                    console.log('passafter' ,admin.password);

                                                    return admin.save()
                                                        .then(result => {
                                                     req.flash('success',"password update successfully")
                                                            console.log('password succesfully updated');
                                                            res.redirect('/')

                                                           

                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                        })
                                                })

                                                .catch(err => {
                                                    console.log(err);
                                                })
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }
                    else {
                        return res.status(401).json({
                            success: false,
                            message: "old password not match",

                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }).catch(err => {
            console.log(err);
        })


}

    
   

// exports.resetPassword =async(req,res,next)=>{
 
//     let data = await userModel.find({'email':req.body.email})
//    console.log(data);
//    res.redirect('/account_page');
      
//     }    

exports.page =async(req,res,next)=>{
    let counter = await productModel.countDocuments();
    // console.log("counter",counter)
    // let perPage = 4;
    // let totalPages = Math.floor(counter/perPage);
    // console.log("page",totalPages);
    // console.log(req.params.page)
    imageCategoryModel.find()
    .then(result => {
        if (result) {
            db.collection('categories').aggregate([
  
                // Join with user_info table
                {
                    $lookup: {
                        from: 'sub_categories',       // other table name
                        localField: 'category',   // name of users table field
                        foreignField: 'category', // name of userinfo table field
                        as: 'category_info'         // alias for userinfo table
                    }
                },
  
                {
                    $lookup: {
                        from: 'products',
                        localField: 'category',
                        foreignField: 'category',
                        as: 'product_role'
                    }
                },
  
            ]).toArray(function (err, resullt) {
  
                if (err)
                    console.log(err);
  
  
                categorySubModel.find()
  
                    .then(catData => {
                        if (catData) {
                            db.collection('sub_categories').aggregate([
                                {
                                    $lookup: {
                                        from: 'products',       // other table name
                                        localField: 'subCategory',   // name of users table field
                                        foreignField: 'subCategory', // name of userinfo table field
                                        as: 'category_info'         // alias for userinfo table
                                    }
                                },
  
                            ]).toArray(function (err, commoncount) {
                                //   console.log(commoncount)
                                if (commoncount) {
                                    let page = req.params.page;
                                    if (page) {
                                        currentPage = page;
                                    }
                                    let perPage = 4;
                                    let skip = (currentPage - 1) * perPage;
                                    // let totalPages = (counter/perPage);
                                    // console.log("page",totalPages);
                                    productModel.find().sort({ "subCategory": 1 })
                                        .then(products => {
                                            res.render('page', {
                                                title: "filter",
                                                category: catData,
                                                data: resullt,
                                                count: commoncount,
                                                products: products,
                                                skip:skip,
                                                perPage:perPage,
                                                currentPage:currentPage,
                                                counter:counter
                                                
                                            })
  
  
  
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        })
  
                                }
                            })
  
  
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
  
  
  
            })
        }
        else {
            console.log("category not found");
        }
    })
    .catch(err => {
        console.log(err);
    })
  
  
         
}

exports.filter = async(req, res, next) => {
   

    imageCategoryModel.find()
        .then(result => {
            if (result) {
                db.collection('categories').aggregate([

                    // Join with user_info table
                    {
                        $lookup: {
                            from: 'sub_categories',       // other table name
                            localField: 'category',   // name of users table field
                            foreignField: 'category', // name of userinfo table field
                            as: 'category_info'         // alias for userinfo table
                        }
                    },

                    {
                        $lookup: {
                            from: 'products',
                            localField: 'category',
                            foreignField: 'category',
                            as: 'product_role'
                        }
                    },

                ]).toArray(function (err, resullt) {

                    if (err)
                        console.log(err);


                    categorySubModel.find()

                        .then(catData => {
                            if (catData) {
                                db.collection('sub_categories').aggregate([
                                    {
                                        $lookup: {
                                            from: 'products',       // other table name
                                            localField: 'subCategory',   // name of users table field
                                            foreignField: 'subCategory', // name of userinfo table field
                                            as: 'category_info'         // alias for userinfo table
                                        }
                                    },

                                ]).toArray(function (err, commoncount) {
                                    //   console.log(commoncount)
                                    if (commoncount) {
                                       
                                        productModel.find().sort({ "subCategory": 1 })
                                            .then(products => {
                                                res.render('filter1', {
                                                    title: "filter",
                                                    category: catData,
                                                    data: resullt,
                                                    count: commoncount,
                                                    currentPage:1,
                                                    perPage:4,
                                                    products: products
                                                })



                                            })
                                            .catch(err => {
                                                console.log(err);
                                            })

                                    }
                                })


                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })



                })
            }
            else {
                console.log("category not found");
            }
        })
        .catch(err => {
            console.log(err);
        })



}

exports.filterbySize =async(req,res,next)=>{
    console.log(req.params.size)
     var size = req.params.size;
    if( size == 's'){
      const data = await  productModel.find({size:size})
      console.log(data);
    }
}

exports.userRating = (req, res, next) => {
   // console.log( 'rating_details ',req.body);
   if(req.user){
    const rating = new ratingModel(

        {

            quality: req.body.quality.trim(),
            price: req.body.price.trim(),
            value: req.body.value.trim(),
            name: req.body.name.trim(),
            summary: req.body.summary.trim(),
            review: req.body.review.trim(),
            userId: req.user,
            productId: req.body.id


        }

    )
    return rating.save()
    .then(result => {
        ratingModel.find({productId:req.body.id} ,function(err ,resp){
            if(err){
                console.log(err)
            }else{
                // console.log(resp);
                productModel.findOneAndUpdate({'_id':req.body.id},
                {$set: {
              
                 topRating: resp.length
                
             }
            
             }).then(results=>{
                req.flash('success' ,"rating saved")
               res.redirect('/');
                 
             })
             .catch(error=>(console.log(error)))
            
            }
           
        
        })
     
     

    })
    .catch(err => {
        console.log(err);
    });
   }else{
       req.flash('success' ,"register required");
       res.redirect('/account_page')
   }




}
exports.about = async(req, res, next) => {
    const about = await aboutModel.find()
    res.render('about_us', {
        title: "about",
        about: about.length>0?about:null
    })
    
}

exports.contact = async(req, res, next) => {

    const mycontact = await contactModel.find()
    res.render('contact_us', {
        title: "contact",
        contact: mycontact.length>0?mycontact:null
    })
}


exports.allProduct = (req, res, next) => {
   // console.log(req.query)
    imageCategoryModel.find()
        .then(result => {
            if (result) {
                db.collection('categories').aggregate([

                    // Join with user_info table
                    {
                        $lookup: {
                            from: 'sub_categories',       // other table name
                            localField: 'category',   // name of users table field
                            foreignField: 'category', // name of userinfo table field
                            as: 'category_info'         // alias for userinfo table
                        }
                    },

                    {
                        $lookup: {
                            from: 'products',
                            localField: 'category',
                            foreignField: 'category',
                            as: 'product_role'
                        }
                    },

                ]).toArray(function (err, resullt) {

                    if (err)
                        console.log(err);


                    categorySubModel.find()

                        .then(catData => {
                            if (catData) {
                                db.collection('sub_categories').aggregate([
                                    {
                                        $lookup: {
                                            from: 'products',       // other table name
                                            localField: 'subCategory',   // name of users table field
                                            foreignField: 'subCategory', // name of userinfo table field
                                            as: 'category_info'         // alias for userinfo table
                                        }
                                    },

                                ]).toArray(function (err, commoncount) {
                                    //   console.log(JSON.stringify(commoncount))
                                    if (commoncount) {
                                        productModel.find(function (err, products) {
                                            if (err)
                                                console.log(err);

                                            res.render('filter1', {
                                                title: 'All products',
                                                products: products,
                                                category: catData,
                                                data: resullt,
                                                count: commoncount,
                                            });
                                        });

                                    }
                                })


                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })



                })
            }
            else {
                req.flash('success' ,'category not found');
                console.log("category not found");
            }
        })
        .catch(err => {
            console.log(err);
        })




}

exports.newArrival = (req, res, next) => {
    imageCategoryModel.find()
        .then(result => {
            if (result) {
                db.collection('categories').aggregate([

                    // Join with user_info table
                    {
                        $lookup: {
                            from: 'sub_categories',       // other table name
                            localField: 'category',   // name of users table field
                            foreignField: 'category', // name of userinfo table field
                            as: 'category_info'         // alias for userinfo table
                        }
                    },

                    {
                        $lookup: {
                            from: 'products',
                            localField: 'category',
                            foreignField: 'category',
                            as: 'product_role'
                        }
                    },

                ]).toArray(function (err, resullt) {

                    if (err)
                        console.log(err);


                    categorySubModel.find()

                        .then(catData => {
                            if (catData) {
                                db.collection('sub_categories').aggregate([
                                    {
                                        $lookup: {
                                            from: 'products',       // other table name
                                            localField: 'subCategory',   // name of users table field
                                            foreignField: 'subCategory', // name of userinfo table field
                                            as: 'category_info'         // alias for userinfo table
                                        }
                                    },

                                ]).toArray(function (err, commoncount) {
                                    //   console.log(JSON.stringify(commoncount))
                                    if (commoncount) {
                                        productModel.find().limit(4)
                                            .then(products => {
                                                res.render('filter3', {
                                                    title: 'All products',
                                                    products: products,
                                                    category: catData,
                                                    data: resullt,
                                                    count: commoncount,
                                                    subCategory:[]
                                                });

                                            })
                                            .catch(err => {
                                                console.log(err);
                                            })




                                    }
                                })


                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })



                })
            }
            else {
                req.flash('success' ,'category not found');
                console.log("category not found");
            }
        })
        .catch(err => {
            console.log(err);
        })




}

exports.mostSelling = (req, res, next) => {
    imageCategoryModel.find()
        .then(result => {
            if (result) {
                db.collection('categories').aggregate([

                    // Join with user_info table
                    {
                        $lookup: {
                            from: 'sub_categories',       // other table name
                            localField: 'category',   // name of users table field
                            foreignField: 'category', // name of userinfo table field
                            as: 'category_info'         // alias for userinfo table
                        }
                    },

                    {
                        $lookup: {
                            from: 'products',
                            localField: 'category',
                            foreignField: 'category',
                            as: 'product_role'
                        }
                    },

                ]).toArray(function (err, resullt) {

                    if (err)
                        console.log(err);


                    categorySubModel.find()

                        .then(catData => {
                            if (catData) {
                                db.collection('sub_categories').aggregate([
                                    {
                                        $lookup: {
                                            from: 'products',       // other table name
                                            localField: 'subCategory',   // name of users table field
                                            foreignField: 'subCategory', // name of userinfo table field
                                            as: 'category_info'         // alias for userinfo table
                                        }
                                    },

                                ]).toArray(function (err, commoncount) {
                                    //   console.log(JSON.stringify(commoncount))
                                    if (commoncount) {
                                        
                                        productModel.find().sort({sold:-1})
                                            .then(products => {
                                               
                                                if(products.length>0){
                                                
                                                    res.render('popular', {
                                                        title: 'All products',
                                                        products: products.length>0?products:null,
                                                        category: catData,
                                                        data: resullt,
                                                        count: commoncount,
                                                    });
                                                }else{
                                                    req.flash('success' ,'product not found');
                                                    res.redirect('/notfound');
                                                }
                                                

                                            })
                                            .catch(err => {
                                                console.log(err);
                                            })




                                    }
                                })


                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })



                })
            }
            else {
                console.log("category not found");
            }
        })
        .catch(err => {
            console.log(err);
        })





}


exports.notFound =(req,res,next)=>{
    imageCategoryModel.find()
        .then(result => {
            if (result) {
                db.collection('categories').aggregate([

                    // Join with user_info table
                    {
                        $lookup: {
                            from: 'sub_categories',       // other table name
                            localField: 'category',   // name of users table field
                            foreignField: 'category', // name of userinfo table field
                            as: 'category_info'         // alias for userinfo table
                        }
                    },

                    {
                        $lookup: {
                            from: 'products',
                            localField: 'category',
                            foreignField: 'category',
                            as: 'product_role'
                        }
                    },

                ]).toArray(function (err, resullt) {

                    if (err)
                        console.log(err);


                    categorySubModel.find()

                        .then(catData => {
                            if (catData) {
                                db.collection('sub_categories').aggregate([
                                    {
                                        $lookup: {
                                            from: 'products',       // other table name
                                            localField: 'subCategory',   // name of users table field
                                            foreignField: 'subCategory', // name of userinfo table field
                                            as: 'category_info'         // alias for userinfo table
                                        }
                                    },

                                ]).toArray(function (err, commoncount) {
                                    //   console.log(JSON.stringify(commoncount))
                                    if (commoncount) {
                                       
                                                res.render('notFound', {
                                                    title: 'All products',
                                                    category: catData,
                                                    data: resullt,
                                                    count: commoncount,
                                                });

                                            
                                           



                                    }
                                   
                                })


                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })



                })
            }
            else {
                console.log("category not found");
            }
        })
        .catch(err => {
            console.log(err);
        })





}




exports.singleGrid = async(req, res, next) => {
//    console.log(req.params.id); 
  const productId = req.params.id;
  try {
    var singleProduct = await productModel.findById(productId);
    var rating = await ratingModel.find({productId:productId});
    var gallery = await galleryModel.find({productId:productId});
    var relatedProduct = await  productModel.find({ subCategory: singleProduct.subCategory });

    // console.log("rating",rating); 
     if(singleProduct){

         res.render('single_product', {
             products: singleProduct,
             galleryImages: gallery,
             id: productId,
             related: relatedProduct,
             ratingData: rating,
             moment: moment,
             title:singleProduct.subCategory,
             
 
         });
     }

      
  } catch (error) {
    
      console.log(error);
  }
  
   
}

// exports.singleGrid = (req, res, next) => {
//     imageCategoryModel.find()
//         .then(result => {
//             if (result) {
//                 db.collection('categories').aggregate([

//                     // Join with user_info table
//                     {
//                         $lookup: {
//                             from: 'sub_categories',       // other table name
//                             localField: 'category',   // name of users table field
//                             foreignField: 'category', // name of userinfo table field
//                             as: 'category_info'         // alias for userinfo table
//                         }
//                     },

//                     {
//                         $lookup: {
//                             from: 'products',
//                             localField: 'category',
//                             foreignField: 'category',
//                             as: 'product_role'
//                         }
//                     },

//                 ]).toArray(function (err, resullt) {

//                     if (err)
//                         console.log(err);

//                     productModel.findById(req.params.id, function (err, p) {
//                         if (err) {
//                             console.log(err);
//                             res.redirect('/product');
//                         } else {
//                             galleryModel.find({ productId: req.params.id })
//                                 .then(galleryImages => {
//                                     if (galleryImages) {
//                                         productModel.find({ subCategory: p.subCategory })
//                                             .then(relatedProduct => {
//                                                 //console.log(relatedProduct);
//                                                 if (relatedProduct) {
//                                                     ratingModel.find({ productId: req.params.id, userId: req.user })
//                                                         .then(ratingData => {
//                                                             //console.log(ratingData)
//                                                             res.render('single_product', {
//                                                                 products: p,
//                                                                 galleryImages: galleryImages,
//                                                                 id: p._id,
//                                                                 data: resullt,
//                                                                 message: req.flash('message'),
//                                                                 related: relatedProduct,
//                                                                 ratingData: ratingData,
//                                                                 moment: moment

//                                                             });

//                                                         })
//                                                         .catch(err => {
//                                                             console.log(err);
//                                                         })
//                                                 } else {
//                                                     console.log("product not found");
//                                                 }

//                                             })

//                                     }
//                                     else {
//                                         console.log("gallery not Found");
//                                     }
//                                 })
//                                 .catch(err => {
//                                     console.log(err);
//                                 })
//                         }
//                     });







//                 })
//             }
//             else {
//                 console.log("category not found");
//             }
//         })
//         .catch(err => {
//             console.log(err);
//         })


// }
exports.singlepageCartGrid =(req,res,next)=>{
    
    categoryslug = req.params.id;
    // console.log(categoryslug);
    // console.log(req.body.qty);
    productModel.findById(req.params.id)
        .then(singleData => {
            //  console.log('singleDatahome', singleData);
            if (singleData) {

                if (typeof req.session.cart == "undefined") {
                    req.session.cart = [];
                    req.session.cart.push({
                        _id: singleData._id,
                        title: singleData.title,
                        qty: 1,
                        color:singleData.color,
                        size:singleData.size,
                        price:singleData.tag,
                        VendorId:singleData.VendorId,
                        image:singleData.image,
                        brand:singleData.subCategory,
                        productName:singleData.title,
                        stock:singleData.availability,
                        

                    })
                    
                } else {
                    var cart = req.session.cart;
                    var newItem = true;

                    for (var i = 0; i < cart.length; i++) {
                        if (cart[i].title == singleData.title) {
                            cart[i].qty++;
                            newItem = false;
                            break;
                        }
                    }


                    if (newItem) {
                        cart.push({
                            _id: singleData._id,
                            title: singleData.title,
                            qty: 1,
                            color: singleData.color,
                            size: singleData.size,
                            VendorId: singleData.VendorId,
                            price: parseFloat(singleData.tag).toFixed(2),
                            brand:singleData.subCategory,
                            productName:singleData.title,
                            image:singleData.image,
                            stock:singleData.availability,
                            
                        });
                        
                    }
                }
                req.flash('success' ,'add to cart successfully');
                res.redirect('back');
            }


        })
        .catch(err => {
            console.log(err);
        })
}

exports.singleCartGrid = (req, res, next) => {

    categoryslug = req.params.id;
    
    console.log(req.body);
    productModel.findById(req.params.id)
        .then(singleData => {
            console.log('singleData', singleData.availability);
            if (singleData) {

                if (typeof req.session.cart == "undefined") {
                    req.session.cart = [];
                    req.session.cart.push({
                        _id: singleData._id,
                        title: singleData.title,
                        qty: req.body.qty,
                        color: req.body.color,
                        size: req.body.size,
                        price: singleData.tag,
                        VendorId: singleData.VendorId,
                        brand:singleData.subCategory,
                        productName:singleData.title,
                        image:singleData.image,
                        stock:singleData.availability

                    })
                } else {
                    var cart = req.session.cart;
                    var newItem = true;

                    for (var i = 0; i < cart.length; i++) {
                        if (cart[i].title == singleData.title && cart[i].color == req.body.color && cart[i].size == req.body.size) {
                            cart[i].qty++;
                           
                            newItem = false;
                            break;
                        }
                    }


                    if (newItem) {
                        
                        cart.push({
                            _id: singleData._id,
                            title: singleData.title,
                            qty: req.body.qty,
                            color: req.body.color,
                            size: req.body.size,
                            VendorId: singleData.VendorId,
                            price: parseFloat(singleData.tag).toFixed(2),
                            brand:singleData.subCategory,
                            productName:singleData.title,
                            image:singleData.image,
                            stock:singleData.availability
                        });
                    }
                }
                req.flash('success' ,'add to cart successfully');
                res.redirect('back');
            }else{
                req.flash('success' ,'add to cart failed item out of stock');
                res.redirect('back');
            }


        })
        .catch(err => {
            console.log(err);
        })
}

exports.wishlist = (req, res, next) => {
    categoryslug = req.params.id;
   

    productModel.findById(categoryslug)
        .then(singleData => {
            console.log('slug',singleData);
            if (singleData) {

                if (typeof req.session.wishlist == "undefined") {
                    req.session.wishlist = [];
                    req.session.wishlist.push({
                        _id: singleData._id,
                        title: singleData.title,
                        // qty: req.body.qty,
                        // color: req.body.color,
                        // size: req.body.size,
                        price: singleData.tag,
                        VendorId: singleData.VendorId,
                        image:  singleData.image[0],
                        customerId: req.user._id

                    })
                } else {
                    var wishlist = req.session.wishlist;
                    var newItem = true;

                    for (var i = 0; i < wishlist.length; i++) {
                        if (wishlist[i].title == singleData.title) {
                            wishlist[i].qty++;
                            newItem = false;
                            break;
                        }
                    }


                    if (newItem) {
                        wishlist.push({
                            _id: singleData._id,
                            title: singleData.title,
                            // qty: req.body.qty,
                            // color: req.body.color,
                            // size: req.body.size,
                            VendorId: singleData.VendorId,
                            price: parseFloat(singleData.tag).toFixed(2),
                            image:  singleData.image[0],
                            customerId: req.user?req.user._id:null
                        });
                    }
                }
                req.flash('success', 'added to wishlist');
                res.redirect('back');
            }


        })
        .catch(err => {
            console.log(err);
        })
}

// exports.wishCartGrid = (req,res,next)=>{
//     categoryslug = req.params.id;
//     // console.log(categoryslug);
//     // console.log(req.body.qty);
//     productModel.findById(req.params.id)
//         .then(singleData => {
//             // console.log(singleData);
//             if (singleData) {

//                 if (typeof req.session.cart == "undefined") {
//                     req.session.cart = [];
//                     req.session.cart.push({
//                         _id: singleData._id,
//                         title: singleData.title,
//                         qty: req.body.qty,
//                         color: req.body.color,
//                         size: req.body.size,
//                         price: singleData.price,
//                         VendorId: singleData.VendorId,
//                         image:  singleData.image[0],

//                     })
//                 } else {
//                     var cart = req.session.cart;
//                     var newItem = true;

//                     for (var i = 0; i < cart.length; i++) {
//                         if (cart[i].title == singleData.title) {
//                             cart[i].qty++;
//                             newItem = false;
//                             break;
//                         }
//                     }


//                     if (newItem) {
//                         cart.push({
//                             _id: singleData._id,
//                             title: singleData.title,
//                             qty: req.body.qty,
//                             color: req.body.color,
//                             size: req.body.size,
//                             VendorId: singleData.VendorId,
//                             price: parseFloat(singleData.price).toFixed(2),
//                             image:  singleData.image
//                         });
//                     }
//                 }

//                 res.redirect('back');
//             }


//         })
//         .catch(err => {
//             console.log(err);
//         })
// }


exports.myWishlist = async (req, res, next) => {
    const wish = req.session.wishlist;
    // console.log(wish)
    userId = req.session.passport.user;
    // console.log("user" ,userId);
    try {
        if (wish) {
            const data = await wish.filter(wist => wist.customerId == String(userId))
           
            res.render('wishlist', {
                title: "wishlist",
                wislistData: data,
                message: req.flash('message')
            })
        }
        else {
            res.redirect('/wishlistError');
        }

    } catch (error) {
        console.log(error);
    }

}
exports.wishlistError = (req, res, next) => {
    res.render('wishlistError', {
        title: "wisherror"
    })
}

// exports.wishCartGrid = (req,res,next)=>{
//     console.log(req.user);
//     categoryslug = req.params.id;
//     console.log(categoryslug);
//     console.log(req.body.qty);
//     productModel.findById(req.params.id)
//     .then(singleData=>{
//         console.log(singleData);
//         if(singleData)
//         {

//             if (typeof req.session.cart == "undefined") {
//                   req.session.cart =[];
//                   req.session.cart.push({
//                       _id :singleData._id,
//                       title:singleData.title,
//                       qty:req.body.qty,
//                       color:req.body.color,
//                       size:req.body.size,
//                       price:singleData.price,
//                       VendorId:singleData.VendorId,
//                       image:'/productImage/' + singleData._id + '/' + singleData.image,
//                       customerId:req.user

//                   })
//             } else {
//                 var cart = req.session.cart;
//                 var newItem = true;

//                 for (var i = 0; i < cart.length; i++) {
//                     if (cart[i].title == singleData.title) {
//                         cart[i].qty++;
//                         newItem = false;
//                         break;
//                     }
//                 }


//             if (newItem) {
//                 cart.push({
//                     _id :singleData._id,
//                     title: singleData.title,
//                     qty: req.body.qty,
//                     color:req.body.color,
//                     size:req.body.size,
//                     VendorId:singleData.VendorId,
//                     price: parseFloat(singleData.price).toFixed(2),
//                     image: '/productImage/' + singleData._id + '/' + singleData.image
//                 });
//             }
//         }

//           res.redirect('back');
//             }


//     })
//     .catch(err=>{
//         console.log(err);
//     })

// }

exports.getIndex = async(req, res, next) => {
    try {
        // allproduct =await productModel.find({tag:{$gt:req.query.minimum_price  }}).sort({_id:-1}).limit(6)
        let newarrival = await productModel.find().sort({_id:-1}).limit(4);
      let allproduct= await productModel.find().sort({sold:-1})
        let topRating = await productModel.find({ topRating: { $gt: 2 } });
        //  console.log("review",topRating);
        let review = await ratingModel.find().populate('userId').populate('productId').limit(5);
        let bannerimage = await bannerModel.find();
        let pujainfo = await pujaModel.find().limit(1);
        imageCategoryModel.find(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                if(result)
                {
                  db.collection('categories').aggregate([
        
                      // Join with user_info table
                      {
                          $lookup:{
                              from: 'sub_categories',       // other table name
                              localField: 'category',   // name of users table field
                              foreignField: 'category', // name of userinfo table field
                              as: 'category_info'         // alias for userinfo table
                          }
                      },
                     
                      {
                          $lookup:{
                              from: 'products', 
                              localField: 'category', 
                              foreignField: 'category',
                              as: 'product_role'
                          }
                      },
                      
                  ]).toArray(function(err,resullt){
              
                              if (err){
                                  console.log(err)}
                                  res.render('index', {
                                    title: 'All products',
                                    products: newarrival.length>0?newarrival:null,
                                    rating: topRating.length>0?topRating:newarrival,
                                    feedback:review.length>0?review:null,
                                    popular:allproduct.length>0?allproduct:null,
                                    banner:bannerimage.length>0?bannerimage:null,
                                    puja:pujainfo.length>0?pujainfo:null,
                                    data:resullt
                                    
                                     });
                  })
                  
                }
            }
            
        });
        // console.log("review",review);
       

    } catch (error) {
        console.log(error);
    }
    
}


// exports.homeIndex = (req, res, next) => {
//     categoryslug = req.params.title;
//     // console.log(categoryslug);
//     productModel.findOne({ title: categoryslug })
//         .then(singleData => {
//             //    console.log(singleData);
//             if (singleData) {

//                 req.session.isLoggedIn = true;
//                 // req.session.cart =singleData;
//                 if (typeof req.session.cart == "undefined") {
//                     req.session.cart = [];
//                     req.carty.cart.push({
//                         _id: singleData._id,
//                         title: categoryslug,
//                         qty: 1,
//                         size:"free",
//                         color:"As per image shown otherwise go to details page",
//                         price: singleData.tag,
//                         image: '/productImage/' + singleData._id + '/' + singleData.image
//                     })
//                 } else {
//                     var cart = req.session.cart;
//                     var newItem = true;

//                     for (var i = 0; i < cart.length; i++) {
//                         if (cart[i].title == categoryslug) {
//                             cart[i].qty++;
//                             newItem = false;
//                             break;
//                         }
//                     }

//                 }
//                 if (newItem) {
//                     cart.push({
//                         _id: singleData._id,
//                         title: categoryslug,
//                         qty: 1,
//                         size:"free",
//                         color:"As per image shown otherwise go to details page",
//                         price: parseFloat(singleData.tag).toFixed(2),
//                         image: '/productImage/' + singleData._id + '/' + singleData.image
//                     });
//                 }

//                 res.render('index', {
//                     title: "title",
//                     cart: cart,
//                     data: []

//                 })
//             }


//         })
//         .catch(err => {
//             console.log(err);
//         })
// }

exports.viewCart = (req, res, next) => {
    db.collection('categories').aggregate([

        // Join with user_info table
        {
            $lookup: {
                from: 'sub_categories',       // other table name
                localField: 'category',   // name of users table field
                foreignField: 'category', // name of userinfo table field
                as: 'category_info'         // alias for userinfo table
            }
        },

        {
            $lookup: {
                from: 'products',
                localField: 'category',
                foreignField: 'category',
                as: 'product_role'
            }
        },

    ]).toArray(function (err, resullt) {

        if (err)
            console.log(err);

        res.render('shopping_cart', {
            title: "shopping cart",
            data: resullt




        })


    })

}





exports.contactPage = (req, res, next) => {
    res.render('contact_us', {
        title: "contact"
    })
}

exports.grid = (req, res, next) => {
    if(req.xhr){
        console.log("done")
    }else{
        const categoryid= req.params.category;
    imageCategoryModel.find()
    .then(result => {
        if (result) {
            db.collection('categories').aggregate([

                // Join with user_info table
                {
                    $lookup: {
                        from: 'sub_categories',       // other table name
                        localField: 'category',   // name of users table field
                        foreignField: 'category', // name of userinfo table field
                        as: 'category_info'         // alias for userinfo table
                    }
                },

                {
                    $lookup: {
                        from: 'products',
                        localField: 'category',
                        foreignField: 'category',
                        as: 'product_role'
                    }
                },

            ]).toArray(function (err, resullt) {

                if (err)
                    console.log(err);


                categorySubModel.find()

                    .then(catData => {
                        if (catData) {
                            db.collection('sub_categories').aggregate([
                                {
                                    $lookup: {
                                        from: 'products',       // other table name
                                        localField: 'subCategory',   // name of users table field
                                        foreignField: 'subCategory', // name of userinfo table field
                                        as: 'category_info'         // alias for userinfo table
                                    }
                                },

                            ]).toArray(function (err, commoncount) {
                                //   console.log(commoncount)
                                if (commoncount) {
                                    productModel.find(({ category:categoryid}))
                                        .then(products => {
                                            // console.log("artt",products);
                                            res.render('filter2', {
                                                title: "filter",
                                                category: catData.length>0?catData:null,
                                                data: resullt,
                                                count: commoncount.length>0?commoncount:null,
                                                products: products.length>0?products:null,
                                                subCategory:req.params.imageSubCategory
                                            })



                                        })
                                        .catch(err => {
                                            console.log(err);
                                        })

                                }
                            })


                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })



            })
        }
        else {
            console.log("category not found");
        }
    })
    .catch(err => {
        console.log(err);
    })
}

}

exports.blogPage = (req, res, next) => {
    res.render('blog_right_sidebar', {
        title: "blog"
    })
}

exports.accountPage = (req, res, next) => {
    res.render('account_page', {
        title: "accountPage",
        error: [],
        data:[]
    })
}

exports.registerPage = (req, res, next) => {
    var otps = Math.floor((Math.random() * 10000) + 1);
    console.log("otp",otps);
    Axios.get(`http://sms.fusiontechlab.com/app/smsapi/index.php?key=5ffc399da3287&type=text&contacts=${req.body.phone}&senderid=GPAULS &peid=1001445840000025498&templateid=1007162235720937382&msg=For registration with www.gourangapaul.com OTP is ${otps} valid for 30 minutes`).then(result=>{
                                console.log(result.data);
                            })
                            console.log("phone",req.body.phone)
                            const validdata = validationResult(req);
                            // console.log(validdata);
                         
                            if (!validdata.isEmpty()) {
                                const jsonData = JSON.stringify(validdata.array());
                                req.flash('success' ,'invalid phone number')      
                                 res.redirect('/account_page');
    
                            }else{
                                res.render('register_page', {
        
                                    title: "register_page",
                                    editable: false,
                                    error:null,
                                    data:[],
                                    message: req.flash('message'),
                                    phone:req.body.phone?req.body.phone:null,
                                    otp:otps?otps:null,
                                    user:req.user?req.user:null,
                                    cart:req.session.cart?req.session.cart:null
                                })
                            }
}

exports.postRegister = (req, res, next) => {
   console.log("post phone",req.body.phone);
    const validdata = validationResult(req);
    console.log(validdata);
 
    if (!validdata.isEmpty()) {
        const jsonData = JSON.stringify(validdata.array());
        console.log(jsonData);

        res.render('register_page', {
            title: 'register',
            error: JSON.parse(jsonData),
            editable: false,
            phone:req.body.phone?req.body.phone:null,
            otp :req.body.otp?req.body.otp:null,
            user:req.user?req.user:null,
            cart:req.session.cart?req.session.cart:null
        
        })
    } else {
        userModel.findOne({ email: req.body.email })
            .then(emailifexist => {
                // console.log(emailifexist);
                if (emailifexist) {
                    console.log('email already exist');
                    req.flash('success', 'email already exist & try again' );
                    res.redirect('/account_page');
                }
                else {
                    bcrypt.hash(req.body.password, 12)
                        .then(hassPass => {
                            const User = new userModel({
                                fname: req.body.fname,
                                lname: req.body.lname,
                                email: req.body.email,
                                password: hassPass,
                                address: req.body.address,
                                city: req.body.city,
                                phone: req.body.phone?req.body.phone:null,
                                user_type: "user",
                                user:req.user?req.user:null,
                                cart:req.session.cart?req.session.cart:null
                            

                            })
                            
                            var hiddenOtp = req.body.otp;
                             var bodyOtp = req.body.otpv;
                            //  console.log('hidden otp',hiddenOtp);
                            //  console.log('body otp',bodyOtp);
                             if(hiddenOtp != bodyOtp){
                                req.flash('success', 'invelid otp and register failed');
                                    res.redirect('/account_page');
                                 console.log("invalid otp");
                             }else{
                                return User.save()
                                .then(() => {
                                    req.flash('success', 'Register Success!!');
                                    res.redirect('/account_page');
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                             }
                            
                        })
                        .catch(err => {
                            console.log(err);
                        })



                }
            }).catch(err => {
                console.log(err);
            })
    }

}



exports.postLogin = (req, res, next) => {
    const validdata = validationResult(req);


    if (!validdata.isEmpty()) {
        const jsonData = JSON.stringify(validdata.array());
        // console.log(JSON.parse(jsonData));
        res.render('account_page', {
            title: 'register',
            error: JSON.parse(jsonData),
            editable: false,
            user:req.user?req.user:null,
            cart:[]
        })
    } else {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
               // console.log('error, info.message');
                return next(err)
            }
            if (!user) {
                //console.log('error', info.message)
                req.flash('success' ,'error wrong user')
                return res.redirect('/account_page');
            }
            if (user.user_type === "user" && user.status == true) {
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }
                    req.flash('success' ,'login success');
                    return res.redirect('/orderlist');
                })
            } else {
                req.flash('success' ,'are u user??');
                res.redirect(back);
                console.log("are u user??");
            }

        })(req, res, next)
    }

}

exports.getRegister = (req, res, next) => {
    res.render('register', {
        title: "title",
        editable: false

    })
}
exports.getLogin = (req, res, next) => {
    res.render('login', {
        title: "login",


    })
}

exports.shopCategory =(req,res,next)=>{
    //console.log(req.params.category);
    var category = req.params.category;
    // var count = await productModel.find({category:category}).countDocuments()
    // const products = await productModel.find({category:category});
    // console.log(products);
    // console.log(count)
    // res.render('shopbycategory',{
    //     title: "category Products",
    //     products:products,
    //     count :count
    // })
    categorySubModel.find()

    .then(catData => {
        if (catData) {
            db.collection('sub_categories').aggregate([
                {
                    $lookup: {
                        from: 'products',       // other table name
                        localField: 'subCategory',   // name of users table field
                        foreignField: 'subCategory', // name of userinfo table field
                        as: 'category_info'         // alias for userinfo table
                    }
                },

            ]).toArray(function (err, commoncount) {
                //   console.log(JSON.stringify(commoncount))
                if (commoncount) {
                    productModel.find({category:category})
                    .then(product=>{
                        res.render('shopbycategory', {
                            title: 'All products',
                            products: product,
                            count: commoncount,
                        });

                    })
                    .catch(err=>{
                        console.log(err)
                    })
                           

                        
                       



                }
               
            })


        }
    })
    .catch(err => {
        console.log(err);
    })

}














exports.doEdit=(req,res,next)=>{
    const user_id = req.params.id;
 const editmode = req.query.edit;

 userModel.findById(user_id)
 .then(singleData =>{
    res.render('register_page',{
        title:'Update user',
        data:singleData,
        editable:editmode,
        error:[],
        otp:null
    })
 })
 .catch(err=>{
     console.log(err);
 })


}

exports.doUpdate = (req, res, next) => {
    const id = req.body.id;
    //console.log('vendor_update_data ', req.body, id);
    let fname = req.body.fname||null;
    let lname = req.body.lname||null;
    let email = req.body.email||null;
    let address = req.body.address||null;
    let city = req.body.city||null;
    let phone = req.body.phone||null;
    let user_type = "user"

    userModel.findOneAndUpdate({ '_id': id }, {
        $set: {
            fname: fname,
            lname: lname,
            email: email,
            address: address,
            phone: phone,
            city: city,
            user_type: user_type
        }
    }, { new: true })
        .then(result => {
            req.flash("success","update data");
            //console.log("update value of user By admin ", result);
            res.redirect('/loggedUser')
        })
        .catch(err => {
            console.log(err);
        })

}


// exports.doDelete =(req,res,next)=>{

//     const user_id = req.params.id;
//     userModel.findByIdAndRemove(user_id)
//     .then(()=>{
//         res.redirect('/dashboard');
//     })
//     .catch(err=>{
//         console.log(err);
//     })


// 


exports.getlogUser = (req, res, next) => {

    res.render('loggeduser', {
        title: "title",
        loginuser: req.user.user_type =="user"?req.user:[]
    })
}


exports.userAddress = async (req, res, next) => {
    const orders = await order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } }).limit(2);
    // console.log(orders);
    res.render('address', {
        title: "orders",
        orders: orders,

    });

}


exports.logout = (req, res, next) => {
    req.logout();

    req.flash('success', 'You are logged out!');
    return res.redirect('/account_page')
}
// exports.postLogin =(req,res,next)=>{
//            userModel.findOne({email:req.body.email})
//            .then(emailifexist=>{
//                console.log(emailifexist);
//                if(emailifexist.email== req.body.email && emailifexist.password == req.body.password)
//                {
//                    console.log("login Succesfull");
//                    res.redirect('/register');
//                }
//                else
//                {
//                 console.log("try another");
//                }

//            })
//            .catch(err=>{
//                console.log(err);
//            })
// }
exports.search = async(req, res, next) => {
    var regex = new RegExp(req.body["search"],'i')
    
    let searchdata = await productModel.find({$or:[{title:regex},{subCategory:regex},{category:regex},{tag:regex}]});
    // console.log("search",searchdata);
    categorySubModel.find()

    .then(catData => {
        if (catData) {
            db.collection('sub_categories').aggregate([
                {
                    $lookup: {
                        from: 'products',       // other table name
                        localField: 'subCategory',   // name of users table field
                        foreignField: 'subCategory', // name of userinfo table field
                        as: 'category_info'         // alias for userinfo table
                    }
                },

            ]).toArray(function (err, commoncount) {
                 if(err){
                     console.log(err)
                 }else{
                    imageCategoryModel.find(function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            if(result)
                            {
                              db.collection('categories').aggregate([
                    
                                  // Join with user_info table
                                  {
                                      $lookup:{
                                          from: 'sub_categories',       // other table name
                                          localField: 'category',   // name of users table field
                                          foreignField: 'category', // name of userinfo table field
                                          as: 'category_info'         // alias for userinfo table
                                      }
                                  },
                                 
                                  {
                                      $lookup:{
                                          from: 'products', 
                                          localField: 'category', 
                                          foreignField: 'category',
                                          as: 'product_role'
                                      }
                                  },
                                  
                              ]).toArray(function(err,resullt){
                          
                                          if (err){
                                              console.log(err)}
                                              res.render('searchProduct', {
                                                title: 'All products',
                                                products: searchdata?searchdata:null,
                                                category: catData,
                                                count: commoncount,
                                                user: req.user,
                                                cart:req.session.cart
                                            });
                              })
                              
                            }
                        }
                        
                    });
                 }
                
            })


        }
    })
    .catch(err => {
        console.log(err);
    })


}
exports.getSearchproduct =(req,res,next)=>{
    imageCategoryModel.find(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if(result)
            {
              db.collection('categories').aggregate([
    
                  // Join with user_info table
                  {
                      $lookup:{
                          from: 'sub_categories',       // other table name
                          localField: 'category',   // name of users table field
                          foreignField: 'category', // name of userinfo table field
                          as: 'category_info'         // alias for userinfo table
                      }
                  },
                 
                  {
                      $lookup:{
                          from: 'products', 
                          localField: 'category', 
                          foreignField: 'category',
                          as: 'product_role'
                      }
                  },
                  
              ]).toArray(function(err,resullt){
          
                          if (err){
                              console.log(err)}
                              res.render("searchProduct",{
                                title:"search",
                                data:resullt,
                                products:[],
                                count:[]
                                
                            })
              })
              
            }
        }
        
    });
    
}

exports.userChangeAddress =(req,res,next)=>{
    // console.log("user",req.params.id)
     var orderId = req.params.id;
    order.findById( orderId, null, { sort: { 'createdAt': -1 } })
    .then(details => {
        // console.log("der",req.body.fname);
        order.findByIdAndUpdate( orderId ,
            {
                $set: {

                    fname: req.body.fname ? req.body.fname : details.fname,
                    lname: req.body.lname ? req.body.lname : details.lname,
                    phone: req.body.phone ? req.body.phone : details.phone,
                    email: req.body.email ? req.body.email : details.email,
                    address: req.body.address ? req.body.address : details.address,
                    city: req.body.city ? req.body.city : details.city,
                    state: req.body.state ? req.body.state : details.state,
                    code: req.body.code ? req.body.code : details.code,
                    country: req.body.country ? req.body.country : details.country,
                    sfname: req.body.sfname ? req.body.sfname : details.sfname,
                    slname: req.body.slname ? req.body.slname : details.slname,
                    sphone: req.body.sphone ? req.body.sphone : details.sphone,
                    semail: req.body.email ? req.body.email : details.email,
                    saddress: req.body.address ? req.body.address : details.address,
                    scity: req.body.scity ? req.body.scity : details.city,
                    sstate: req.body.sstate ? req.body.sstate : details.sstate,
                    scode: req.body.scode ? req.body.scode : details.scode,
                    scountry: req.body.scountry ? req.body.scountry : details.scountry,

                   


                }
            }).then(result => {
                req.flash('success',"address update success");
                res.redirect('/address');
               //res.redirect('/product')
            })
            .catch(error => (console.log(error)))


    })
    .catch(error => (console.log(error)))
}

exports.searchCartGrid=(req,res,next)=>{
    categoryslug = req.params.id;
    // console.log(categoryslug);
    // console.log(req.body.qty);
    productModel.findById(req.params.id)
        .then(singleData => {
            //  console.log('singleDatahome', singleData);
            if (singleData) {

                if (typeof req.session.cart == "undefined") {
                    req.session.cart = [];
                    req.session.cart.push({
                        _id: singleData._id,
                        title: singleData.title,
                        qty: 1,
                        color:singleData.color,
                        size:singleData.size,
                        price:singleData.tag,
                        VendorId:singleData.VendorId,
                        image:singleData.image,
                        brand:singleData.subCategory,
                        productName:singleData.title,
                        stock:singleData.availability

                    })
                } else {
                    var cart = req.session.cart;
                    var newItem = true;

                    for (var i = 0; i < cart.length; i++) {
                        if (cart[i].title == singleData.title) {
                            cart[i].qty++;
                            newItem = false;
                            break;
                        }
                    }


                    if (newItem) {
                        cart.push({
                            _id: singleData._id,
                            title: singleData.title,
                            qty: 1,
                            color: singleData.color,
                            size: singleData.size,
                            VendorId: singleData.VendorId,
                            price: parseFloat(singleData.tag).toFixed(2),
                            brand:singleData.subCategory,
                            productName:singleData.title,
                            image:singleData.image,
                            stock:singleData.availability
                        });
                    }
                }
                req.flash('success' ,'add to cart successfully');
                res.redirect('/');
            }


        })
        .catch(err => {
            console.log(err);
        })

}

exports.deleteAddress =(req,res,next)=>{

}
exports.testProduct = (req, res, next) => {
    //console.log(req.query.sortBy)
    
    res.json('fdffd')
}
 
exports.vidio =async(req,res,next)=>{
    const para = await vidioModel.find()
    res.render('video', {
        title: "video",
        para: para.length>0?para:null
    })
   
}
                                          
                                        
                                  
       


