const express = require('express');
const router = express.Router();
//var mkdirp =require('mkdirp');
//var fs = require('fs-extra');
//var resizeImg = require('resize-img');
const { checkbody, body } = require('express-validator/check');
// Get Product model
const Product = require('../model/productModel');
const adminAuth = require('../config/adminAuth');
const subCategory = require('../model/imageSubCategory');
const galleryModel = require('../model/gallery');
const auth = require('../middleware/auth')
// Get Category model
const Category = require('../model/imageSubCategory');
const product_controller = require('../controller/product_controller');
const { db } = require('../model/productModel');
const productModel = require('../model/productModel');
const profileImgUpload = require('../services/ImageUpload')


router.get('/productList', function (req, res) {
    data = req.session.passport.user;
    console.log(data);

    productModel.find({ VendorId: data })
        .then(allproduct => {
            // console.log(allproduct)
            res.render('vendor/products', {
                title: 'product_dashboard ',
                products: allproduct,

            })
        })
        .catch(err => {
            console.log(err);
        })


})


router.get('/product', adminAuth,function (req, res) {

    db.collection('products').countDocuments(function (err, count) {
        if (err) {
            console.log(err);
        }

        productModel.find()
            .then(products => {
                if (products) {
                    res.render('admin/products', {
                        products: products,
                        count: count

                    });

                }
            })
            .catch(err => {
                console.log(err);
            })

    })


});


router.get('/edit-product/:id', function (req, res) {
    Category.find(function (err, categories) {
        subCategory.find(function (err, subCategories) {
            Product.findById(req.params.id, function (err, p) {
                if (err) {
                    console.log(err);
                    res.redirect('/product');
                } else {


                    galleryModel.find({ productId: req.params.id }, function (err, gallery) {
                        if (err) {
                            console.log(err);
                        } else {
                            galleryImages = gallery;
                            console.log(galleryImages);

                            res.render('admin/edit_product', {
                                title: p.title,
                                desc: p.desc,
                                longdesc: p.longdesc,
                                tag: p.tag,
                                gst: p.gst,
                                offered: p.offered,
                                code: p.code,
                                price: p.price,
                                categories: categories,
                                category: p.category,
                                subCategory: p.subCategory,
                                subCategories: subCategories,
                                price: parseFloat(p.price).toFixed(2),
                                code: p.code,
                                image: p.image,
                                hover: p.hover,

                                offered: p.offered,
                                gst: p.gst,
                                size: p.size,
                                color: p.color,
                                attribute: p.attribute,
                                availability: p.availability,
                                galleryImages: galleryImages,
                                id: p._id
                            });
                        }
                    });
                }
            });

        });
    });

});

router.post('/edit-product/:id', profileImgUpload.array('file', 2), function (req, res) {
    if (req.files.length === 0) {
        // console.log(req.params.id);
        const id = req.params.id;
        //   console.log(req.body.availability);
        productModel.findById(id)
            .then(details => {


                productModel.findOneAndUpdate({ '_id': id },
                    {
                        $set: {

                            title: req.body.title ? req.body.title : details.title,
                            desc: req.body.desc ? req.body.desc : details.desc,
                            longdesc: req.body.desc ? req.body.longdesc : details.longdesc,
                            category: req.body.category ? req.body.category : details.category,
                            subCategory: req.body.subCategory ? req.body.subCategory : details.subCategory,
                            price: req.body.price ? req.body.price : details.price,
                            code: req.body.code ? req.body.code : details.code,
                            offered: req.body.offered ? req.body.offered : details.offered,
                            tag: req.body.tag ? req.body.tag : details.tag,
                            gst: req.body.gst ? req.body.gst : details.gst,
                            attribute: req.body.attribute ? req.body.attribute : details.attribute,
                            size: req.body.size ? req.body.size : details.size,
                            color: req.body.color ? req.body.color : details.color,
                            availability: req.body.availability?req.body.availability:details.availability,
                            image: details.image,


                        }
                    })
                    .then(result => {
                        console.log(result);
                        res.redirect('/product');
                    })
                    .catch(err => {
                        console.log(err);

                    })
            })


            .catch(err => {
                console.log(err);
            })

    } else {

        let fileArray = req.files,
            fileLocation;
        const galleryImgLocationArray = [];
        for (let i = 0; i < fileArray.length; i++) {
            fileLocation = fileArray[i].location;
            
            galleryImgLocationArray.push(fileLocation)
        }


        productModel.findById(req.params.id)
            .then(details => {

                productModel.findOneAndUpdate({ '_id': req.params.id },
                    {
                        $set: {

                            title: req.body.title ? req.body.title : details.title,
                            desc: req.body.desc ? req.body.desc : details.desc,
                            longdesc: req.body.desc ? req.body.desc : details.desc,
                            category: req.body.category ? req.body.category : details.category,
                            subCategory: req.body.subCategory ? req.body.subCategory : details.subCategory,
                            price: req.body.price ? req.body.price : details.price,
                            code: req.body.code ? req.body.code : details.code,
                            offered: req.body.offered ? req.body.offered : details.offered,
                            tag: req.body.tag ? req.body.tag : details.tag,
                            gst: req.body.gst ? req.body.gst : details.gst,
                            attribute: req.body.attribute ? req.body.attribute : details.attribute,
                            size: req.body.size ? req.body.size : details.size,
                            color: req.body.color ? req.body.color : details.color,
                            availability: req.body.availability?req.body.availability:details.availability,
                            image: galleryImgLocationArray?galleryImgLocationArray:details.image


                        }
                    }).then(result => {
                        res.redirect('/edit-product/' + req.params.id);
                       //res.redirect('/product')
                    })
                    .catch(error => (console.log(error)))


            })
            .catch(error => (console.log(error)))




    }

});

router.post('/product-gallery/:id', profileImgUpload.array('file'), function (req, res) {

    const id = req.params.id;


    req.files.forEach(file => {
        console.log('file', file)
        const gallery = new galleryModel({
            file: file.location,
            productId: id

        })
        gallery.save()
            .then(dataImage => {
                // console.log(dataImage);
                console.log("gallery saved");
                if (dataImage) {
                    res.sendStatus(200);
                }
            })
    });



});

router.get('/delete-image/:id', function (req, res) {
    var id = req.params.id;
    console.log("deletegalleryid",id);
   galleryModel.findByIdAndDelete(id,function(err){
       if(err){
           console.log(err);
       }else{
        console.log('success', 'Product deleted!');
        req.flash('success', 'image gallery deleted!');
        res.redirect('/product');
       }
   })
   
});


router.get('/delete-product/:id', function (req, res) {

    var id = req.params.id;
    var path = 'public/productImage/' + id;

    Product.findByIdAndDelete(id, function (err) {
        console.log(err);
    });

    console.log('success', 'Product deleted!');
    res.redirect('/product');


});

router.get('/add-product', product_controller.getProduct);

/*
 * POST add product
 */
//router.post('/add-product', profileImgUpload.array('file', 2), product_controller.postProduct);

router.post('/add-product', profileImgUpload.array('file', 8), (req, res) => {
    console.log(req.files)

    let fileArray = req.files,
        fileLocation;
    const galleryImgLocationArray = [];
    for (let i = 0; i < fileArray.length; i++) {
        fileLocation = fileArray[i].location;
        console.log('filenm', fileLocation);
        galleryImgLocationArray.push(fileLocation)
    }


    if (!req.files) {

        const product = new product_model({
            title: req.body.title,
            desc: req.body.desc,
            longdesc: req.body.longdesc,
            category: req.body.category,
            subCategory: req.body.subCategory,
            price: req.body.price,
            code: req.body.code,
            offered: req.body.offered,
            tag: req.body.tag,
            gst: req.body.gst,
            attribute: req.body.attribute,
            size: req.body.size,
            color: req.body.color,

            image: galleryImgLocationArray,
            // hover:hoverFile


        });



        product.save(function (err, result) {
            if (err)
                return console.log(err);





            res.redirect('/product');
        });

    } else {



        const product = new productModel({
            title: req.body.title,
            desc: req.body.desc,
            longdesc: req.body.longdesc,
            category: req.body.category,
            subCategory: req.body.subCategory,
            price: req.body.price,
            code: req.body.code,
            offered: req.body.offered,
            tag: req.body.tag,
            gst: req.body.gst,
            attribute: req.body.attribute,
            size: req.body.size,
            color: req.body.color,
            image: galleryImgLocationArray,
            // hover:hoverFile


        });

        product.save(function (err, result) {
            if (err)
                return console.log(err);

            res.redirect('/product');
        });
    }
})
//appfilterdropdown
router.get('/catgetFiltersubCat/:data', product_controller.catgetFiltersubCats);






router.get('/vendor-product', auth, product_controller.getVendor);
router.post('/vendor-products', auth,profileImgUpload.array('file', 2), product_controller.vendorProduct);

router.get('/vendoredit-product/:id', function (req, res) {
    Category.find(function (err, categories) {
        subCategory.find(function (err, subCategories) {
            Product.findById(req.params.id, function (err, p) {
                if (err) {
                    console.log(err);
                    res.redirect('/vendor/index');
                } else {


                    galleryModel.find({ productId: req.params.id }, function (err, gallery) {
                        if (err) {
                            console.log(err);
                        } else {
                            galleryImages = gallery;
                            console.log(galleryImages);

                            res.render('vendor/edit_product', {
                                title: p.title,
                                desc: p.desc,
                                longdesc: p.longdesc,
                                tag: p.tag,
                                gst: p.gst,
                                offered: p.offered,
                                code: p.code,
                                price: p.price,
                                categories: categories,
                                category: p.category,
                                subCategory: p.subCategory,
                                subCategories: subCategories,
                                price: parseFloat(p.price).toFixed(2),
                                code: p.code,
                                attribute:p.attribute,
                                image: p.image,
                                hover: p.hover,

                                offered: p.offered,
                                gst: p.gst,
                                size: p.size,
                                color: p.color,
                                availability: p.availability,
                                galleryImages: galleryImages,
                                id: p._id
                            });
                        }
                    });
                }
            });

        });
    });

});

router.post('/vendoredit-product/:id', profileImgUpload.array('file', 2), function (req, res) {
    if (req.files.length === 0) {
        // console.log(req.params.id);
        const id = req.params.id;
        //   console.log(req.body.availability);
        productModel.findById(id)
            .then(details => {


                productModel.findOneAndUpdate({ '_id': id },
                    {
                        $set: {

                            title: req.body.title ? req.body.title : details.title,
                            desc: req.body.desc ? req.body.desc : details.desc,
                            longdesc: req.body.desc ? req.body.longdesc : details.longdesc,
                            category: req.body.category ? req.body.category : details.category,
                            subCategory: req.body.subCategory ? req.body.subCategory : details.subCategory,
                            price: req.body.price ? req.body.price : details.price,
                            code: req.body.code ? req.body.code : details.code,
                            offered: req.body.offered ? req.body.offered : details.offered,
                            tag: req.body.tag ? req.body.tag : details.tag,
                            gst: req.body.gst ? req.body.gst : details.gst,
                            attribute: req.body.attribute ? req.body.attribute : details.attribute,
                            size: req.body.size ? req.body.size : details.size,
                            color: req.body.color ? req.body.color : details.color,

                            image: details.image,


                        }
                    })
                    .then(result => {
                        console.log(result);
                        res.redirect('/productList');
                    })
                    .catch(err => {
                        console.log(err);

                    })
            })


            .catch(err => {
                console.log(err);
            })

    } else {

        let fileArray = req.files,
            fileLocation;
        const galleryImgLocationArray = [];
        for (let i = 0; i < fileArray.length; i++) {
            fileLocation = fileArray[i].location;
            console.log('filenm', fileLocation);
            galleryImgLocationArray.push(fileLocation)
        }


        productModel.findById(req.params.id)
            .then(details => {

                productModel.findOneAndUpdate({ '_id': req.params.id },
                    {
                        $set: {

                            title: req.body.title ? req.body.title : details.title,
                            desc: req.body.desc ? req.body.desc : details.desc,
                            longdesc: req.body.desc ? req.body.longdesc : details.longdesc,
                            category: req.body.category ? req.body.category : details.category,
                            subCategory: req.body.subCategory ? req.body.subCategory : details.subCategory,
                            price: req.body.price ? req.body.price : details.price,
                            code: req.body.code ? req.body.code : details.code,
                            offered: req.body.offered ? req.body.offered : details.offered,
                            tag: req.body.tag ? req.body.tag : details.tag,
                            gst: req.body.gst ? req.body.gst : details.gst,
                            attribute: req.body.attribute ? req.body.attribute : details.attribute,
                            size: req.body.size ? req.body.size : details.size,
                            color: req.body.color ? req.body.color : details.color,

                            image: galleryImgLocationArray


                        }
                    }).then(result => {
                        res.redirect('/edit-product/' + req.params.id);
                       //res.redirect('/product')
                    })
                    .catch(error => (console.log(error)))


            })
            .catch(error => (console.log(error)))




    }

});

router.get('/vendordelete-product/:id', function (req, res) {

    var id = req.params.id;
    var path = 'public/productImage/' + id;

    Product.findByIdAndDelete(id, function (err) {
        console.log(err);
    });

    console.log('success', 'Product deleted!');
    req.flash("success" ,"product deleted");
    res.redirect('/productList');


});

router.get('/vendordelete-image/:id', function (req, res) {
    var id = req.params.id;
    console.log("deletegalleryid",id);
   galleryModel.findByIdAndDelete(id,function(err){
       if(err){
           console.log(err);
       }else{
        console.log('success', 'Product deleted!');
        req.flash('success', 'image gallery deleted!');
        res.redirect('/productList');
       }
   })
   
});


module.exports = router;


