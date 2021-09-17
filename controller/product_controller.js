
const { json } = require('body-parser');
const categoryModel = require('../model/imageCategoryModel');
const subCategory =require('../model/imageSubCategory');
const product_model =require('../model/productModel');
const path = require('path');

var fs = require('fs-extra');
const {check,body} = require('express-validator/check');
var resizeImg = require('resize-img');
var mkdirp =require('mkdirp');
const passport = require('passport');
const { Console } = require('console');
const user_model = require('../model/user_model');



exports.getVendor=(req,res,next)=>{
    var title = "";
    var desc = "";
    longdesc="";
    var price = "";
    var offered = "";
    var tag = "";
    var gst = "";
    var attribute = "";
    var size ="";
    var color="";
    var code =""

    categoryModel.find(function (err, categories) {
        subCategory.find(function(err ,subcategory){
            res.render('vendor/product', {
                title: title,
                desc: desc,
                categories: categories,
                subcategory:subcategory,
                price: price,
                code:code,
                offered:offered,
                tag :tag,
                gst:gst,
                attribute:attribute,
                size:size,
                color:color
                
            });
        })
        
    });
}
exports.vendorProduct =(req,res,next)=>{
   
    // console.log(req.files)
    // console.log('user',req.user);
    let fileArray = req.files,
        fileLocation;

        console.log(fileArray);
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
            longdesc: req.body.desc,
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
            VendorId:req.user._id,
            image: galleryImgLocationArray,
            // hover:hoverFile


        });



        product.save(function (err, result) {
            if (err)
                return console.log(err);





            res.redirect('/productList');
        });

    } else {



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
            VendorId:req.user._id,
            image: galleryImgLocationArray,
            

        });

        product.save(function (err, result) {
            if (err)
                return console.log(err);

            res.redirect('/productList');
        });
    }
}

exports.getProduct =(req,res,next)=>{
    var title = "";
    var desc = "";
    var price = "";
    var offered = "";
    var tag = "";
    var gst = "";
    var attribute = "";
    var size = "";
    var color = "";
    var code ="";

    categoryModel.find(function (err, categories) {
        subCategory.find(function(err ,subcategory){
            res.render('admin/product', {
                title: title,
                desc: desc,
               
                categories: categories,
                subcategory:subcategory,
                price: price,
                code:code,
                offered:offered,
                tag :tag,
                gst:gst,
                attribute:attribute,
                size:size,
                color:color,
                resultdata:[]
                
            });
        })
        
    });
    
    
}




exports.postProduct = (req,res,next)=>{
    // const imageFile = typeof req.files.image != "undefined" ? req.files.image.name : "";
    // console.log(imageFile);
    // const hoverFile = typeof req.files.hover != "undefined" ? req.files.hover.name : "";
    // console.log(hoverFile);
    
    if(!req.files) {
        let imageFile ="";
        let hoverFile ="";
        const product = new product_model({
            title: req.body.title,
            desc: req.body.desc,
            longdesc:req.body.desc,
            category: req.body.category,
            subCategory:req.body.subCategory,
            price: req.body.price,
            code:req.body.code,
            offered:req.body.offered,
            tag:req.body.tag,
            gst:req.body.gst,
            attribute:req.body.attribute,
            size:req.body.size,
            color:req.body.color,
            
            image:imageFile,
            hover:hoverFile
           
            
        });
        
        

        product.save(function (err, result) {
            if (err)
                return console.log(err);
           
               

                mkdirp('public/productImage/'+ product._id).then(made =>
                    console.log(`made directories, starting with ${made}`));

                    mkdirp('public/productImage/'+ product._id + '/gallery').then(made =>
                        console.log(`made directories, starting with ${made}`));

                        mkdirp('public/productImage/'+ product._id + '/gallery/thumbs').then(made =>
                            console.log(`made directories, starting with ${made}`));

                            if (imageFile != "" && hoverFile !="") {
                                var productImage = req.files.image;
                                var hoverImage = req.files.hover
                                var path = 'public/productImage/' + product._id + '/' + imageFile;
                                var paths = 'public/productImage/' + product._id + '/' + hoverFile;
        
                                productImage.mv(path, function (err) {
                                    return console.log(err);
                                });
                                hoverImage.mv(paths, function (err) {
                                    return console.log(err);
                                });
                            }

          
            res.redirect('/product');
        });
    
    } else {
        //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        let imageFile = req.files.image.name;
        let hoverFile = req.files.hover.name;
        
          
                const product = new product_model({
                    title: req.body.title,
                    desc: req.body.desc,
                    longdesc:req.body.longdesc,
                    category: req.body.category,
                    subCategory:req.body.subCategory,
                    price: req.body.price,
                    code:req.body.code,
                    offered:req.body.offered,
                    tag:req.body.tag,
                    gst:req.body.gst,
                    attribute:req.body.attribute,
                    size:req.body.size,
                    color:req.body.color,
                    image:imageFile,
                    hover:hoverFile
                   
                    
                });

                product.save(function (err, result) {
                    if (err)
                        return console.log(err);
                   
                       
    
                        mkdirp('public/productImage/'+ product._id).then(made =>
                            console.log(`made directories, starting with ${made}`));

                            mkdirp('public/productImage/'+ product._id + '/gallery').then(made =>
                                console.log(`made directories, starting with ${made}`));

                                mkdirp('public/productImage/'+ product._id + '/gallery/thumbs').then(made =>
                                    console.log(`made directories, starting with ${made}`));

                                    if (imageFile != "" && hoverFile !="") {
                                        var productImage = req.files.image;
                                        var hoverImage = req.files.hover
                                        var path = 'public/productImage/' + product._id + '/' + imageFile;
                                        var paths = 'public/productImage/' + product._id + '/' + hoverFile;
                
                                        productImage.mv(path, function (err) {
                                            return console.log(err);
                                        });
                                        hoverImage.mv(paths, function (err) {
                                            return console.log(err);
                                        });
                                    }
    
                  
                    res.redirect('/product');
                });
            }
        }
        
    
 exports.catgetFiltersubCats =(req,res,next)=>{
    // console.log("yeh..")
    // console.log(req.params.data);
  
    subCategory.find({category:req.params.data})
        .then(data => {
        console.log(data);

            if (req.xhr) {
                return res.json(data);
               
            } else {
                return res.render('/');
            }
        })
        .catch(err => {
            console.log(err);
        })
}