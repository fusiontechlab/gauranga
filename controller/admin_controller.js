const userModel = require('../model/user_model');
const categoryModel = require('../model/imageCategoryModel');
const subcategoryModel = require('../model/imageSubCategory');
const vendorModel = require('../model/vendor_model');
const ratingModel = require('../model/rating');
const order = require('../model/order');
const bcrypt = require('bcryptjs');
const user_model = require('../model/user_model');
const passport = require('passport');
const aboutModel = require('../model/about_model');
const contactModel = require('../model/contact_model');


const faqModel = require('../model/faq_model');
const privacyModel = require('../model/privacy_model');
const returnModel = require('../model/return_model');
const conditionModel = require('../model/condition');

const deliverchargeModel = require('../model/delivery_charge');

const contactAddress = require('../model/touchModel');
const path = require('path');
const { db } = require('../model/rating');
const moment = require('moment');
const rating = require('../model/rating');
const banner_model = require('../model/banner_model');
const offerModel = require('../model/offerModel');
const { isNull } = require('util');
const { default: Axios } = require('axios');
const { validationResult } = require('express-validator/check');

exports.offer = async (req, res, next) => {   //home
    const offer = await offerModel.find().limit(3);
    res.render('offer', {
        title: "title",
        offer: offer

    })
}

exports.help = async (req, res, next) => {  //home
    try {
        const faqdata = await faqModel.find()
       
        res.render('faq', {
            title: "help",
            faq:faqdata.length>0?faqdata:null
    
        })
    } catch (error) {
        console.log(error)
    }
    
}

exports.policy =  async(req, res, next) => {   //home
    try {
        const policydata = await privacyModel.find()
       
        res.render('policy', {
            title: "help",
            privacy:policydata.length>0?policydata:null
    
        })
    } catch (error) {
        console.log(error)
    }
    
}

exports.return = async (req, res, next) => {    //home
     try {
        const returndata = await returnModel.find()
       
        res.render('return', {
            title: "help",
            returnpolicy:returndata.length>0?returndata:null
    
        })
    } catch (error) {
        console.log(error)
    }
 
    
}


exports.condition = async(req, res, next) => {  //homepage
    try {
        const conditiondata = await conditionModel.find()
       
        res.render('condition', {
            title: "return policy",
            termandcondition:conditiondata.length>0?conditiondata:null
    
        })
    } catch (error) {
        console.log(error)
    }
}
//admin......Add section......................................
exports.addCondition = (req, res, next) => {  //admin
    res.render('admin/addCondition', {
        title: "term and condition",
        editable:null

    })
}

exports.addFaq = async (req, res, next) => {  //admin
    res.render('admin/addFaq', {
        title: "help",
        editable:null

    })
}

exports.addReturnPolicy =  (req, res, next) => {     //admin
    res.render('admin/addReturnPolicy', {
        title: "Return-Policy",
        editable:null,
        data:null
    })
}
exports.addPrivacyPolicy =  (req, res, next) => {    //admin
    res.render('admin/addPrivacyPolicy', {
        title: "privacy Policy",
        editable:null,
        data:null
        
    })
}

//.........End of add section customer .......................................................

exports.postcondition = (req, res, next) => {  //adminadddata
    const condition = new conditionModel(
        {
            title: req.body.title,
            condition: req.body.condition
        })
    return condition.save()
        .then(result => {

            console.log('Term and condiotion Saved');
            req.flash("success","Term and condiotion Saved")
            res.redirect('/admin/index');
        })
        .catch(err => {
            console.log(err);
        });
}
exports.posthelp = (req, res, next) => {  //admingetpage

    const help = new faqModel(
        {
            title: req.body.title,
            faq: req.body.faq
        })
    return help.save()
        .then(result => {

            console.log('Faq Saved');
            req.flash("success","FAQ Saved")
            res.redirect('/postfaq');
        })
        .catch(err => {
            console.log(err);
        });
}
exports.postreturn =  (req, res, next) => {     //admin add return policy
    const returnpolicy = new returnModel(
        {
            title: req.body.title.trim(),
            return: req.body.return.trim()
        })
    return returnpolicy.save()
        .then(result => {

            console.log('return policy Saved');
            req.flash("success","return policy Saved")
            res.redirect('/admin/index');
        })
        .catch(err => {
            console.log(err);
        });
}
exports.postprivacy =  (req, res, next) => {    //admin add privacy policy
    const privacyu = new privacyModel(
        {
            heading: req.body.heading.trim(),
            privacydata: req.body.privacydata.trim()
        })
    return privacyu.save()
        .then(result => {

            console.log('privacy policy Saved');
            req.flash("success","privacy policy Saved")
            res.redirect('/admin/index');
        })
        .catch(err => {
            console.log(err);
        });
   
}

//................admin customer help view section.............................
exports.viewhelp = async (req, res, next) => {  //admin
    try {
        
        const faq = await faqModel.find();
        res.render('admin/getFaq', {
            title: "help",
            contact:faq
    
        })
    } catch (error) {
        console.log(error);
    }
   
}

exports.viewpolicy =  async(req, res, next) => {   //admin
    try {
        const privacydata = await privacyModel.find();
        // console.log("privacydata",privacydata);
        res.render('admin/getprivacyPolicy', {
            title: "policy",
            contact:privacydata
    
        })  
    } catch (error) {
        console.log(error);
    }
    
}

exports.viewreturn = async (req, res, next) => {    //admin
    try {
        const returnpolicy = await returnModel.find();
        res.render('admin/getreturnPolicy', {
            title: "return Policy",
            contact:returnpolicy
    
        })  
    } catch (error) {
        console.log(error);
    }
    
}

exports.viewcondition = async(req, res, next) => {  //admin
    try {
        const condition = await conditionModel.find();
        res.render('admin/getCondition', {
            title: "Term and condition",
            contact:condition
    
        }) 
    } catch (error) {
        console.log(error)
    }
    
}

//end of view customer........................................................

//start............edit.........admin customerview
exports.editFaq = async(req,res,next)=>{
    const id = req.params.id;
    const editmode = req.query.edit;

    faqModel.findById(id)
        .then(singleData => {
            res.render('admin/addFaq', {
                title: 'Update FAQ',
                data: singleData,
                editable: editmode
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.editcondition =async(req,res,next)=>{
    const id = req.params.id;
    const editmode = req.query.edit;

    conditionModel.findById(id)
        .then(singleData => {
            res.render('admin/addCondition', {
                title: 'Update term and condition',
                data: singleData,
                editable: editmode
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.editprivacy =async(req,res,next)=>{
    const id = req.params.id;
    const editmode = req.query.edit;

    privacyModel.findById(id)
        .then(singleData => {
            res.render('admin/addPrivacyPolicy', {
                title: 'Update Privacy Policy',
                data: singleData,
                editable: editmode
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.editreturn =async(req,res,next)=>{
    const id = req.params.id;
    const editmode = req.query.edit;

    returnModel.findById(id)
        .then(singleData => {
            res.render('admin/addReturnPolicy', {
                title: 'Update Return Policy',
                data: singleData,
                editable: editmode
            })
        })
        .catch(err => {
            console.log(err);
        })
}


//update customer help

exports.updatefaq = async(req,res,next)=>{
    const id = req.body.id;
    //console.log(id);
  faqModel.findById(id)
        .then(details => {
            //console.log(details)
            if (details) {
                details.title = req.body.title?req.body.title:details.title;
                details.faq = req.body.faq?req.body.faq:details.heading;

                return details.save()
                    .then(result => {
                        console.log("update value");
                        req.flash("success","update")
                        res.redirect('/admin/index')
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

            else {
                console.log("update data not found");
            }
        })
        .catch(err => {
            console.log(err);
        })
}
exports.updatecondition = async(req,res,next)=>{
    const id = req.body.id;
    //console.log(id);
  conditionModel.findById(id)
        .then(details => {
            //console.log(details)
            if (details) {
                details.title = req.body.title?req.body.title:details.title;
                details.condition = req.body.condition?req.body.condition:details.condition;

                return details.save()
                    .then(result => {
                        console.log("update value");
                        req.flash("success","update")
                        res.redirect('/admin/index')
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

            else {
                console.log("update data not found");
            }
        })
        .catch(err => {
            console.log(err);
        })
}

exports.updatereturn = async(req,res,next)=>{
    const id = req.body.id;
    //console.log(id);
  returnModel.findById(id)
        .then(details => {
            //console.log(details)
            if (details) {
                details.title = req.body.title?req.body.title:details.title;
                details.return = req.body.return?req.body.return:details.return;

                return details.save()
                    .then(result => {
                        console.log("update value");
                        req.flash("success","update")
                        res.redirect('/admin/index')
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

            else {
                console.log("update data not found");
            }
        })
        .catch(err => {
            console.log(err);
        })
}
exports.updateprivacy = async(req,res,next)=>{
    const id = req.body.id;
    //console.log(id);
  privacyModel.findById(id)
        .then(details => {
            //console.log(details)
            if (details) {
                details.heading = req.body.heading?req.body.heading:details.heading;
                details.privacydata = req.body.privacydata?req.body.privacydata:details.privacydata;

                return details.save()
                    .then(result => {
                        console.log("update value");
                        req.flash("success","update")
                        res.redirect('/admin/index')
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

            else {
                console.log("update data not found");
            }
        })
        .catch(err => {
            console.log(err);
        })
}


//delete customer help

exports.deletefaq = (req, res, next) => {

    const faq_id = req.params.id;
    faqModel.findByIdAndRemove(faq_id)
        .then(() => {
            req.flash("success","data deleted")
            res.redirect('/viewFaq');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.deletecondition = (req, res, next) => {

    const cond_id = req.params.id;
    conditionModel.findByIdAndRemove(cond_id)
        .then(() => {
            req.flash("success","data deleted")
            res.redirect('/viewCondition');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.deleteprivacy = (req, res, next) => {

    const pri_id = req.params.id;
    privacyModel.findByIdAndRemove(pri_id)
        .then(() => {
            req.flash("success","data deleted")
            res.redirect('/viewPolicy');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.deletereturn = (req, res, next) => {

    const ret_id = req.params.id;
  
returnModel.findByIdAndRemove(ret_id)
        .then(() => {
            req.flash("success","data deleted")
            res.redirect('/viewReturn');
        })
        .catch(err => {
            console.log(err);
            req.flash("success" ,"error");
            res.redirect('/viewReturn');
        })
}


























































///vendor...................................................................

exports.vendorEdit = async (req, res, next) => {

    const user_id = req.params.id;
    const editmode = req.query.edit;

    userModel.findById(user_id)
        .then(singleData => {
            // console.log('edit_user_data', singleData)
            res.render('admin/vendor_edit', {
                title: 'Update user',
                data: singleData,
                editable: editmode,
                error: []
            })
        })
        .catch(err => {
            console.log(err);
        })



}





exports.UserUpdateByAdmin = async (req, res, next) => {

    const user_id = req.params.id;
    const editmode = req.query.edit;

    userModel.findById(user_id)
        .then(singleData => {
            console.log('edit_user_data_by_admin ', singleData, user_id)
            res.render('admin/user_edit_by_admin', {
                title: 'Update user',
                data: singleData,
                editable: editmode,
                error: []
            })
        })
        .catch(err => {
            console.log(err);
        })



}







exports.user_updates_By_Admin = (req, res, next) => {
    const id = req.body.id;
    //console.log('vendor_update_data ', req.body, id);
    let fname = req.body.fname.trim();
    let lname = req.body.lname.trim();
    let email = req.body.email.trim();
    let address = req.body.address.trim();
    let city = req.body.city.trim();
    let phone = req.body.phone.trim();
    let user_type = req.body.user_type.trim();

    userModel.findOneAndUpdate({ '_id': id }, {
        $set: {
            fname: fname,
            lname: lname,
            email: email,
            address: address,
            phone: phone,
            city: city,
            user_type: user_type
        }
    }, { new: true })
        .then(result => {
            //console.log("update value of user By admin ", result);
            res.redirect('/userList')
        })
        .catch(err => {
            console.log(err);
        })


}



// ------------------------------------edit password



exports.OwnDataEditByAdmin = async (req, res, next) => {



    console.log(req.session);

    // const user_id = req.params.id;
    // const editmode = req.query.edit;

    // userModel.findById(user_id)
    //     .then(singleData => {
    //         console.log('edit_user_data_by_admin ', singleData, user_id)
    //         res.render('admin/user_edit_by_admin', {
    //             title: 'Update user',
    //             data: singleData,
    //             editable: editmode,
    //             error: []
    //         })
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })



}

exports.vendor_updates = (req, res, next) => {
    const id = req.body.id;
    console.log('vendor_update_data ', req.body, id);
    let fname = req.body.fname.trim();
    let lname = req.body.lname.trim();
    let email = req.body.email.trim();
    let address = req.body.address.trim();
    let city = req.body.city.trim();
    let phone = req.body.phone.trim();
    let pan = req.body.pan.trim();
    let store = req.body.store.trim();
    let user_type = req.body.user_type.trim();

    userModel.findOneAndUpdate({ '_id': id }, {
        $set: {
            fname: fname,
            lname: lname,
            email: email,
            address: address,
            phone: phone,
            city: city,
            store: store,
            pan: pan,
            user_type: user_type
        }
    }, { new: true })
        .then(result => {
            //console.log("update value of vendor ", result);
            res.redirect('/vendorList')
        })
        .catch(err => {
            console.log(err);
        })


}





exports.getContactdetails = (req, res, next) => {
    res.render('admin/addAddress', {
        title: "title",
        editable: false
    })
}

exports.postContactAddress = (req, res, next) => {
    const address = new contactAddress(
        {
            title: req.body.title.trim(),
            heading: req.body.heading.trim(),
            address: req.body.address.trim(),
            phone: req.body.phone.trim(),
            telephone: req.body.telephone.trim(),
            email: req.body.email.trim(),
            fax: req.body.fax.trim(),

        })
    return address.save()
        .then(result => {
            if (result) {
                req.flash('succes', 'added success');
                res.redirect('/admin/index');
            }

        })
        .catch(err => {
            console.log(err);
        });

}

exports.deletecontactAddress =(req,res,next) =>{
    deleteid = req.params.id;
    contactAddress.findByIdAndDelete(deleteid)
    .then(() => {

        console.log("delete");
        req.flash("sucess","data deleted");
        console.log("data deleted");
        res.redirect('back');
    })
    .catch(err => {
        console.log(err);
    })

}

exports.doEditContactAddress = (req, res, next) => {
    const id = req.params.id;
    const editmode = req.query.edit;

    contactAddress.findById(id)
        .then(singleData => {
            res.render('admin/addAddress', {
                title: 'Update Banner',
                data: singleData,
                editable: editmode
            })
        })
        .catch(err => {
            console.log(err);
        })
}
exports.doUpdateContactAddress = (req, res, next) => {
    const id = req.body.id;
    contactAddress.findById(id)
        .then(details => {
            if (details) {
                details.title = req.body.title.trim();
                details.heading = req.body.heading.trim();
                details.address = req.body.address.trim();
                details.heading = req.body.heading.trim();
                details.phone = req.body.phone.trim();
                details.telephone = req.body.telephone.trim();
                details.email = req.body.email.trim();
                details.fax = req.body.fax.trim();

                return details.save()
                    .then(result => {
                        // console.log('contactAddress_update ', result)
                        req.flash('success', 'update value')
                        res.redirect('/viewContactAddress')
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

            else {
                console.log("update data not found");
            }
        })
        .catch(err => {
            console.log(err);
        })
}

exports.viewcontactAddress = (req, res, next) => {
    const viewAddress = contactAddress.find().limit(1)
        // console.log('viewAddress ', viewAddress)
        .then(data => {
            //console.log('viewAddress_data ', data)

            res.render('admin/viewContactAddress', {
                title: "viewContactAddress",
                data: data
            })

        })
        .catch(err => {
            console.log(err);
        })
}


exports.addOffers = (req, res, next) => {
    res.render('admin/addOffer', {
        title: "title",
        editable: false
    })
}

exports.postOffer = (req, res, next) => {
    //console.log('req.body', req.body)

    if (req.file === undefined) {

        const offer = new offerModel({
            title: req.body.title,
            heading: req.body.heading,
            image: null
        })
        return offer.save()
            .then(data => {
                console.log(data);
                req.flash('success', 'data save success');
                res.redirect('/viewOffer')
            })
            .catch(err => {
                req.flash('error', 'data not saved');
                console.log(err);
            })
    } else {
        const offer = new offerModel({
            title: req.body.title,
            heading: req.body.heading,
            image: req.file.location
        })
        return offer.save()
            .then(data => {
                // console.log(data);
                req.flash('success', 'data save success');
                res.redirect('/viewOffer')
            })
            .catch(err => {
                req.flash('error', 'data not saved');
                console.log(err);
            })
    }

}


exports.viewOffers = (req, res, next) => {
    offerModel.find()
        .then(data => {
            res.render('admin/viewOffer', {
                title: "title",
                data: data
            });
        })
        .catch(err => {
            console.log(err);
        })

}

exports.deleteOffers = (req, res, next) => {
    const offer_id = req.params.id;
    // console.log(offer_id);
    offerModel.findByIdAndRemove(offer_id)
        .then(() => {
            req.flash('success', 'suucees banner');
            res.redirect('/viewOffer');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.doEditOffer = (req, res, next) => {
    const id = req.params.id;
    const editmode = req.query.edit;

    offerModel.findById(id)
        .then(singleData => {
            res.render('admin/addOffer', {
                title: 'edit Offer',
                data: singleData,
                editable: editmode
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.doUpdateOffer = (req, res, next) => {


    if (req.file === undefined) {
        offerModel.findById(req.body.id)
            .then(details => {
                offerModel.findOneAndUpdate({ '_id': req.body.id }, {
                    $set: {
                        title: req.body.title ? req.body.title : details.title,
                        heading: req.body.heading ? req.body.heading : details.heading,
                        image: details.image
                    }
                }).then(ress => {
                    res.redirect('/viewOffer');
                }).catch(error => (console.log(error)))
            })
            .catch(error => (console.log(error)))

    } else {
        offerModel.findById(req.body.id)
            .then(details => {
                offerModel.findOneAndUpdate({ '_id': req.body.id }, {
                    $set: {
                        title: req.body.title ? req.body.title : details.title,
                        heading: req.body.heading ? req.body.heading : details.heading,
                        image: req.file.location
                    }
                }).then(ress => {
                    res.redirect('/viewOffer');
                }).catch(error => (console.log(error)))
            })
            .catch(error => (console.log(error)))
    }




}

exports.viewBanner = (req, res, next) => {
    const banner = banner_model.find()
        .then(banner => {
            res.render('admin/viewBanner', {
                title: "viewBanner",
                banner: banner,
                editable: false
            })
        })
        .catch(err => {
            console.log(err);
        })

}
exports.editBanners = (req, res, next) => {
    const id = req.params.id;
    const editmode = req.query.edit;

    banner_model.findById(id)
        .then(singleData => {
            res.render('admin/addBanner', {
                title: 'Update Banner',
                data: singleData,
                editable: editmode
            })
        })
        .catch(err => {
            console.log(err);
        })

}

exports.bannerUpdates = (req, res, next) => {
    // console.log('reqbannn', req.body, req.body.id)
    const id = req.body.id
    if (req.file === undefined) {
        banner_model.findById(id)
            .then(details => {
                //console.log('details', details)
                banner_model.findOneAndUpdate({ '_id': id }, {
                    $set: {
                        title: req.body.title ? req.body.title : details.title,
                        file: details.file,
                    }
                })
                    .then(rest => {
                        //console.log(rest)
                        //res.redirect('/admin/index');
                        res.redirect('/viewBanner')
                    })
                    .catch(error => (console.log(error)))
            })
            .catch(error => (console.log(error)))
    } else {

        banner_model.findById(id)
            .then(details => {
                banner_model.findOneAndUpdate({ '_id': id }, {
                    $set: {
                        title: req.body.title ? req.body.title : details.title,
                        file: req.file.location,
                    }
                })
                    .then(rest => {
                        //console.log(rest)
                        //res.redirect('/admin/index');
                        res.redirect('/viewBanner')
                    })
                    .catch(error => (console.log(error)))
            })
            .catch(error => (console.log(error)))


    }




}

exports.deleteBanners = (req, res, next) => {
    const banner_id = req.params.id;
    //console.log(banner_id);
    banner_model.findByIdAndRemove(banner_id)
        .then(() => {
            req.flash('success', 'suucees banner');
            res.redirect('/viewBanner');
        })
        .catch(err => {
            console.log(err);
        })
}
exports.about = async (req, res, next) => {
    res.render('admin/about', {
        title: "title",
        data: [],
        editable: false
    })
}

exports.addAbout = (req, res, next) => {
    const about = new aboutModel(
        {
            title: req.body.title.trim(),
            about: req.body.about.trim()



        })
    return about.save()
        .then(result => {

            console.log('about Saved');
            res.redirect('/viewAbout');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.editAbout = (req, res, next) => {
    const slug = req.params.id;
    const editmode = req.query.edit;

    aboutModel.findById(slug)
        .then(singleData => {
            res.render('admin/about', {
                title: 'Update category',
                data: singleData,
                editable: editmode,
                error: []
            })
        })
        .catch(err => {
            console.log(err);
        })

}

exports.about_updates = (req, res, next) => {
    const id = req.body.id;
    //console.log(id);
    aboutModel.findById(id)
        .then(details => {
            //console.log(details)
            if (details) {
                details.title = req.body.title.trim();
                details.about = req.body.about.trim();

                return details.save()
                    .then(result => {
                        console.log("update value");
                        res.redirect('/viewAbout')
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

            else {
                console.log("update data not found");
            }
        })
        .catch(err => {
            console.log(err);
        })
}



exports.deleteAbout = (req, res, next) => {
    const category_id = req.params.id;
    aboutModel.findByIdAndRemove(category_id)
        .then(() => {
            res.redirect('/viewAbout');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.viewAbout = async (req, res, next) => {
    const viewAbout = await aboutModel.find()
    res.render('admin/viewAbout', {
        title: "about",
        about: viewAbout
    })
}

exports.viewContact = async (req, res, next) => {
    const viewContact = await contactModel.find().populate('user')
    res.render('admin/viewContact', {
        title: "about",
        contact: viewContact
    })
}
exports.editContact = async (req, res, next) => {
    const contact_id = req.params.id;


    contactModel.findById(contact_id)
        .then(singleData => {
            res.render('admin/editContact', {
                title: 'edit Rating',
                data: singleData,
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.contact = (req, res, next) => {
    const userId = req.user;
    const contact = new contactModel(
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message,
            user: userId



        })
    return contact.save()
        .then(result => {

            console.log('contact Saved');
            res.redirect('/contact_us');
        })
        .catch(err => {
            console.log(err);
        });
}


exports.contactUpdates = (req, res, next) => {
    const slug = req.params.id
    console.log('contact ', req.body);

    contactModel.findById(slug)
        .then(details => {
            if (details) {
                details.name = req.body.name;
                details.email = req.body.email;
                details.phone = req.body.value;
                details.message = req.body.message;

                return details.save()
                    .then(result => {

                        console.log("update value");
                        res.redirect('/viewContact')
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

            else {
                console.log("update data not found");
            }
        })
}
exports.deleteContact = async (req, res, next) => {
    const slug = req.params.id;
    // console.log(slug)
    contactModel.findByIdAndDelete(slug)
        .then(() => {

            console.log("delete");

            console.log("data deleted");
            res.redirect('back');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.adminRating = async (req, res, next) => {
    const rating = await ratingModel.find().populate('userId');
    // console.log(rating);
    db.collection('ratings').countDocuments()
        .then(countrating => {
            // console.log(countrating);
            res.render('admin/rating', {
                title: "rating",
                count: countrating,
                rating: rating
            })
        })
        .catch(err => {
            console.log(err);
        })

}

exports.editRating = (req, res, next) => {
    const rating_id = req.params.id;


    ratingModel.findById(rating_id)
        .then(singleData => {
            res.render('admin/editRating', {
                title: 'edit Rating',
                data: singleData,


            })
        })
        .catch(err => {
            console.log(err);
        })
}


exports.updateRating = (req, res, next) => {

    const slug = req.params.id
    //console.log('slug', slug);

    ratingModel.findById(slug)
        .then(details => {
            if (details) {
                details.quality = req.body.quality.trim();
                details.price = req.body.price.trim();
                details.value = req.body.value.trim();
                details.name = req.body.name.trim();
                details.summary = req.body.summary.trim();
                details.review = req.body.review.trim();
                return details.save()
                    .then(result => {
                        //console.log(result);
                        console.log("update value");
                        res.redirect('/rating')
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

            else {
                console.log("update data not found");
            }
        })

}

exports.deleteRating = (req, res, next) => {
    const slug = req.params.id;
    //console.log(slug)
    ratingModel.findByIdAndDelete(slug)
        .then(() => {

            console.log("delete");

            console.log("data deleted");
            res.redirect('back');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.vendorRegistration = (req, res, next) => {
// -------------new added
  
                                res.render('vendor/register', {
        
                                    title: "register_page",
                                    
                                })
                            }




exports.vendorRegistrationcomplete = (req, res, next) => {
    // -------------new added
        var otps = Math.floor((Math.random() * 10000) + 1);
        console.log("otp",otps);
        Axios.get(`http://sms.fusiontechlab.com/app/smsapi/index.php?key=5ffc399da3287&type=text&contacts=${req.body.phone}&senderid=GPAULS &peid=1001445840000025498&templateid=1007162235720937382&msg=For registration with www.gourangapaul.com OTP is ${otps} valid for 30 minutes`).then(result=>{
                                    console.log(result.data);
                                })
                                console.log("phone",req.body.phone)
                                const validdata = validationResult(req);
                                // console.log(validdata);
                             
                                if (!validdata.isEmpty()) {
                                    const jsonData = JSON.stringify(validdata.array());
                                    req.flash('success' ,'invalid phone number')      
                                     res.redirect('vendor');
        
                                }else{
                                    res.render('vendor/completeregister', {
            
                                        title: "register_page",
                                        editable: false,
                                        error:null,
                                        data:[],
                                        message: req.flash('message'),
                                        phone:req.body.phone?req.body.phone:null,
                                        otp:otps?otps:null,
                                        user:req.user?req.user:null,
                                        cart:req.session.cart?req.session.cart:null
                                    })
                                }
    
    // -------------new added
    
     
    }



exports.vendoraccountPage = (req, res, next) => {
    res.render('vendor/account_page', {
        title: "accountPage",
        error: [],
        data:[]
    })
}


exports.getVendor = (req, res, next) => {
    res.render('vendor/index', {
        title: "vendor"
    })
}

exports.profile = (req, res, next) => {
    userModel.find({ user_type: "vendor" })
        .then(result => {
            if (result) {
                res.render('vendor/vendorProfile', {
                    title: "vendorList",
                    users: result
                })
            } else {
                console.log("vendor not available");
            }

        })
}

exports.getVendorList = (req, res, next) => {
    userModel.find({ user_type: "vendor" })
        .then(result => {
            if (result) {
                res.render('admin/vendorlist', {
                    title: "vendorList",
                    vendor: result
                })
            } else {
                console.log("vendor not available");
            }

        })

}

exports.postRegistration = (req, res, next) => {

    
    userModel.findOne({ email: req.body.email })
        .then(emailifexist => {
            // console.log(emailifexist);
            if (emailifexist) {
                req.flash('error', 'email already exists');

                res.redirect('/vendor');
            }else {

                const docLocationArray = [];
                let fileArray = req.files,
                fileLocation;

              
        if(req.files){
               
            
            for (let i = 0; i < fileArray.length; i++) {
                fileLocation = fileArray[i].location;
              
                console.log('filenm', fileLocation);
                docLocationArray.push(fileLocation)
            }
        }
                bcrypt.hash(req.body.password, 12)
                .then(hassPass => {
                    const User = new userModel({
                        fname: req.body.fname,

                        email: req.body.email,
                        store: req.body.store,
                        password: hassPass,
                        lname: req.body.lname,
                        phone: req.body.phone,
                        pan: req.body.pan,
                        confirmp: req.body.confirmp,


                        user_type: "vendor",
                        document:docLocationArray,

                    })

                var hiddenOtp = req.body.otp;
                var bodyOtp = req.body.otpv;
               //  console.log('hidden otp',hiddenOtp);
               //  console.log('body otp',bodyOtp);
                if(hiddenOtp != bodyOtp){
                   req.flash('error', 'invelid otp and register failed');
                   
                       res.redirect('/vendor')
                    console.log("invalid otp");
                }else{
                   return User.save()
                   .then(() => {
                       req.flash('success', 'Register Success!!');
                       res.redirect('/vendor')
                   })
                   .catch(err => {
                       console.log(err);
                   })
                }       
                    }).catch(err => {
                        console.log(err);
                    })



            }
        }).catch(err => {
            console.log(err);
        })
}

exports.postloginvendor = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {

        if (err) {
            // console.log('error, info.message');
            return next(err)
        }
        if (!user) {
            console.log('error', info.message)
            return res.redirect('/login');
        }
        if (user.user_type === "vendor") {
            req.logIn(user, (err) => {
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                return res.redirect('/vendor/index');
            })
        } else {
            req.flash('success', "are u vendor??");
            res.redirect('back')
            console.log("are u vendor??");
        }

    })(req, res, next)
}


exports.getDashboard = (req, res, next) => {

    userInfo = req.user;
    if (req.user.user_type === "user") {
        userModel.find()
            .then(userData => {
                if (userData) {
                    res.render('orderlist', {
                        title: "title",
                        data: userData,
                        user_type: userInfo.user_type
                    })
                }
                else {
                    console.log("user not found");
                }
            })
            .catch(err => {
                console.log(err);
            })

    }
    else {
        userModel.find()
            .then(allData => {
                res.render('admin/index', {
                    title: "title",
                    data: allData,
                    user_type: "admin"
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
}

exports.getAdmin = (req, res, next) => {
    res.render('admin/index', {
        title: "admin"
    })
}
exports.adminLogin = (req, res, next) => {
    res.render('admin/login', {
        title: "admin"
    })
}

exports.getUser = async (req, res, next) => {

    const user = await userModel.find()
    res.render('admin/userList', {
        title: "userList",
        users: user,
        searchData: []
    })
}

exports.getCategory = (req, res, next) => {
    res.render('admin/category', {
        title: "Category",
        data: [],
        editable: false
    })
}

exports.getSubCategory = (req, res, next) => {
    categoryModel.find()
        .then(categoryData => {
            if (categoryData) {
                res.render('admin/subCategory', {
                    title: "Sub Category",
                    data: categoryData,
                    patas: [],
                    datas: [],
                    editable: false

                })
            }
            else {
                console.log("category not Found");
            }
        })
        .catch(err => {
            console.log(err);
        })

}



exports.viewsCategory = async (req, res, next) => {
    const category = await categoryModel.find()
    res.render('admin/viewCategory', {
        title: "category",
        category: category
    })
}

exports.viewsSubCategory = async (req, res, next) => {
    const subcategory = await subcategoryModel.find()

    res.render('admin/viewSubCategory', {
        title: "category",
        subcategory: subcategory
    })
}

exports.postCategory = (req, res) => {
    //console.log('category_data ', req.body)

    let categorymodel = new categoryModel(
        {
            category: req.body.category.trim(),



        })
    return categorymodel.save()
        .then(result => {

            //console.log('Category Saved', result);
            res.redirect('/viewCategory');
        })
        .catch(err => {
            console.log(err);
        });

}

exports.postSubCategory = async (req, res, next) => {

    //console.log('subcategory_data ', req.body)


    const cat_id = await categoryModel.find({ category: req.body.category })
    //console.log(cat_id);
    const imgSubCategory = new subcategoryModel(
        {
            category: req.body.category,
            subCategory: req.body.subCategory.trim(),
            // categoryid:cat_id



        })
    return imgSubCategory.save()
        .then(result => {
            if (result) {
                console.log("SuccessFully added");
                res.redirect('/viewSubCategory');
            }

        })
        .catch(err => {
            console.log(err);
        });

}


exports.postAdmin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log('error, info.message');
            return next(err)
        }
        if (!user) {
            console.log('error', info.message)
            req.flash('success' ,"wrong user")
            return res.redirect('/admin');
        }
        if (user.user_type === "admin") {
            req.logIn(user, (err) => {
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                return res.redirect('/admin/index');
            })
        } else {
            res.redirect('/admin');
            console.log("are u admin??");
        }
    })(req, res, next)
}

exports.getRegister = (req, res, next) => {
    res.render('register', {
        title: "title",
        editable: false

    })
}

exports.getLogin = (req, res, next) => {
    res.render('login', {
        title: "login",


    })
}


exports.doEdit = (req, res, next) => {
    const user_id = req.params.id;
    const editmode = req.query.edit;

    userModel.findById(user_id)
        .then(singleData => {
            console.log('edit_user_data', singleData)
            res.render('register_page', {
                title: 'Update user',
                data: singleData,
                editable: editmode,
                error: [],
                otp:[]
            })
        })
        .catch(err => {
            console.log(err);
        })


}


exports.subCategoryEdit = (req, res, next) => {
    const subcategory_id = req.params.id;
    const editmode = req.query.edit;
    categoryModel.find()
        .then(result => {
            if (result) {
                subcategoryModel.findById(subcategory_id)
                    .then(singleData => {
                        res.render('admin/subCategory', {
                            title: 'Update Sub category',
                            datas: singleData,
                            patas: result,
                            editable: editmode,
                            category:singleData.category,
                            error: [],
                            data: []

                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            } else {
                console.log("not found")
            }
        })
        .catch(err => {
            console.log(err);
        })


}


exports.categoryEdit = (req, res, next) => {
    const category_id = req.params.id;
    const editmode = req.query.edit;

    categoryModel.findById(category_id)
        .then(singleData => {
            res.render('admin/category', {
                title: 'Update category',
                data: singleData,
                editable: editmode,
                error: []
            })
        })
        .catch(err => {
            console.log(err);
        })

}


exports.catUpdate = (req, res, next) => {
    const cat_id = req.body.id;
    categoryModel.findById(cat_id)
        .then(details => {
            if (details) {
                details.category = req.body.category;

                return details.save()
                    .then(result => {
                        console.log("update value");
                        res.redirect('viewCategory')
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

            else {
                console.log("update data not found");
            }
        })
        .catch(err => {
            console.log(err);
        })
}

exports.subCatUpdate = (req, res, next) => {
    const subcat_id = req.body.id;
    subcategoryModel.findById(subcat_id)
        .then(details => {
            if (details) {
                details.category = req.body.category;
                details.subCategory = req.body.subCategory;
                return details.save()
                    .then(result => {
                        //console.log("update value");
                        res.redirect('/viewSubCategory')
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

            else {
                console.log("update data not found");
            }
        })
        .catch(err => {
            console.log(err);
        })
}

exports.deleteSubCategory = (req, res, next) => {

    const id = req.params.id;
    //console.log(id);
    subcategoryModel.findByIdAndRemove(id)
        .then(() => {
            res.redirect('/viewSubCategory');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.doUpdate = (req, res, next) => {
    // console.log('admin_user_update ', req.body)
    const user_id = req.body.id
    //console.log(user_id)
    let fname = req.body.fname.trim();
    let lname = req.body.lname.trim();
    let email = req.body.email.trim();
    let address = req.body.address.trim();
    let city = req.body.city.trim();
    let phone = req.body.phone.trim();

    //let { fname, lname, email, address, city, phone } = req.body
    userModel.findOneAndUpdate({ _id: user_id }, {
        $set: {
            fname: fname,
            lname: lname || null,
            email: email,
            address: address,
            city: city,
            phone: phone,
        }
    }, { new: true })
        .then(result => {
            console.log('update value');
req.flash('success','update success');
            res.redirect('/account_page');
            //res.redirect('back');

        })
        .catch(error => {
            console.log(error);
        })


}





exports.doUpdateUser = (req, res, next) => {
    // console.log('admin_user_update ', req.body)
    const user_id = req.body.id
    //console.log(user_id)
    let fname = req.body.fname.trim();
    let lname = req.body.lname.trim();
    let email = req.body.email.trim();
    let address = req.body.address.trim();
    let city = req.body.city.trim();
    let phone = req.body.phone.trim();

    //let { fname, lname, email, address, city, phone } = req.body
    userModel.findOneAndUpdate({ _id: user_id }, {
        $set: {
            fname: fname,
            lname: lname || null,
            email: email,
            address: address,
            city: city,
            phone: phone,
        }
    }, { new: true })
        .then(result => {
            console.log('update value');
req.flash('success' ,"update success");
            res.redirect('/back');
            //res.redirect('back');

        })
        .catch(error => {
            console.log(error);
        })


}



exports.doDelete = (req, res, next) => {

    const user_id = req.params.id;
    userModel.findByIdAndRemove(user_id)
        .then(() => {
            res.redirect('/userList');
        })
        .catch(err => {
            console.log(err);
        })
}


exports.deleteCategory = (req, res, next) => {
    const category_id = req.params.id;
    categoryModel.findByIdAndRemove(category_id)
        .then(() => {
            res.redirect('/viewCategory');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getOrder = (req, res, next) => {

    order.find({ status: { $ne: 'completed' } }, null, {
        sort: { 'createdAt': -1 }
    }).populate('customerId', '-password').exec((err, orders) => {
        // console.log(orders)
        return res.render('admin/orderlist', {
            order: orders,
            moment: moment
        })

    })
}



exports.getVendorOrder = async (req, res, next) => {
    Vendor = req.session.passport.user;
    // orderData = await order.find({ "items": {price: "567"  } })
    const orderdata = await order.find(
        { items: { $elemMatch: { VendorId :Vendor } } }
     )
    //    console.log(orderdata);
    return res.render('vendor/orders_list', {
        order: orderdata,
        moment: moment
    })
}
// db.Order.find( { "instock": { $elemMatch: { qty: 5, warehouse: "A" } } } )





exports.doUpdatestatus = async (req, res, next) => {
    const statuss = req.params.id;
    changeStatus = 0;
    const count = await userModel.find()
    const data = await userModel.findByIdAndUpdate(statuss, { $set: { status: changeStatus } });
    res.redirect('back');
    // res.render("admin/userlist", {
    //     title: "update status",
    //     users: count


    // });


}

exports.doUpdatestatuss = async (req, res, next) => {
    const statuss = req.params.id;
    changeStatus = 1;
    const count = await userModel.find()
    const data = await userModel.findByIdAndUpdate(statuss, { $set: { status: changeStatus } });
    res.redirect('back');

    // res.render("admin/userlist", {
    //     title: "update status",
    //     users: count


    // });
}

exports.banner = (req, res, next) => {
    res.render("admin/addBanner", {
        title: "update status",
        editable: false,
        data: []


    });
}

//delivery charge
exports.getshipcharge=(req,res,next)=>{
    res.render('admin/ship_charge',{
        title:"charge",
        editable:null,
        data:[]
    })
}

exports.createcharge =(req,res,next)=>{
    let { pin_code  ,charge} = req.body
    // console.log(req.body.city);
    //let validate = vendorValidator({ vendor_name })
//    console.log('pincode',req.body)
    if (!pin_code) {
        return res.status(400).json({
            message: 'pincode is undefined'
        })
    }
    
    let pincode = new deliverchargeModel({
       
        pin_code:pin_code,
        charge:charge,
       
    })

    pincode.save()
        .then(pin => {
            // console.log('trans',books)
            console.log('charge Saved');
            req.flash("success","charge Saved")
            res.redirect('/adminshipcharge');
        })
        .catch(error => serverError(res, error))
}

exports.viewcharge=async(req,res,next)=>{
    try {
        
        const chargedata = await deliverchargeModel.find();
        res.render('admin/view_charge', {
            title: "charge",
            charge:chargedata
    
        })
    } catch (error) {
        console.log(error);
    }
}
exports.editCharge=async(req,res,next)=>{
    const charge_id = req.params.id;
    const editmode = req.query.edit;

    deliverchargeModel.findById(charge_id)
        .then(singleData => {
            res.render('admin/ship_charge', {
                title: 'edit charge',
                data: singleData,
                editable: editmode,
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.chargeUpdates=(req,res,next)=>{
    const charge_id = req.body.id
    //console.log(user_id)
    let pin_code = req.body.pin_code;
    let charge = req.body.charge;
    
    deliverchargeModel.findOneAndUpdate({ _id: charge_id }, {
        $set: {
            pin_code: pin_code || null,
            charge: charge || null,
           
        }
    }, { new: true })
        .then(result => {
            console.log('update value');
req.flash('success' ,"update success");
            res.redirect('/viewCharge');
            //res.redirect('back');

        })
        .catch(error => {
            console.log(error);
        })
 
}

exports.deleteCharge=(req,res,next)=>{
    const slug = req.params.id;
    // console.log(slug)
    deliverchargeModel.findByIdAndDelete(slug)
        .then(() => {

            console.log("delete");

            console.log("data deleted");
            res.redirect('/viewCharge');
        })
        .catch(err => {
            console.log(err);
        })
}



exports.getlogUser = (req, res, next) => {

    res.render('loggeduser', {
        title: "title",
        loginuser: req.user.user_type =="admin"?req.user:[]
    })
}


