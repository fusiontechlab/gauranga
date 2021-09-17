
const categorySubModel = require('../model/imageSubCategory');
const imageCategoryModel = require('../model/imageCategoryModel');
const productModel = require('../model/productModel');
const { db } = require('../model/imageCategoryModel');



exports.getsubCategory = (req, res, next) => {
    categorySlug = req.params.imageSubCategory;
    //console.log(categorySlug);
    productModel.find({ imageSubCategory: categorySlug })
        .then(result => {
            if (result) {

                res.render('newpage', {
                    title: "title",
                    product: result,
                    data: []
                })

            }
            else {
                console.log("product not Found")
            }
        })




}



exports.getCategoryDashboard = (req, res, next) => {

    imageCategoryModel.find()
        .then(result => {
            if (result) {
                db.collection('image_categories').aggregate([

                    // Join with user_info table
                    {
                        $lookup: {
                            from: 'imagesub_categories',       // other table name
                            localField: 'imageCategory',   // name of users table field
                            foreignField: 'imageCategory', // name of userinfo table field
                            as: 'category_info'         // alias for userinfo table
                        }
                    },

                    {
                        $lookup: {
                            from: 'products',
                            localField: 'imageCategory',
                            foreignField: 'imageCategory',
                            as: 'product_role'
                        }
                    },

                ]).toArray(function (err, resullt) {
                   // console.log(JSON.stringify(resullt));
                    if (err)
                        console.log(err);

                    res.render('index', {
                        title: "dyu",
                        data: resullt,
                        products: []


                    })


                })
            }
            else {
                console.log("category not found");
            }
        })
        .catch(err => {
            console.log(err);
        })






}


exports.getCatData = (req, res, next) => {

    res.render('add_new_category', {
        title: 'category'


    })
}

exports.getSubCatData = (req, res, next) => {
    imageCategoryModel.find()
        .then(alldata => {
            res.render('add_subCategory', {
                title: 'sub category',
                data: alldata
            })


        })
        .catch(err => {
            console.log(err);
        })


}

exports.postSubCatData = (req, res, next) => {



    const imgSubCategory = new categorySubModel(

        {

            title: req.body.title,
            imageCategory: req.body.imageCategory,
            imageSubCategory: req.body.imageSubCategory,



        }

    )
    return imgSubCategory.save()
        .then(result => {

            console.log('SubCategory Saved');
            res.redirect('/index');

        })
        .catch(err => {
            console.log(err);
        });

}


exports.postCatData = (req, res, next) => {
 //console.log('req.body_category ', req.body.category)

    req.checkBody('category', 'Title must have a value.').notEmpty();

    var category = req.body.category;


    var errors = req.validationErrors();
    //console.log(errors);

    if (errors) {
        res.render('admin/category', {
            errors: errors,
            category: category
        });
    } else {
        imageCategoryModel.findOne({ category: category }, function (err, categories) {
            if (categories) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/category', {
                    title: title
                });
            } else {
                var category = new imageCategoryModel({
                    category: category,

                });

                category.save(function (err) {
                    if (err)
                        return console.log(err);

                    req.flash('success', 'Category added!');
                    res.redirect('/admin/index');
                });



            }
        });
    }


    //  const imgCategory = new imageCategoryModel(
    //     {
    //         imageCategory:req.body.imageCategory,

    //     })

    //       return imgCategory.save()
    //      .then(result=>{
    //       console.log('Category Saved');

    //      })
    //   .catch(err=>{
    //       console.log(err);
    //   });

}












