const express = require('express');

const homeRoute = require('./router/home_router');
const adminRoute = require('./router/admin_router');
const productRoute = require('./router/product_routes');
const categoryRoute = require('./router/categories_routes');
const paymentRoute = require('./router/payment_router');
const orderRoute = require('./router/order_router');
const pujaRoute = require('./router/pujacollection_router');
const path = require('path');
const mongoConfig = require('mongoose');
const session = require('express-session');
const secure = require('express-force-https');
// const cookie = require('cookie-parser');
const mongoStore = require('connect-mongodb-session')(session);
const body_parser = require('body-parser');
// const multer = require('multer');
//const fileUpload = require('express-fileupload');
const expressValidator = require('express-validator');
const flash = require('express-flash');
  
require('dotenv').config();

const { db, distinct } = require('./model/imageCategoryModel');
const imageCategoryModel = require('./model/imageCategoryModel');
const passport = require('passport');


const app = express();


// function requireHTTPS(req, res, next) {
//   // The 'x-forwarded-proto' check is for Heroku
//   if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
//     return res.redirect('https://' + req.get('host') + req.url);
//   }
//   next();
// }

//    app.use(requireHTTPS); 


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(body_parser.urlencoded({extended:false}));
app.use(body_parser.json());


const uri = `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserpass}@education-mlljb.mongodb.net/${process.env.mongodatabase}`;




// app.get('*', function(req, res, next) {  
//     res.redirect('https://' + req.headers.host + req.url);
// })

app.use(express.static(path.join(__dirname,'public')));

app.use('/image',express.static(path.join(__dirname,'image')));

app.use('/banner',express.static(path.join(__dirname,'banner')));
app.use('/offer',express.static(path.join(__dirname,'offer')));
// app.use(express.static('public/images'));
// app.use(multer({storage:fileStorage ,fileFilter:fileFilter}).single('image'));
const session_store = new mongoStore({
    uri:uri,
    collection:'sessions'
})

app.use(session({
    secret:`${process.env.SECRET_KEY}`,
    resave:false,
    saveUninitialized:false,
    store:session_store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },// 24 hour 
    
}))

app.use(flash())

// app.use(require('connect-flash')());
// app.use(function (req, res, next) {
//     res.locals.messages = require('express-messages')(req, res);
//     next();
// });

//passport config
const passportInit = require('./config/passport');

passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine' ,'ejs');
app.set('views', path.join(__dirname, '/resources/view'))


app.get('*', function(req,res,next) {
    res.locals.cart = req.session.cart;
    res.locals.wishlist = req.session.wishlist;
    // console.log(req.session.wishlist);
    res.locals.user = req.user;
    res.locals.checkout = req.session.checkout;
    next();
 });


 

// Get all categories to pass to header.ejs




// app.use(expressValidator({
//     errorFormatter: function (param, msg, value) {
//         var namespace = param.split('.')
//                 , root = namespace.shift()
//                 , formParam = root;

//         while (namespace.length) {
//             formParam += '[' + namespace.shift() + ']';
//         }
//         return {
//             param: formParam,
//             msg: msg,
//             value: value
//         };
//     },
//     customValidators: {
//         isImage: function (value, filename) {
//             var extension = (path.extname(filename)).toLowerCase();
//             switch (extension) {
//                 case '.jpg':
//                     return '.jpg';
//                 case '.jpeg':
//                     return '.jpeg';
//                 case '.png':
//                     return '.png';
//                 case '':
//                     return '.jpg';
//                 default:
//                     return false;
//             }
//         }
//     }
// }));

app.get('*', function(req,res,next) {
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
                              app.locals.data = resullt;
              })
              
            }
        }
        next();
    });
    
 });


app.use( homeRoute);
app.use(adminRoute);
app.use(categoryRoute);
app.use(productRoute);
app.use(orderRoute);
app.use(paymentRoute);
app.use(pujaRoute);


mongoConfig.connect(uri,{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true ,useFindAndModify:false})
.then(result=>{
    app.listen(process.env.PORT||2400,()=>{
        console.log('server running 2400');
       });
})
.catch(err=>{
    console.log(err);
})


