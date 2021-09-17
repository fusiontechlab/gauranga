const mongoose = require('mongoose'); //odm
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema


const ImageSubdata = new Schema({
    category: {
        type: String,
        require: true,


    },

    subCategory: {
        type: String,
        require: true,
        unique:true

    },
    categoryid: {
        type: ObjectId,
        ref: 'Category',
       
    }


})




module.exports = mongoose.model('Sub_Category', ImageSubdata);