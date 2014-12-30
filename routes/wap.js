/**
 * Created by cloudbian on 14-4-21.
 */
var orderAction = require('./../action/wap/orderAction');
var userAction = require('./../action/wap/userAction');
var express = require('express');
var router = express.Router();

router.get('/order/detail/:id',orderAction.detail);

////wap product
//router.get('/goPdts/:id',pdtAction.goPdtList);
//router.get('/goDetail/:id',pdtAction.goPdtDetail);
//router.get('/calendar/:id/:sd/:ed',pdtAction.goPdtCalendar);
////wap order
//router.get('/goFillOrder/:id/:price',orderAction.goFillOrder);
//router.post('/order/add',orderAction.addOrder);
//router.get('/order/goPay/:id',orderAction.goOrderPay);
//router.get('/order/pay/success/:oid',orderAction.goOrderPaySucc);
//router.get('/order/list',orderAction.goOrderList);
////wap user
//router.get('/goUserBind',userAction.goUserBind);
//router.post('/user/bind',userAction.bind);
module.exports = router;