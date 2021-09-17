const express = require('express');
const pujacollectionController = require('../controller/puja_controller')

const auth = require('../middleware/auth');
const profileImgUpload = require('../services/ImageUpload')
const router = express.Router();


router.get('/addpujaOffer',pujacollectionController.addpujaOffers);
router.post('/addpujaOffer', profileImgUpload.single('file'), pujacollectionController.postpujaOffer);
router.get('/viewpujaOffer' ,pujacollectionController.viewpujaOffers);
router.get('/deletepujaOffer/:id' ,pujacollectionController.deletepujaOffers);
router.get('/editpujaOffer/:id' ,pujacollectionController.doEditpujaOffer);
router.post('/pujaoffer_update' , profileImgUpload.single('file'), pujacollectionController.doUpdatepujaOffer);



//////////////////////////////puja collection Product/////////////////////////////////////////////////////////////////////////////
router.get('/edit-pujaproduct/:id',pujacollectionController.pujaproduct);//admin

router.get('/pujacollection',pujacollectionController.getpujaproduct);



//////////////////////////////////////vidio admin////////////////////////////////////////////////////////////////////
router.get('/addvidiopara',pujacollectionController.getvidiopara);
router.post('/addvidiopara', pujacollectionController.addvidioparas);
router.get('/viewvidiopara' ,pujacollectionController.viewvidiopara);
router.get('/deletevidiopara/:id' ,pujacollectionController.deletevidiopara);
router.get('/editvidiopara/:id' ,pujacollectionController.doEditvidiopara);
router.post('/updatevidiopara',pujacollectionController.updatevidio)








module.exports = router;