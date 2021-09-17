const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VendorData = new Schema({
    fname :{
        type:String,
        require:true
    },

    email :{
        type:String,
       

    },
    store :{
        type:String,

    },

    password :{
        type:String,
        required :true

    },

    lname:{
        type:String,
        required:true
    },

    phone :{
        type:String
    },
    
    pan:{
        type:String,
        require :true
    },
    confirmp :{
        type:String,
        required :true

    },
    status:{
        type: String,
        trim: true,
        default: '1',
    },

    
    user_type:{
        type:String,
        require:true
    },
},{ timestamps: true });

module.exports = mongoose.model('vendorData',VendorData)