const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactData = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usersData',
    required: true
    },
  name:{
      type:String,
      
  },

    email:{
    type:String,
    

},

  phone:{
      type:String,
     
  },

  message:{
      type:String,
      
  }







})

module.exports = mongoose.model('contact' ,contactData)