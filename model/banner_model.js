const mongoose = require('mongoose'); //odm
const Schema = mongoose.Schema;

// Product Schema
const bannerSchema = new Schema({
    
    title: {
        type: String
    },
    file: { 
        type:String
    }
    
})

module.exports = mongoose.model('Banner',bannerSchema);

