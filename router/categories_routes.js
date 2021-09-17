const express = require('express');

const category_control = require('../controller/categories_controller');

const router = express.Router();
router.get('/newpage/:imageSubCategory' ,category_control.getsubCategory)
router.get('/add_category' ,category_control.getCatData);

router.get('/add_Subcategory' ,category_control.getSubCatData);
router.post('/addCategory' ,category_control.postCatData);

router.post('/addSubCategory' ,category_control.postSubCatData)


router.get('/',category_control.getCategoryDashboard);












  module.exports =router;

