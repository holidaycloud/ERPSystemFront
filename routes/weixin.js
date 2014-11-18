/**
 * Created by cloudbian on 14-4-21.
 */
var weiXinAction = require('./../action/weixin/weiXinAction');
var express = require('express');
var router = express.Router();

//msg notify
router.get('/:ent/notify',weiXinAction.notify);
router.post('/:ent/notify',weiXinAction.msgNotify);
//pay
//    app.get('/pay/:id', UserAuth.WapAuth , ProductPageAction.renderConfirm);
//    app.all('/pay/order',weiXinAction.order);
router.post('/pay/paynotify/:ent',weiXinAction.payNotify);
////customer
//router.post('/customer',weiXinAction.customerNotify);
//router.get('/feedback',weiXinAction.feedback);
//warn
router.post('/:ent/warn',weiXinAction.warn);

module.exports = router;