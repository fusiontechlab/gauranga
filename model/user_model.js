const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserData = new Schema({
    fname :{
        type:String,
        require:true
    },

    lname:{
        type:String,
        required:true
    },

    
    email :{
        type:String,
        // required :true

    },

    password :{
        type:String,
        required :true

    },
    
    address:{
        type:String,
        require :true
    },
    city :{
        type:String,
       
    },

    phone :{
        type:String,
        required :true

    },
    pan :{
        type :String,
    },

    store:{
        type:String
    },

    status:{
             type:Boolean,
             default: '1'
    },
    user_type:{
        type:String,
        require:true
    },
    document:{
        type: Array
    },
},{ timestamps: true });

module.exports = mongoose.model('usersData',UserData)