const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    customerId: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'usersData',
                required: true
                },
            items: { type: Object },
            total:{type:Number},
            totalAmount:{type:Number},
            fname: { type: String},
            lname:{ type: String} ,
            phone: { type: String},
            email: { type: String},
            address:{ type: String} ,
            city: { type: String },
            state: { type: String},
            code: { type: Number},
            chargeprice:{type:Number},
            country:{ type: String} ,
            sfname:{ type: String} ,
            slname: { type: String},
            sphone: { type: String},
            semail: { type: String},
            saddress: { type: String},
            scity: { type: String},
            sstate: { type: String},
            scode: { type: String},
            scountry: { type: String},
            deliveryStatus:{type:Boolean,
                default: '1'},
            paymentType:{ type: String}  ,
            orderId:{type:Object},
            rozapayId:{type:Object},
            status: { type: String, default: 'order_placed' },
            }, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)