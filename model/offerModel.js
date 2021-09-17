const mongoose = require('mongoose'); //odm
const Schema = mongoose.Schema;

// Product Schema
const offerSchema = new Schema({
    
    title: {
        type: String
    },
    heading: { 
        type:String
    },
    image:{
        type:String
    }
    
})

module.exports = mongoose.model('Offer',offerSchema);

