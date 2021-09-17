const mongoose = require('mongoose'); //odm
const Schema = mongoose.Schema;

// Product Schema
const vidioSchema = new Schema({
    
    title: {
        type: String
    },
    paragraph: { 
        type:String
    }
    // vidio:{
    //     type:String
    // }
    
})

module.exports = mongoose.model('Vidio',vidioSchema);

