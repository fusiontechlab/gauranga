const mongoose = require('mongoose'); //odm
const Schema = mongoose.Schema;

// Product Schema
const getInTouchSchema = new Schema({
    
    title: {
        type: String
    },
    heading: { 
        type:String
    },
    address:{
        type:String
    },
    phone:{
        type:String
    },
    telephone:{
        type:String
    },
    email:{
        type:String
    },
    fax:{
        type:String
    }
   
    
})

module.exports = mongoose.model('Address',getInTouchSchema);

