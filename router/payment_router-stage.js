let express = require("express");
const router = require("express").Router();
const shortid = require('shortid');
// const dotenv = require("dotenv");
const Orders = require('../model/order');
const cors = require('cors');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { body } = require("express-validator/check");
const Axios = require('axios');
const productModel = require('../model/productModel');

const instance = new Razorpay({
Merchant_id:	'HFoHuLHUnSsJO1',
Merchant_Name	:'Gouranga Paul and Sons',
URL:'	https://gourangapaul.com',
key_id:	'rzp_test_pvn3uHaShB8xVv',
key_secret	:'jTR5z1yhQnpgMQLFnbq9fwmN'

  // key_id:'rzp_test_k8b43U7cw2e0ha',
  // key_secret:'81Pc59wYMjTrusVJ3pAotcbV',
});
//Middlewares

//Routes
// router.get("/payments", (req, res) => {
//   res.render("payment", { key:'rzp_test_k8b43U7cw2e0ha'});
// });
router.post("/api/payment/order", async(req, res) => {
  // params = req.body;
  // console.log(params);
  const body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  console.log("body1" ,body);
  const payment_capture = 1
	const amount = req.body.amount
	const userAddress = req.body.address
	const titleProduct = req.body.items
	const currency = 'INR'
// console.log("test" ,req.body.amount ,req.body.address ,req.body.items)
	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}
console.log("ui",options);
	try {
		const response = await instance.orders.create(options)
		console.log("rs",response);
		console.log("rsoption",response.address);
    res.send({ sub: response, status: "success" });
		const secret = '12345678'

  const body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  console.log("body" ,req.body.address);
  customerId = req.user._id;
    items = req.session.cart;
    const { fname, lname, phone, email, address, city, state, code, country, sfname, slname, sphone, semail, saddress, scity,
      sstate,
      scode,
      scountry,
      paymentType,
      totalAmount,
      chargeprice
  } = req.body;
  
    const order = new Orders({
        customerId: customerId,
        items: items,
		address:req.body.address,
    fname:req.body.fname,
    lname:req.body.lname,
    phone:req.body.phone,
    fname, lname, phone, email, address, city, state, code, country, sfname, slname, sphone, semail, saddress, scity,
        sstate,
        scode,
        scountry,
        totalAmount,
      chargeprice,
		orderId:req.body.razorpay_order_id,
		rozapayId:req.body.razorpay_payment_id,
        paymentType:"credit card"



    })
    order.save().then(result => {
      delete req.session.cart;
        Orders.populate(result, { path: 'customerId' }, (err, placedorder) => {
			if(placedorder){
			// console.log(req.session.cart);
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
               
            
            //   Axios.get(`http://sms.fusiontechlab.com/app/smsapi/index.php?key=5ffc399da3287&type=text&contacts=${req.user.phone}&senderid=GPAULS&peid=1001445840000025498&templateid=1007162235587557920&msg=Thankfully we received ${totalAmount} against Order No ${result._id} at www.gourangapaul.com`).then(result=>{
            //     console.log(result.data);
            // })
            
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
     
				
			}else{
            req.flash('success', 'post success failed')
          res.redirect('/orderList');
      }
          
            
           
            
        })


   
      
	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
    
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
  delete req.session.cart;
   Axios.get(`http://sms.fusiontechlab.com/app/smsapi/index.php?key=5ffc399da3287&type=text&contacts=${req.user.phone}&senderid=GPAULS&peid=1001445840000025498&templateid=1007162235587557920&msg=Thankfully we received ${totalAmount} against Order No ${result._id} at www.gourangapaul.com`).then(result=>{
                console.log(result.data);
            })
	res.json({ status: 'ok your order is placed & cart is cleared and continue shopping' });
  
  req.flash('success', 'order placed')
  return res.redirect('/')
})
.catch(err => {
    console.log(err);
})
	} catch (error) {
		console.log(error);
    // res.send({ sub: error, status: "failed" });
	}
  // params = req.body;
  // // console.log(params);
 
  // instance.orders
  //   .create(params)
  //   .then((data) => {
  //     console.log("orderid",data);
  //     res.send({ sub: data, status: "success" });
  //   })
  //   .catch((error) => {
  //     res.send({ sub: error, status: "failed" });
  //   });
});

router.post("/api/payment/verify", (req, res) => {
 console.log(req.body)
  // var expectedSignature = crypto
  //   .createHmac("sha256",'81Pc59wYMjTrusVJ3pAotcbV')
  //   .update(body.toString())
  //   .digest("hex");
  // console.log("sig" + req.body.razorpay_signature);
  // console.log("sig" + expectedSignature);
  // var response = { status: "failure" };
  // if (expectedSignature === req.body.razorpay_signature)
  //   response = { status: "success" };
  // res.send(response);

  const secret = '12345678'

  const body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  console.log("body" ,req.body.address);
  customerId = req.user._id;
    items = req.session.cart;
    const { fname, lname, phone, email, address, city, state, code, country, sfname, slname, sphone, semail, saddress, scity,
      sstate,
      scode,
      scountry,
      paymentType,
      totalAmount,
      chargeprice
  } = req.body;
  
    const order = new Orders({
        customerId: customerId,
        items: items,
		address:req.body.address,
    fname:req.body.fname,
    lname:req.body.lname,
    phone:req.body.phone,
    fname, lname, phone, email, address, city, state, code, country, sfname, slname, sphone, semail, saddress, scity,
        sstate,
        scode,
        scountry,
        totalAmount,
      chargeprice,
		orderId:req.body.razorpay_order_id,
		rozapayId:req.body.razorpay_payment_id,
        paymentType:"credit card"



    })
    order.save().then(result => {
      delete req.session.cart;
        Orders.populate(result, { path: 'customerId' }, (err, placedorder) => {
			if(placedorder){
			// console.log(req.session.cart);
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
               
            
            //   Axios.get(`http://sms.fusiontechlab.com/app/smsapi/index.php?key=5ffc399da3287&type=text&contacts=${req.user.phone}&senderid=GPAULS&peid=1001445840000025498&templateid=1007162235587557920&msg=Thankfully we received ${totalAmount} against Order No ${result._id} at www.gourangapaul.com`).then(result=>{
            //     console.log(result.data);
            // })
            
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
     
				
			}else{
            req.flash('success', 'post success failed')
          res.redirect('/orderList');
      }
          
            
           
            
        })


   
      
	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
    
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
  delete req.session.cart;
   Axios.get(`http://sms.fusiontechlab.com/app/smsapi/index.php?key=5ffc399da3287&type=text&contacts=${req.user.phone}&senderid=GPAULS&peid=1001445840000025498&templateid=1007162235587557920&msg=Thankfully we received ${totalAmount} against Order No ${result._id} at www.gourangapaul.com`).then(result=>{
                console.log(result.data);
            })
	res.json({ status: 'ok your order is placed & cart is cleared and continue shopping' });
  
  req.flash('success', 'order placed')
  return res.redirect('/')
})
.catch(err => {
    console.log(err);
})
});

module.exports = router;










































// const router = require("express").Router();
// const Razorpay = require('razorpay');

// const instance = new Razorpay({
// 	key_id: 'rzp_test_k8b43U7cw2e0ha',
// 	key_secret: '81Pc59wYMjTrusVJ3pAotcbV'
// })


// router.post('/razorpay', async (req, res) => {
//    var params = req.body;
//    console.log("ddu0",params);
//     instance.orders
//       .create(params)
//       .then((data) => {
//         res.send({ sub: data, status: "success" });
//       })
//       .catch((error) => {
//         res.send({ sub: error, status: "failed" });
//       });
// })



// module.exports = router;