
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conditiondata = new Schema({
  title:{
      type:String,
      
  },

    condition:{
    type:String,
   

}
})

module.exports = mongoose.model('condition' ,conditiondata)