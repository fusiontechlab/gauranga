const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliverychargeSchema = new Schema({
    // state: {
    //     type:String
    // },
    // city: {
    //     type: String
    // },
    pin_code: {
        type: Number,
        unique:true
       
        
    },
    charge:{
        type:String
    }

   

}, { timestamps: true })

module.exports = mongoose.model('shipcharge' ,deliverychargeSchema)

