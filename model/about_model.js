const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutdata = new Schema({
  title:{
      type:String,
      
  },

    about:{
    type:String,
   

}

  







})

module.exports = mongoose.model('about' ,aboutdata)