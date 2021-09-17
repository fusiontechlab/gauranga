const express = require('express');
const home_controller = require('../controller/home_controller');
const router = express.Router();
const {check,body} = require('express-validator/check');
const productModel = require('../model/productModel');
const auth = require('../config/auth');
const sms = require('../config/sms');


// console.log(sms);
router.get('/' ,home_controller.getIndex);
// router.get('/index/:title' ,home_controller.homeIndex);
router.get('/about_us' ,home_controller.about);
router.get('/contact_us' ,home_controller.contact);

router.get('/shop_grid/:category/:imageSubCategory' ,home_controller.grid);
router.get('/myshop' ,async(req,res,next)=>{
    // console.log(req.query.subcategory);
    // console.log(req.query.size);               
    // console.log(req.query.checked);
    // console.log(req.query.minimum_price);
    // console.log(req.query.maximum_price);
    if(req.query.myfilter){
      var result=[];
      var colordata = req.query.colorData;
      let datalow = await productModel.find().sort({tag:1})
      let datahigh = await productModel.find().sort({tag:-1})
      console.log("high",datahigh);
      if(datahigh && datahigh.length && datahigh.length>0 && req.query.myfilter=='highLow'){
               datahigh.forEach(pro=>{
                 let obj={
                   id:pro._id,
                   title: pro.title,
                   code:pro.code,
                   price:pro.tag,
                   image:pro.image,
                   hover:pro.hover
                 };
                 result.push(obj);
                 
               });
               res.jsonp(result);
             
             }else if (datalow && datalow.length && datalow.length>0 && req.query.myfilter=='lowHigh') {
              datalow.forEach(pro=>{
                let obj={
                  id:pro._id,
                  title: pro.title,
                  code:pro.code,
                  price:pro.tag,
                  image:pro.image,
                  hover:pro.hover
                };
                result.push(obj);
                
              });
              res.jsonp(result);
             }
  } 
  
    
    if(req.query.checked || req.query.minimum_price && req.query.maximum_price & req.query.checked  ,req.query.colorData){
      var result=[];
      var colordata = req.query.colorData;
      let data = await productModel.find({subCategory:req.query.checked ,tag:{$gt:req.query.minimum_price  },color:colordata})
      if(data && data.length && data.length>0){
               data.forEach(user=>{
                 let obj={
                   id:user._id,
                   title: user.title,
                   code:user.code,
                   price:user.tag,
                   image:user.image,
                   hover:user.hover
                 };
                 result.push(obj);
                 console.log
               });
               res.jsonp(result);
             }
  } else{

  }
if(req.query.checked || req.query.minimum_price && req.query.maximum_price & req.query.checked  ,req.query.size){
      var result=[];
      let data = await productModel.find({subCategory:req.query.checked ,tag:{$gt:req.query.minimum_price  },size:req.query.size})
      if(data && data.length && data.length>0){
               data.forEach(user=>{
                 let obj={
                   id:user._id,
                   title: user.title,
                   code:user.code,
                   price:user.tag,
                   image:user.image,
                   hover:user.hover
                 };
                 result.push(obj);
                 console.log
               });
               res.jsonp(result);
             }
  } else{

  }

    if(req.query.checked || req.query.minimum_price && req.query.maximum_price & req.query.checked  ){
        var result=[];
        let data = await productModel.find({subCategory:req.query.checked ,tag:{$gt:req.query.minimum_price  }})
        if(data && data.length && data.length>0){
                 data.forEach(user=>{
                   let obj={
                     id:user._id,
                     title: user.title,
                     price:user.tag,
                     code:user.code,
                     image:user.image,
                     hover:user.hover
                   };
                   result.push(obj);
                   console.log
                 });
                 res.jsonp(result);
               }
    }  else if (req.query.size) {
        allproduct =await productModel.find({size:req.query.size})
        var result=[];
        if(allproduct ||req.query.minimum_price && req.query.maximum_price){
            allproduct.forEach(user=>{
                // console.log(user);
                   let obj={
                     id:user._id,
                     title: user.title,
                     price:user.tag,
                     code:user.code,
                     image:user.image,
                     hover:user.hover
                   };
                   result.push(obj);
                   console.log
                 });
                 res.jsonp(result);
               }
        
      
    }  else if ( req.query.colorData) {
             var data = req.query.colorData;
             console.log('col',data);
             allproduct =await productModel.find({color:data})
             var result=[];
             if(allproduct ||req.query.minimum_price && req.query.maximum_price){
                 allproduct.forEach(user=>{
                     // console.log(user);
                        let obj={
                          id:user._id,
                          title: user.title,
                          code:user.code,
                          price:user.tag,
                          image:user.image,
                          hover:user.hover
                        };
                        result.push(obj);
                        console.log
                      });
                      res.jsonp(result);
                    }
    }
    
    
    else {
        allproduct =await productModel.find({tag:{$gt:req.query.minimum_price  },subCategory:req.query.subcategory})
     
        var result=[];
        if(allproduct ||req.query.minimum_price && req.query.maximum_price){
            allproduct.forEach(user=>{
                   let obj={
                     id:user._id,
                     title: user.title,
                     price:user.tag,
                     code:user.code,
                     image:user.image,
                     hover:user.hover
                   };
                   result.push(obj);
                   
                 });
                 res.jsonp(result );
               }
        
      }
    
})

router.get('/myarrival' ,async(req,res,next)=>{
  // console.log(req.query.subcategory);
  // console.log(req.query.size);               
  // console.log(req.query.checked);
  console.log(req.query.minimum_price);
  // console.log(req.query.maximum_price);
  if(req.query.myfilter){
    var result=[];
    var colordata = req.query.colorData;
    let datalow = await productModel.find().sort({tag:1})
    let datahigh = await productModel.find().sort({tag:-1})
    if(datahigh && datahigh.length && datahigh.length>0 && req.query.myfilter=='highLow'){
             datahigh.forEach(pro=>{
               let obj={
                 id:pro._id,
                 title: pro.title,
                 price:pro.tag,
                 code:pro.code,
                 image:pro.image,
                 hover:pro.hover
               };
               result.push(obj);
               
             });
             res.jsonp(result);
           
           }else if (datalow && datalow.length && datalow.length>0 && req.query.myfilter=='lowHigh') {
            datalow.forEach(pro=>{
              let obj={
                id:pro._id,
                title: pro.title,
                code:pro.code,
                price:pro.tag,
                image:pro.image,
                hover:pro.hover
              };
              result.push(obj);
              
            });
            res.jsonp(result);
           }
} 
  if(req.query.checked || req.query.minimum_price && req.query.maximum_price & req.query.checked  ,req.query.colorData){
    var result=[];
    var colordata = req.query.colorData;
    let data = await productModel.find({subCategory:req.query.checked ,tag:{$gt:req.query.minimum_price  },color:colordata})
    if(data && data.length && data.length>0){
             data.forEach(user=>{
               let obj={
                 id:user._id,
                 title: user.title,
                 code:user.code,
                 price:user.tag,
                 image:user.image,
                 hover:user.hover
               };
               result.push(obj);
               console.log
             });
             res.jsonp(result);
           }
} else{

}
if(req.query.checked || req.query.minimum_price && req.query.maximum_price & req.query.checked  ,req.query.size){
    var result=[];
    let data = await productModel.find({subCategory:req.query.checked ,tag:{$gt:req.query.minimum_price  },size:req.query.size})
    if(data && data.length && data.length>0){
             data.forEach(user=>{
               let obj={
                 id:user._id,
                 title: user.title,
                 price:user.tag,
                 code:user.code,
                 image:user.image,
                 hover:user.hover
               };
               result.push(obj);
               
             });
             res.jsonp(result);
           }
} else{

}

  if(req.query.checked || req.query.minimum_price && req.query.maximum_price & req.query.checked  ){
      var result=[];
      let data = await productModel.find({subCategory:req.query.checked ,tag:{$gt:req.query.minimum_price  }})
      if(data && data.length && data.length>0){
               data.forEach(user=>{
                 let obj={
                   id:user._id,
                   title: user.title,
                   code:user.code,
                   price:user.tag,
                   image:user.image,
                   hover:user.hover
                 };
                 result.push(obj);
              
               });
               res.jsonp(result);
             }
  }  else if (req.query.size) {
      allproduct =await productModel.find({size:req.query.size})
      var result=[];
      if(allproduct ||req.query.minimum_price && req.query.maximum_price){
          allproduct.forEach(user=>{
              // console.log(user);
                 let obj={
                   id:user._id,
                   title: user.title,
                   price:user.tag,
                   code:user.code,
                   image:user.image,
                   hover:user.hover
                 };
                 result.push(obj);
                
               });
               res.jsonp(result);
             }
      
    
  }  else if ( req.query.colorData) {
    var data = req.query.colorData;
    console.log('col',data);
    let allproduct =await productModel.find({color:data})
    var result=[];
    if(allproduct ||req.query.minimum_price && req.query.maximum_price){
        allproduct.forEach(user=>{
            // console.log(user);
               let obj={
                 id:user._id,
                 title: user.title,
                 code:user.code,
                 price:user.tag,
                 image:user.image,
                 hover:user.hover
               };
               result.push(obj);
               console.log
             });
             res.jsonp(result);
           }
}

  else {
      // allproduct =await productModel.find({tag:{$gt:req.query.minimum_price  }}).limit(4)
      // let duct =await productModel.find({price:{$gte:req.query.minimum_price,$lt:req.query.maximum_price}}).sort({_id:-1}).limit(6)
      // console.log("duct",duct);
     let allproduct =await productModel.find({tag:{$gte:req.query.minimum_price,$lt:req.query.maximum_price}}).sort({_id:-1}).limit(6)
    //  console.log("dff",allproduct)
      var result=[];
      if(allproduct ||req.query.minimum_price){
          allproduct.forEach(user=>{
                 let obj={
                   id:user._id,
                   title: user.title,
                   code:user.code,
                   price:user.tag,
                   image:user.image,
                   hover:user.hover
                 };
                 result.push(obj);
                 
               });
              //  console.log(result)
               res.jsonp(result);
             }
             else{
               res.redirect('/arrival');
             }
      
    }
  
})
router.get('/wishlist' ,auth,home_controller.myWishlist);
router.get('/shop_grid' ,home_controller.allProduct);
router.get('/arrival',home_controller.newArrival);
router.get('/popular' ,home_controller.mostSelling);

router.get('/filterProduct' ,home_controller.filter);
router.get('/page/:page' ,home_controller.page);
router.get('/page' ,async (req,res)=>{
  if(req.query.myfilter){
    var result=[];
    var colordata = req.query.colorData;
    let datalow = await productModel.find({tag: {$gte: 0, $lte: 9000}}).sort({tag:1})
    let datahigh = await productModel.find({tag: {$gte: 0, $lte: 9000}}).sort({tag:-1})
    if(datahigh && datahigh.length && datahigh.length>0 && req.query.myfilter=='highLow'){
             datahigh.forEach(pro=>{
               let obj={
                 id:pro._id,
                 title: pro.title,
                 price:pro.tag,
                 code:pro.code,
                 image:pro.image,
                 hover:pro.hover
               };
               result.push(obj);
               
             });
             res.jsonp(result);
           
           }else if (datalow && datalow.length && datalow.length>0 && req.query.myfilter=='lowHigh') {
            datalow.forEach(pro=>{
              let obj={
                id:pro._id,
                title: pro.title,
                price:pro.tag,
                code:pro.code,
                image:pro.image,
                hover:pro.hover
              };
              result.push(obj);
              
            });
            res.jsonp(result);
           }
} 
  if(req.query.checked || req.query.minimum_price && req.query.maximum_price & req.query.checked  ,req.query.colorData){
    var result=[];
    var colordata = req.query.colorData;
    let data = await productModel.find({subCategory:req.query.checked ,tag:{$gt:req.query.minimum_price  },color:colordata})
    if(data && data.length && data.length>0){
             data.forEach(user=>{
               let obj={
                 id:user._id,
                 title: user.title,
                 price:user.tag,
                 code:user.code,
                 image:user.image,
                 hover:user.hover
               };
               result.push(obj);
               
             });
             res.jsonp(result);
           
           }
} else{

}
if(req.query.checked || req.query.minimum_price && req.query.maximum_price & req.query.checked  ,req.query.size){
    var result=[];
    let data = await productModel.find({subCategory:req.query.checked ,tag:{$gt:req.query.minimum_price  },size:req.query.size})
    if(data && data.length && data.length>0){
             data.forEach(user=>{
               let obj={
                 id:user._id,
                 title: user.title,
                 price:user.tag,
                 code:user.code,
                 image:user.image,
                 hover:user.hover
               };
               result.push(obj);
               console.log
             });
             res.jsonp(result);
           }
} else{

}
  if(req.query.checked || req.query.minimum_price && req.query.maximum_price & req.query.checked  ){
      var result=[];
      let data = await productModel.find({subCategory:req.query.checked ,tag:{$gt:req.query.minimum_price  }})
      if(data && data.length && data.length>0){
               data.forEach(user=>{
                 let obj={
                   id:user._id,
                   title: user.title,
                   price:user.tag,
                   code:user.code,
                   image:user.image,
                   hover:user.hover
                 };
                 result.push(obj);
                 console.log
               });
               res.jsonp(result);
             }
  }  else if (req.query.size) {
      allproduct =await productModel.find({size:req.query.size})
      var result=[];
      if(allproduct ||req.query.minimum_price && req.query.maximum_price){
          allproduct.forEach(user=>{
              // console.log(user);
                 let obj={
                   id:user._id,
                   title: user.title,
                   price:user.tag,
                   code:user.code,
                   image:user.image,
                   hover:user.hover
                 };
                 result.push(obj);
                 console.log
               });
               res.jsonp(result);
             }
      
    
  }   else if ( req.query.colorData) {
    var data = req.query.colorData;
    console.log('col',data);
    allproduct =await productModel.find({color:data})
    var result=[];
    if(allproduct ||req.query.minimum_price && req.query.maximum_price){
        allproduct.forEach(user=>{
            // console.log(user);
               let obj={
                 id:user._id,
                 title: user.title,
                 price:user.tag,
                 code:user.code,
                 image:user.image,
                 hover:user.hover
               };
               result.push(obj);
               console.log
             });
             res.jsonp(result);
           }
}

  
  else {

    
    // console.log('skip',req.query.skip);
    // console.log('per' ,req.query.perPage);
    // console.log('current' ,req.query.currentPage)
    
 var skipData = req.query.skip;
 var currentPageData = req.query.currentPage;
 var perPage = req.query.perPage;
 let count = await productModel.find().countDocuments();
     let allproduct =await productModel.find({tag:{$gt:req.query.minimum_price  }})
      .skip(parseInt(skipData))
      .limit(parseInt(perPage))
      var result=[];
    
      if(allproduct ||req.query.minimum_price && req.query.maximum_price){
          allproduct.forEach(user=>{
                 let obj={
                   id:user._id,
                   title: user.title,
                   code:user.code,
                   price:user.tag,
                   image:user.image,
                   hover:user.hover,
                   count:count
                  
                 };
                 result.push(obj);
                //  console.log(result)
               });
              
               res.jsonp(result);
             

             }
             
      
    }
     
})
router.get('/filter', async function (req, res) {
      console.log(req.query.myfilter)
    //   console.log(req.query.size);               
    // console.log(req.query.checked);
    // console.log(req.query.minimum_price);
    // console.log(req.query.maximum_price);
    try{
     
      if(req.query.myfilter){
        var result=[];
        var colordata = req.query.colorData;
        let datalow = await productModel.find().sort({tag:1});
        console.log("low" ,datalow);
        let datahigh = await productModel.find().sort({tag:-1});
        // console.log("high" ,datahigh);
        if(datahigh && datahigh.length && datahigh.length>0 && req.query.myfilter=='highLow'){
                 datahigh.forEach(pro=>{
                   let obj={
                     id:pro._id,
                     title: pro.title,
                     price:pro.tag,
                     code:pro.code,
                     image:pro.image,
                     hover:pro.hover
                   };
                   result.push(obj);
                   
                 });
                 res.jsonp(result);
               
               }else if (datalow && datalow.length && datalow.length>0 && req.query.myfilter=='lowHigh') {
                datalow.forEach(pro=>{
                  let obj={
                    id:pro._id,
                    title: pro.title,
                    price:pro.tag,
                    code:pro.code,
                    image:pro.image,
                    hover:pro.hover
                  };
                  result.push(obj);
                  
                });
                res.jsonp(result);
               }
    } 


      if(req.query.checked || req.query.minimum_price && req.query.maximum_price & req.query.checked  ,req.query.colorData){
        var result=[];
        var colordata = req.query.colorData;
        let data = await productModel.find({subCategory:req.query.checked ,price:{$gt:req.query.minimum_price  },color:colordata})
        if(data && data.length && data.length>0){
                 data.forEach(user=>{
                   let obj={
                     id:user._id,
                     title: user.title,
                     price:user.tag,
                     code:user.tag,
                     image:user.image,
                     hover:user.hover
                   };
                   result.push(obj);
                   console.log
                 });
                 res.jsonp(result);
               
               }
    } else{
  
    }
  if(req.query.checked || req.query.minimum_price && req.query.maximum_price & req.query.checked  ,req.query.size){
        var result=[];
        let data = await productModel.find({subCategory:req.query.checked ,price:{$gt:req.query.minimum_price  },size:req.query.size})
        if(data && data.length && data.length>0){
                 data.forEach(user=>{
                   let obj={
                     id:user._id,
                     title: user.title,
                     price:user.tag,
                     code:user.code,
                     image:user.image,
                     hover:user.hover
                   };
                   result.push(obj);
                   console.log
                 });
                 res.jsonp(result);
               }
    } else{
  
    }
      if(req.query.checked || req.query.minimum_price && req.query.maximum_price & req.query.checked  ){
          var result=[];
          let data = await productModel.find({subCategory:req.query.checked ,price:{$gt:req.query.minimum_price  }})
          if(data && data.length && data.length>0){
                   data.forEach(user=>{
                     let obj={
                       id:user._id,
                       title: user.title,
                       price:user.tag,
                       code:user.code,
                       image:user.image,
                       hover:user.hover
                     };
                     result.push(obj);
                     console.log
                   });
                   res.jsonp(result);
                 }
      }  else if (req.query.size) {
          allproduct =await productModel.find({size:req.query.size})
          var result=[];
          if(allproduct ||req.query.minimum_price && req.query.maximum_price){
              allproduct.forEach(user=>{
                  // console.log(user);
                     let obj={
                       id:user._id,
                       title: user.title,
                       price:user.tag,
                       code:user.code,
                       image:user.image,
                       hover:user.hover
                     };
                     result.push(obj);
                     console.log
                   });
                   res.jsonp(result);
                 }
          
        
      }   else if ( req.query.colorData) {
        var data = req.query.colorData;
        // console.log('col',data);
        allproduct =await productModel.find({color:data})
        var result=[];
        if(allproduct ||req.query.minimum_price && req.query.maximum_price){
            allproduct.forEach(user=>{
                // console.log(user);
                   let obj={
                     id:user._id,
                     title: user.title,
                     price:user.tag,
                     code:user.code,
                     image:user.image,
                     hover:user.hover
                   };
                   result.push(obj);
                   console.log
                 });
                 res.jsonp(result);
               }
  }
  
      
      else {
  
        
        // console.log(req.params.page);
        let currentPage = 1;
      let page = req.params.page;
      if (page) {
          currentPage = page;
      }
      const perPage = 4;
      const skip = (currentPage - 1) * perPage;
     
          allproduct =await productModel.find({tag:{$gt:req.query.minimum_price  }})
          .skip(skip)
          .limit(perPage)
          .sort({ updatedAt: -1 });
          
          var result=[];
        
          if(allproduct ||req.query.minimum_price && req.query.maximum_price){
              allproduct.forEach(user=>{
                     let obj={
                       id:user._id,
                       title: user.title,
                       price:user.tag,
                       code:user.code,
                       image:user.image,
                       hover:user.hover,
                      
                     };
                     result.push(obj);
                    //  console.log(result)
                   });
                  
                   
                   res.jsonp(result);
                 
  
                 }
                 
          
        }
         
    }catch(err){
      console.log(err);
    }
 





//     let data = await productModel.find({subCategory:req.query.checked})
//     let pricedata = await productModel.find({ price: { $gt: req.query.minimum_price } })
//     console.log(pricedata);
//     var result=[];
//     var priceResult = []
//     if(!pricedata == "empty"){
//         pricedata.forEach(user=>{
//           let obj1={
//             id:user._id,
//             title: user.title,
//             price:user.price
//           };
//           priceResult.push(obj1);
          
//         });
//         res.jsonp(priceResult);
//       }
//    if(data && data.length && data.length>0){
//      data.forEach(user=>{
//        let obj={
//          id:user._id,
//          title: user.title,
//          price:user.price
//        };
//        result.push(obj);
//        console.log
//      });
//      res.jsonp(result);
//    }
 
  


    // var data = req.query.checked
    // if (data == 1) {
    //     imageCategoryModel.find()
    //     .then(result=>{
    //         if(result)
    //         {
    //           db.collection('categories').aggregate([
    
    //               // Join with user_info table
    //               {
    //                   $lookup:{
    //                       from: 'sub_categories',       // other table name
    //                       localField: 'category',   // name of users table field
    //                       foreignField: 'category', // name of userinfo table field
    //                       as: 'category_info'         // alias for userinfo table
    //                   }
    //               },
                 
    //               {
    //                   $lookup:{
    //                       from: 'products', 
    //                       localField: 'category', 
    //                       foreignField: 'category',
    //                       as: 'product_role'
    //                   }
    //               },
                  
    //           ]).toArray(function(err,resullt){
          
    //                       if (err)
    //                           console.log(err);
                         
    
    //                           categorySubModel.find()
                              
    //                           .then(catData=>{
    //                               if(catData){
    //                                   db.collection('sub_categories').aggregate([
    //                                     {
    //                                         $lookup:{
    //                                             from: 'products',       // other table name
    //                                             localField: 'subCategory',   // name of users table field
    //                                             foreignField: 'subCategory', // name of userinfo table field
    //                                             as: 'category_info'         // alias for userinfo table
    //                                         }
    //                                     },
                                       
    //                                   ]).toArray(function(err,commoncount){
    //                                     //   console.log(commoncount)
    //                                           if(commoncount){
    //                                             productModel.find().sort({"price":-1})
    //                                             .then(products=>{
    //                                                 res.render('filter',{
    //                                                     title:"filter",
    //                                                     category:catData,
    //                                                   data:resullt,
    //                                                   count:commoncount,
    //                                                   products:products,
    //                                                   user:req.user? req.user:"",
    //                                                   cart:[]
    //                                                 })
                                                    
                                            
                                                    
    //                                             })
    //                                             .catch(err=>{
    //                                                 console.log(err);
    //                                             })
                                                 
    //                                           }
    //                                   })
                                  
                                 
    //                               }
    //                           })
    //                           .catch(err=>{
    //                               console.log(err);
    //                           })
                       
    
                           
    //                   })
    //         }
    //         else{
    //             console.log("category not found");
    //         }
    //     })
    //     .catch(err=>{
    //         console.log(err);
    //     })
    
    
    
    //   } else if (data == 3) {
    //     imageCategoryModel.find()
    //     .then(result=>{
    //         if(result)
    //         {
    //           db.collection('categories').aggregate([
    
    //               // Join with user_info table
    //               {
    //                   $lookup:{
    //                       from: 'sub_categories',       // other table name
    //                       localField: 'category',   // name of users table field
    //                       foreignField: 'category', // name of userinfo table field
    //                       as: 'category_info'         // alias for userinfo table
    //                   }
    //               },
                 
    //               {
    //                   $lookup:{
    //                       from: 'products', 
    //                       localField: 'category', 
    //                       foreignField: 'category',
    //                       as: 'product_role'
    //                   }
    //               },
                  
    //           ]).toArray(function(err,resullt){
          
    //                       if (err)
    //                           console.log(err);
                         
    
    //                           categorySubModel.find()
                              
    //                           .then(catData=>{
    //                               if(catData){
    //                                   db.collection('sub_categories').aggregate([
    //                                     {
    //                                         $lookup:{
    //                                             from: 'products',       // other table name
    //                                             localField: 'subCategory',   // name of users table field
    //                                             foreignField: 'subCategory', // name of userinfo table field
    //                                             as: 'category_info'         // alias for userinfo table
    //                                         }
    //                                     },
                                       
    //                                   ]).toArray(function(err,commoncount){
    //                                     //   console.log(commoncount)
    //                                           if(commoncount){
    //                                             productModel.find().sort({"price":-1})
    //                                             .then(products=>{
    //                                                 res.render('filter',{
    //                                                     title:"filter",
    //                                                     category:catData,
    //                                                   data:resullt,
    //                                                   count:commoncount,
    //                                                   products:products,
    //                                                   user:req.user? req.user:"",
    //                                                   cart:[]
    //                                                 })
                                                    
                                            
                                                    
    //                                             })
    //                                             .catch(err=>{
    //                                                 console.log(err);
    //                                             })
                                                 
    //                                           }
    //                                   })
                                  
                                 
    //                               }
    //                           })
    //                           .catch(err=>{
    //                               console.log(err);
    //                           })
                       
    
                           
    //                   })
    //         }
    //         else{
    //             console.log("category not found");
    //         }
    //     })
    //     .catch(err=>{
    //         console.log(err);
    //     })
       
    //   } else {
    //     productModel.find()
    //     .then()
    //     .catch(err=>{
    //    console.log(err);
    //     })
    //   }
})

router.get('/single_product/:id' ,home_controller.singleGrid);
router.post('/cart/add/:id' ,home_controller.singleCartGrid);
router.get('/cart/add/:id' ,home_controller.singlepageCartGrid);
// router.get('/cart/add/:id' ,home_controller.wishCartGrid);
router.get('/wishlist/add/:id',auth,home_controller.wishlist);
router.get('/wishlist' ,auth,home_controller.myWishlist);
router.get('/wishlistError' ,home_controller.wishlistError);
// router.get('/wishlist' ,auth,home_controller.myWishlist);
router.post('/rating' ,home_controller.userRating);
router.get('/notfound' ,home_controller.notFound);
router.get('/update/:product/:color/:size', function (req, res) {

    var slug = req.params.product;
    var cart = req.session.cart;
    var action = req.query.action;
    var col = req.params.color;
    var size = req.params.size;
// console.log(req.params.color);
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == slug && cart[i].color === col && cart[i].size === size || cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if (cart[i].qty < 1)
                        cart.splice(i, 1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0)
                        delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }

   console.log('success', 'Cart updated!');
   req.flash('success' ,'Cart updated!');
    res.redirect('back');

});

router.get('/updatewish/:product', function (req, res) {

    var slug = req.params.product;
    var wish = req.session.wishlist;
    var action = req.query.action;

    for (var i = 0; i < wish.length; i++) {
        if (wish[i].title == slug) {
            switch (action) {
                case "add":
                    wish[i].qty++;
                    break;
                case "remove":
                    wish[i].qty--;
                    if (wish[i].qty < 1)
                    wish.splice(i, 1);
                    break;
                case "clear":
                    wish.splice(i, 1);
                    if (wish.length == 0)
                        delete req.session.wishlist;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }

   console.log('success', 'wish updated!');
   req.flash('success', 'wish updated!');
    res.redirect('back');

});

router.get('/cart/clear', function (req, res) {

    delete req.session.cart;
    
    req.flash('success', 'Cart cleared!');
    res.redirect('/shopping_cart');

});

    

router.get('/shopping_cart' ,home_controller.viewCart);



router.get('/account_page' ,home_controller.accountPage);
router.post('/changePassword' ,home_controller.forgotPassword);
// router.post('/forgot' ,home_controller.forgotPassword);
router.post('/resetPassword',home_controller.resetPassword);
router.post('/register_page' ,[check('phone').isLength({min:10,max:10}).isMobilePhone()
.withMessage('phone number should be 10 digits')]
,home_controller.registerPage);
// router.get('/otp',home_controller.getOtp);

router.post('/register_auth',[check('fname').
isLength({min:3 ,max:50}).trim().
withMessage('name should not be less than 3'),
check('phone').isLength({min:10,max:10}).isMobilePhone()
.withMessage('phone number should be 10 digits'),
check('email').normalizeEmail()
.isEmail().withMessage('email should valid'),
body('password','password must be 6 digits')
.isLength({min:6})],home_controller.postRegister);


router.post('/login_auth',[check('email').normalizeEmail().isEmail().withMessage('email should be valid'),
body('password','password must be 6 digits')
.isLength({min:6})],home_controller.postLogin);




router.get('/loggedUser' ,auth,home_controller.getlogUser);
router.get('/address' ,auth,home_controller.userAddress);
router.post('/changeAddress/:id',auth,home_controller.userChangeAddress);
router.get('/deleteAddress' ,auth,home_controller.deleteAddress);


router.get('/logout' ,home_controller.logout);
 router.post('/seach' ,home_controller.search);
 router.get('/searchcart/add/:id' ,home_controller.searchCartGrid);
 router.get('/searchProduct',home_controller.getSearchproduct);
 router.get('/vidio',home_controller.vidio);


 router.get('/shopCategory/:category' ,home_controller.shopCategory)



 router.get('/contact_us' ,home_controller.contactPage);
 router.get('/blog_right_sidebar' ,home_controller.blogPage);


















// router.get('/register',home_controller.getRegister);
// router.get('/login',home_controller.getLogin);
router.get('/edithomeUser/:id' ,home_controller.doEdit);

router.post('/homeuserupdate' ,home_controller.doUpdate);
// router.get('/delete/:id' ,home_controller.doDelete);

// router.post('/register_auth',home_controller.postRegister);
// router.post('/login_auth' ,home_controller.postLogin);









module.exports =router;