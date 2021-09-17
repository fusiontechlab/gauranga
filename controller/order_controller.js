const Orders = require('../model/order');
const categorySubModel = require('../model/imageSubCategory');
const moment = require('moment');
const productModel = require('../model/productModel');
const { db, distinct } = require('../model/imageCategoryModel');
const imageCategoryModel = require('../model/imageCategoryModel');
const shipchargeModel = require('../model/delivery_charge');
const flash = require('express-flash');
const { json } = require('body-parser');
const { read } = require('fs-extra');
const { default: Axios } = require('axios');
const { array } = require('../services/ImageUpload');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
const session = require('express-session');
const Formidable = require("formidable");
require('dotenv').config();



const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: `${process.env.mail_host}`,
    port: `${process.env.mail_port}`,
    auth: {
        user: `${process.env.mail_user}`,
        pass: `${process.env.mail_pass}`
    }
});


exports.testmail = (req, res, next) => {
    // send email

    // console.log(req.user.email);
 transporter.sendMail({
        from: `${process.env.mail_user}`,
        to: req.user.email,
        subject: 'Test Email Subject',
        text: 'Example Plain Text Message Body hi from aditya'
    });

  
  console.log('ok');
  res.json({
   ok:'hello'
    
})
    
}

exports.checkout = (req, res, next) => {
    // console.log("cart",req.session.cart);
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
                  
              ]).toArray(async function(err,resullt){
                 try {
                    if (err){
                        console.log(err)}

                        let subtotal = 0;
                        req.session.cart.forEach(element => {
                            // console.log(element.price*element.qtyqty);
                            var total = parseInt(element.price)*parseInt(element.qty)
                            subtotal += total;
                        });
                        let shipcharg = await shipchargeModel.find();
                            res.render('checkout', {
                                data:resullt,
                                charges:shipcharg,
                                total:subtotal
                                
                            })


                       
                 } catch (error) {
                     console.log(error)
                 }
                          
              })
              
            }
        }
        
    });
    
}
// exports.getdelivercharge =async(req,res,next)=>{
//     console.log(req.query.myfilter);
//     let chargeid = req.query.myfilter;
//    console.log(req.session.cart);
//    let allpincharge = await shipchargeModel.find({pin_code:chargeid});
//     console.log(allpincharge);
//     let result =[];
//     if(chargeid){
//         req.session.cart.forEach(element => {
//             console.log(element.price*element.qtyqty);
//             var total = parseInt(element.price)*parseInt(element.qty)
//             allpincharge.forEach(pro=>{
//                 var totalamount = parseInt(pro.charge)+parseInt(total);
//                 // console.log(totalamount);
//                 let obj={
//                   id:pro._id,
//                   pin_code:pro.pin_code,
//                   charge:pro.charge,
//                   amount:element.price,
//                   total:totalamount
                  
//                 };
//                 result.push(obj);
//               });
//             //   return result;

          
//         });
//         console.log(result);
//   //   aditya saha pin
//   res.json(result);
// }
// }



exports.getdelivercharge =async(req,res,next)=>{
    console.log(req.query.myfilter);
    let chargeid = req.query.myfilter;
   console.log(req.session.cart);
   let allpincharge = await shipchargeModel.find({pin_code:chargeid});
    
    let result =[];
    let subtotal = 0;
    if(chargeid){
        req.session.cart.forEach(element => {
            console.log(element.price*element.qtyqty);
            var total = parseInt(element.price)*parseInt(element.qty)
            subtotal += total;
        });

        let havetopay = subtotal+parseInt(allpincharge[0].charge);
        let obj={
            id:allpincharge[0]._id,
            pin_code:allpincharge[0].pin_code,
            charge:allpincharge[0].charge,
            amount:subtotal,
            total:havetopay,
            
          };
          result.push(obj);
        // console.log('------------------');
        // console.log(subtotal+parseInt(allpincharge[0].charge));
        // console.log('-----------all pin charge-------');
        // console.log(allpincharge[0].charge);
  //   aditya saha pin
  res.json(result);
}
}

exports.getFilter = (req, res, next) => {
    categorySlug = req.params.id


    categorySubModel.findOne({ subCategory: categorySlug }, function (err, c) {
        productModel.find({ subCategory: categorySlug }, function (err, products) {

            if (err)
                console.log(err);

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

                                                productModel.find({ subcategory: req.params.id })
                                                    .then(data => {
                                                        res.render('shopbycategory', {
                                                            title: "title",
                                                            category: catData,
                                                            data: resullt,
                                                            count: commoncount,
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

        });
    });
}

exports.filterProduct = (req, res, next) => {
    console.log("working");
    console.log(req.params);
    const data = req.params

    

    productModel.find({ subCategory: data.subCategory})
        .then(data => {
        

            if (req.xhr) {
                return res.json(data);
               
            } else {
                return res.render('shopbyfilter');
            }
        })
        .catch(err => {
            console.log(err);
        })


}

exports.filterProducts = (req,res,next)=>{
  

    productModel.find()
        .then(data => {
        

            if (req.xhr) {
                return res.json(data);
               
            } else {
                return res.render('shopbyfilter');
            }
        })
        .catch(err => {
            console.log(err);
        })
}

exports.accountPage = (req, res, next) => {
    res.render('account_page', {
        title: "accountPage",
        error: []
    })
}

exports.registerPage = (req, res, next) => {
    res.render('register_page', {
        title: "register_page",
        data: [],
        editable: false,
        error: null,
        message: req.flash('message')
    })


}



exports.postOrder = (req, res, next) => {
    customerId = req.user._id;
    items = req.session.cart;

    const { fname, lname, phone, email, address, city, state, code, country, sfname, slname, sphone, semail, saddress, scity,
        sstate,
        scode,
        scountry,
        paymentType,
        total,
        totalAmount,
        chargeprice
    } = req.body;


    if (!phone || !address || !code) {
        console.log('error', 'All fields are required')
        req.flash("success",'All fields are required');
        res.redirect('/checkout');
    }


    if(!paymentType){
        req.flash("success",'Please Select Payment Method');
        res.redirect('/checkout');
    }


  if(paymentType == 'COD'){
    const order = new Orders({
        customerId: customerId,
        items: items, total,
        fname, lname, phone, email, address, city, state, code, country, sfname, slname, sphone, semail, saddress, scity,
        sstate,
        scode,
        scountry,
        totalAmount: parseInt(totalAmount),
        chargeprice: parseInt(chargeprice),
        paymentType,



    })
    order.save().then(result => {
        Orders.populate(result, { path: 'customerId' }, (err, placedorder) => {
           
            if(placedorder){
                delete req.session.cart;
                
                placedorder.items.forEach(element => {
                
                productModel.find({_id:element._id})
                .then((soldpro)=>{
                    console.log("resold",soldpro)
                   if(soldpro){
                   let rt = soldpro.find(o=>{
                       console.log("hj",o.sold)
                       let ty = parseInt(element.qty);
                       let rts = parseInt(o.sold);
                       productModel.findByIdAndUpdate({_id:element._id},
                        {
                            $set: {
                                sold:rts+ty
                            }
                        }, { new: true })
                    .then((solditem)=>{
                     Axios.get(`http://sms.fusiontechlab.com/app/smsapi/index.php?key=5ffc399da3287&type=text&contacts=${req.user.phone}&senderid=GPAULS&peid=1001445840000025498&templateid=1007162020012444957&msg=Your order had successfully placed at www.gourangapaul.com and your order ID is ${result._id}`).then(result=>{
                         console.log(result.data);
                     
                     })
                    
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                   });
                 
                
                  
                   
                   }else{
                       onsole.log("product not found")
                   }
                })
                .catch(err=>{
                    console.log(err);
                })
             
            });
            res.redirect('/orderlist');
           
        }else{
            req.flash('success', 'post  failed')
             res.redirect('/orderlist');
        }
        })


    }).catch(err => {
            console.log(err);
        })
    }else{
    let addtocartuserdata = {
                customerId: customerId,
                items: items, total,
                fname, lname, phone, email, address, city, state, code, country, sfname, slname, sphone, semail, saddress, scity,
                sstate,
                scode,
                scountry,
                totalAmount: parseInt(totalAmount),
                chargeprice: parseInt(chargeprice),
                paymentType,
            };
        req.session.checkout = [];
        req.session.checkout.push(addtocartuserdata);
        console.log(req.session.checkout);
        res.redirect('/paymenttoorder');



    }

}



exports.paymentToOrder = (req, res, next) => {
    // customerId = req.user._id;
    items = req.session.cart;
    let pay = req.session.checkout[0].totalAmount;

    var instance = new Razorpay({
        key_id: process.env.Rez_key_id,
        key_secret: process.env.Rez_key_secret,
      });
      let orderid = uuidv4();
      let options = {
        amount: pay*100, // amount in the smallest currency unit
        currency: "INR",
        receipt: orderid,
      };

      let orderdata = {
        orderid : orderid,
        name :  req.user.fname+' '+req.user.lname,
        email : req.user.email,
        phone : req.user.phone,
        havetopay : pay*100,
        rezpaykey: `${process.env.Rez_key_id}`,
    }

      instance.orders.create(options, function (err, order) {
        if (err) {
            console.log(err);
        }else{

            // req.session.checkout.push({orderid:order.id});
        // console.log(req.session.checkout);
            console.log(order);
            res.render('paymenttoorder',{orderdata: orderdata,order:order})
        }
      })

      

    // console.log(pay);

    
}


// exports.paymentSuccess = (req, res, next) => {
//    console.log(req);
//    res.render('paymentsuccess',{user:req.user})
//     }


    exports.paymentSuccess = (req, res) => {
        // do a validation

        // console.log(req.body);


        // res.json({
        //     aname:5867
        // })



    
   
    
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

if(req.body.razorpay_payment_id != null){
const order = new Orders({
    customerId: req.session.checkout[0].customerId,
    items: req.session.checkout[0].items,
    total: req.session.checkout[0].total,
    fname :req.session.checkout[0].fname,
     lname :req.session.checkout[0].lname,
     phone :req.session.checkout[0].phone,
     email :req.session.checkout[0].email,
     address :req.session.checkout[0].address,
     city :req.session.checkout[0].city,
     state :req.session.checkout[0].state,
     code :req.session.checkout[0].code,
     country :req.session.checkout[0].country,
     sfname :req.session.checkout[0].sfname,
     slname :req.session.checkout[0].slname,
     sphone :req.session.checkout[0].sphone,
     semail :req.session.checkout[0].semail,
     saddress :req.session.checkout[0].saddress,
     scity :req.session.checkout[0].scity,
    sstate:req.session.checkout[0].sstate,
    scode:req.session.checkout[0].scode,
    scountry:req.session.checkout[0].scountry,
    totalAmount: parseInt(req.session.checkout[0].totalAmount),
    chargeprice: parseInt(req.session.checkout[0].chargeprice),
    paymentType: req.session.checkout[0].paymentType,
    rozapayId : req.body.razorpay_payment_id


})
order.save().then(result => {
    Orders.populate(result, { path: 'customerId' }, (err, placedorder) => {
        if(placedorder){
             delete req.session.cart;
            delete req.session.checkout;
            
            placedorder.items.forEach(element => {
            
            productModel.find({_id:element._id})
            .then((soldpro)=>{
                console.log("resold",soldpro)
               if(soldpro){
               let rt = soldpro.find(o=>{
                   console.log("hj",o.sold)
                   let ty = parseInt(element.qty);
                   let rts = parseInt(o.sold);
                   productModel.findByIdAndUpdate({_id:element._id},
                    {
                        $set: {
                            sold:rts+ty
                        }
                    }, { new: true })
                .then((solditem)=>{
                 Axios.get(`http://sms.fusiontechlab.com/app/smsapi/index.php?key=5ffc399da3287&type=text&contacts=${req.user.phone}&senderid=GPAULS&peid=1001445840000025498&templateid=1007162020012444957&msg=Your order had successfully placed at www.gourangapaul.com and your order ID is ${result._id}`).then(result=>{
                     console.log(result.data);
                 
                 })
                
                })
                .catch(err=>{
                    console.log(err)
                })
               });
               }else{
                   onsole.log("product not found")
               }
            })
            .catch(err=>{
                console.log(err);
            })
         
        });
        res.redirect('/orderlist');
       
    }else{
        req.flash('success', 'post  failed')
         res.redirect('/orderlist');
    }
    })


}).catch(err => {
        console.log(err);
    })

}else{
    req.flash('success', 'Order failed')
    res.redirect('/orderlist');
}


    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


            // delete req.session.cart;
            // delete req.session.checkout;
            // require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
    
        // res.render('paymentsuccess');
    }

exports.deleteOrders = (req, res, next) => {
    const id = req.params.id;
    Orders.findByIdAndRemove(id)
        .then(() => {
            res.redirect('/orderData');
        })
        .catch(err => {
            console.log(err);
        })
}
exports.deletevendorOrders=(req,res,next)=>{
    const id = req.params.id;
    Orders.findByIdAndRemove(id)
        .then(() => {
            res.redirect('/vendorOrder');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.orderList = async (req, res, next) => {
    const orders = await Orders.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } });
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
                              res.render('orders_list', {
                                title: "orders",
                                orders: orders,
                                moment: moment,
                                data:resullt
                        
                            });
              })
              
            }
        }
        
    });
   
}



exports.userdeliveredstatus =async(req,res,next)=>{
    const statuss = req.params.id;
    changeStatus = 0;
    const count = await Orders.find()
    const data = await Orders.findByIdAndUpdate(statuss, { $set:{deliveryStatus:changeStatus}});
    if(data){
        Axios.get(`http://sms.fusiontechlab.com/app/smsapi/index.php?key=5ffc399da3287&type=text&contacts=${req.user.phone}&senderid=GPAULS&templateid=< templateIDofDLT >&msg= your order is cancelled`).then(result=>{
            console.log(result.data);
            req.flash('success' ,'ordered has been cancellled');
      res.redirect('back');
        })
    }
    
    
    // res.render("admin/userlist", {

}

exports.editStatus = (req, res, next) => {
    Orders.findById(req.params.id)
        .then(data => {
            if (data) {
                res.render('admin/editStatus', {
                    data: data
                })
            } else {
                console.log("data not found");
            }
        })

}

exports.updateStatus = (req, res, next) => {
    const id = req.body.id;

    Orders.findById(id)
        .then(details => {
            if (details) {
                details.status = req.body.status;
                console.log(details.status);
                return details.save()
                    .then(result => {
                        console.log("update status value");
                        res.redirect('orderData')
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

            else {
                console.log("update data not found");
            }
        })
        .catch(err => {
            console.log(err);
        })
}
exports.logged = (req,res,next)=>{
    console.log(req.params.val);
    var data = req.params.val
    if (data == 2) {
        productModel.find().sort({price:-1})
        .then(lowest=>{
           
            if (req.xhr) {
                return res.json(lowest);
               
            } else {
                return res.render('shopbyfilter');
            }
        })
        .catch(err=>{
            console.log(err)
        })
       
      } else if (data == 3) {
        productModel.find().sort({price:1})
        .then(highest=>{
            if (req.xhr) {
                return res.json(highest);
               
            } else {
                return res.render('shopbyfilter');
            }
        })
        .catch(err=>{
            console.log(err)
        })
       
      } else {
        productModel.find()
        .then()
        .catch(err=>{
       console.log(err);
        })
      }
  
   
}