const mongoose = require('mongoose'); //odm
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema


const Imagedata = new Schema({


    category: {
        type: String,
        require: true,
        unique:true

    },
     short_desc: {
         type: String,
       
     },
    subcategory: {
        type: ObjectId,
        ref: 'Sub_Category',
        
    }


})


module.exports = mongoose.model('Category', Imagedata);

