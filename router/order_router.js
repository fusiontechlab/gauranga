const express = require('express');
const orderController = require('../controller/order_controller');
const auth = require('../middleware/auth');
const router = express.Router();
router.get('/testmail' ,orderController.testmail);
router.get('/checkout' ,orderController.checkout);
router.post('/order' , orderController.postOrder);
router.get('/paymenttoorder' , orderController.paymentToOrder);
router.post('/ordersuccess' , orderController.paymentSuccess);
router.get('/orderList' ,orderController.orderList);
router.get('/deleteOrder/:id',orderController.deleteOrders);
router.get('/deletevendorOrder/:id',orderController.deletevendorOrders);

router.get('/editStatus/:id' ,orderController.editStatus);//admin
router.post('/update-status' ,orderController.updateStatus);//admin

router.get('/deliveredstatus/:id',orderController.userdeliveredstatus);//admin


router.get('/filter/:id' ,orderController.getFilter);

router.get('/filterData/:subCategory' ,orderController.filterProduct);
router.get('/filterdatas' ,orderController.filterProducts);

router.get('/log/:val',orderController.logged);

router.get('/shipcharger',orderController.getdelivercharge);//appfiltercharge
module.exports = router;