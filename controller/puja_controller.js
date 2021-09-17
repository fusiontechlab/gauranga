const pujaModel = require('../model/pujaheadModel');
const productModel = require('../model/productModel');
const categorySubModel = require('../model/imageSubCategory');
const vidioModel = require('../model/vidio_model');
const { db, distinct, getMaxListeners } = require('../model/imageCategoryModel');


exports.addpujaOffers =(req,res,next)=>{
    res.render('admin/addpujaOffer', {
        title: "title",
        editable: false
    })
}

exports.postpujaOffer =(req,res,next)=>{

    if (req.file === undefined) {

        const puja = new pujaModel({
            title: req.body.title,
            heading: req.body.heading,
            bannerimage: null
        })
        return puja.save()
            .then(data => {
                // console.log(data);
                req.flash('success', 'data save success');
                res.redirect('/viewpujaOffer')
            })
            .catch(err => {
                req.flash('error', 'data not saved');
                console.log(err);
            })
    } else {
        const puja = new pujaModel({
            title: req.body.title,
            heading: req.body.heading,
            bannerimage: req.file.location
        })
        return puja.save()
            .then(data => {
                // console.log(data);
                req.flash('success', 'data save success');
                res.redirect('/viewpujaOffer')
            })
            .catch(err => {
                req.flash('error', 'data not saved');
                console.log(err);
            })
    }
}

exports.viewpujaOffers =(req,res,next)=>{
    pujaModel.find()
    .then(data => {
        res.render('admin/viewPujahead', {
            title: "title",
            data: data.length>0?data:null
        });
    })
    .catch(err => {
        console.log(err);
    })
}


exports.doEditpujaOffer =(req,res,next)=>{
    const id = req.params.id;
    const editmode = req.query.edit;

    pujaModel.findById(id)
        .then(singleData => {
            res.render('admin/addpujaOffer', {
                title: 'edit puja',
                data: singleData,
                editable: editmode
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.deletepujaOffers=(req,res,next)=>{
    const pujahead_id = req.params.id;
    // console.log(offer_id);
    pujaModel.findByIdAndRemove(pujahead_id)
        .then(() => {
            req.flash('success', 'delete successfull');
            res.redirect('/viewpujaOffer');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.doUpdatepujaOffer=(req,res,next)=>{
    if (req.file === undefined) {
        pujaModel.findById(req.body.id)
            .then(details => {
                pujaModel.findOneAndUpdate({ '_id': req.body.id }, {
                    $set: {
                        title: req.body.title ? req.body.title : details.title,
                        heading: req.body.heading ? req.body.heading : details.heading,
                        bannerimage: details.bannerimage
                    }
                }).then(ress => {
                    res.redirect('/viewpujaOffer');
                }).catch(error => (console.log(error)))
            })
            .catch(error => (console.log(error)))

    } else {
        pujaModel.findById(req.body.id)
            .then(details => {
                pujaModel.findOneAndUpdate({ '_id': req.body.id }, {
                    $set: {
                        title: req.body.title ? req.body.title : details.title,
                        heading: req.body.heading ? req.body.heading : details.heading,
                        bannerimage: req.file.location
                    }
                }).then(ress => {
                    res.redirect('/viewpujaOffer');
                }).catch(error => (console.log(error)))
            })
            .catch(error => (console.log(error)))
    }
}
////////////////////////////////admin//////////////////////////////////////////////
exports.pujaproduct =(req,res,next)=>{
    let id = req.params.id;
    productModel.findById(id, function(err, products) {
        products.specialProduct = !products.specialProduct;
        productModel.findOneAndUpdate({ '_id': id }, { $set: {specialProduct: products.specialProduct} }, { new: true })
            .then(result => {
                if (!result) {
                    req.flash("success","Something went Wrong")
                    res.redirect('/product');

                    // res.status(400).json({
                    //     success: false,
                    //     message: 'Somthing went wrong'
                    // })
                    
                } else {
                    // res.status(200).json({
                    //     success: true,
                    //     message: 'Updated Successfully',
                    //     spclprod: result
                    // })
                    req.flash("success","Special product status changed")
                    res.redirect('/product');
                    
                }
                
            })
            .catch(error => serverError(res, error))

     })
}
////////////////////////////////home///////////////////////////////////////////////////////////////
exports.getpujaproduct=async(req,res,next)=>{
    try {
        let catData = await categorySubModel.find();
       
        if (catData) {
            let products= await productModel.find({specialProduct:true});
            if(products){
         let  commoncount= await  db.collection('sub_categories').aggregate([
                {
                    $lookup: {
                        from: 'products',       // other table name
                        localField: 'subCategory',   // name of users table field
                        foreignField: 'subCategory', // name of userinfo table field
                        as: 'category_info'         // alias for userinfo table
                    }
                },

            ]).toArray() ;
                    
                  if(commoncount){
                      
                            
                   res.render('pujacollection',{
                    title:"puja Product",
                    products:products.length>0?products:null,
                    count:commoncount,
                   
                })
            }else{
                req.flash('success' ,'product not found');
                res.redirect('/notfound');
            }
            }else{
                req.flash('success' ,'product not found');
                res.redirect('/notfound');
            }
                    }else{
                                        req.flash('success' ,'product not found');
                                        res.redirect('/notfound');
                                    }
   
    } catch (error) {
        console.log(error);
    }
      
}
/////////////////////////////////vidio////////////////////////////////////////////////

exports.getvidiopara =(req,res,next)=>{
    res.render('admin/addvidiopara', {
        title: "title",
        editable: false
    })
}
exports.addvidioparas=(req,res,next)=>{
  
        const vidio = new vidioModel({
            title: req.body.title,
            paragraph: req.body.paragraph,
            
        })
         vidio.save()
            .then(data => {
                req.flash('success', 'data save success');
                res.redirect('/viewvidiopara')
            })
            .catch(err => {
                req.flash('success', 'data save failed');
                res.redirect('/viewvidiopara')
                console.log(err);
            })
    
}
exports.viewvidiopara =(req,res,next)=>{
    vidioModel.find()
    .then(data => {
        res.render('admin/viewvidiopara', {
            title: "title",
            data: data
        });
    })
    .catch(err => {
        console.log(err);
    })
}

exports.doEditvidiopara=(req,res,next)=>{
    const id = req.params.id;
    const editmode = req.query.edit;

    vidioModel.findById(id)
        .then(singleData => {
            res.render('admin/addvidiopara', {
                title: 'Update vidiopara',
                data: singleData,
                editable: editmode
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.deletevidiopara=(req,res,next)=>{
    const vid = req.params.id;
    // console.log(offer_id);
    vidioModel.findByIdAndRemove(vid)
        .then(() => {
            req.flash('success', 'delete successfull');
            res.redirect('/viewvidiopara');
        })
        .catch(err => {
            console.log(err);
        }) 
}
exports.updatevidio=(req,res,next)=>{
    vidioModel.findById(req.body.id)
    .then(details => {
        vidioModel.findOneAndUpdate({ '_id': req.body.id }, {
            $set: {
                title: req.body.title ? req.body.title : details.title,
                paragraph: req.body.paragraph ? req.body.paragraph : details.paragraph,
                
            }
        }).then(ress => {
            res.redirect('/viewvidiopara');
        }).catch(error => (console.log(error)))
    })
    .catch(error => (console.log(error)))

}

