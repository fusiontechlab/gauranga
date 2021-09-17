const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const faqdata = new Schema({
  title:{
      type:String,
      
  },

    faq:{
    type:String,

}

})

module.exports = mongoose.model('faq' ,faqdata)