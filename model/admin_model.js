const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookData = new Schema({
  title:{
      type:String,
      required:true
  },

    name:{
    type:String,
    required:true

},

  author:{
      type:String,
      required:true
  },

  image:{
      type:String,
      required:true
  }







})

module.exports = mongoose.model('bookdata' ,bookData)