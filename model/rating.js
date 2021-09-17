const mongoose = require('mongoose'); //odm
const Schema = mongoose.Schema;

// Product Schema
const ratingschema = new Schema({
    
    quality: {
        type:String
        
    },
    price:{
        type:String
    },
    value:{
        type:String
    },
    name:{
        type:String
    },
    summary:{
        type:String
    },
    
    review:{
        type:String
    
    },
    productId: { 
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
        },
    userId: { 
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'usersData',
        required: true
        }
    
},{
    timestamps:true
})

module.exports = mongoose.model('rating',ratingschema);

