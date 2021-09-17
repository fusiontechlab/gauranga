const mongoose = require('mongoose'); //odm
const Schema = mongoose.Schema;

// Product Schema
const ProductSchema = new Schema({
    title: {
        type: String,
       
        
    },
    desc: {
        type: String,
        
    },

    longdesc: {
        type: String,
    },
    category: {
        type: String
        
    },

    subCategory:{
       type:String,
       
    },
    price: {
        type: Number,
        
        
    },
    code:{
        type:Number
    },

    offered:{
         type:String
    },

    tag:{
         type:Number
    },

    gst:{
           type:String
    },
    attribute :{
        type:String,
       
    },
    size: { type: Object },

    color: { type: Object },

    
    image: {
        type: Array
    },
    hover:{
        type:String
    },
    topRating :{
        type:Number, default:0
    },
    sold :{
        type:Number, default:0
    },
    specialProduct:{
        type:Boolean ,default:false
    },
    
    availability: { type: String, default: 'In Stock' },
    VendorId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usersData',
      
        }
    
},{ timestamps: true })

module.exports = mongoose.model('product',ProductSchema);

