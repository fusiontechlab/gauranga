const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privacydata = new Schema({
  heading:{
      type:String,
      
  },

    privacydata:{
    type:String,
   

}
})

module.exports = mongoose.model('privacy' ,privacydata)