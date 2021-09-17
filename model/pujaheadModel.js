const mongoose = require('mongoose'); //odm
const Schema = mongoose.Schema;

// Product Schema
const pujaofferSchema = new Schema({
    
    title: {
        type: String
    },
    heading: { 
        type:String
    },
    bannerimage:{
        type:String
    }
    
})

module.exports = mongoose.model('Pujaoffer',pujaofferSchema);

