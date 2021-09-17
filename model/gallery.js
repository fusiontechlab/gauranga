const mongoose = require('mongoose'); //odm
const Schema = mongoose.Schema;

// Product Schema
const GallerySchema = new Schema({
    
    file: {
        type: String
    },
    productId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
        },
    
})

module.exports = mongoose.model('gallery',GallerySchema);

