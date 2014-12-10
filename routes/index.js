var express = require('express');
var router = express.Router();
var userAction = require('./../action/userAction');
var entAction = require('./../action/entAction');
var classAction = require('./../action/classAction');
var pdtAction = require('./../action/pdtAction');
var entMbrAction = require('./../action/entMbrAction');
var webCfgAction = require('./../action/webCfgAction');
var piAction = require('./../action/piAction');
var orderAction = require('./../action/orderAction');
var cusAction = require('./../action/cusAction');
var wxAction = require('./../action/wxAction');
var reportAction = require('./../action/reportAction');
var cardAction = require('./../action/cardAction');
var marketAction = require('./../action/marketAction');
var weixin = require('./../tools/weixin.js');
var config = require('./../tools/config.js');
//router.all(/\/\w+\//, function (request, response, next) {
//    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa');
//    response.charset = 'utf-8';
//    if(0<=request.url.indexOf('uploads')||0<=request.url.indexOf('weixin')||0<=request.url.indexOf('wap')||0<=request.url.indexOf('bcms/accept_sub')){
//        //weixin browser
//        if(0<=request.headers['user-agent'].indexOf('MicroMessenger')){
//            if(request.cookies.wxo){
//                next();
//            }else{
//                if(request.query.ent&&request.query.code){
//                    response.cookie('ei',request.query.ent,{'maxAge':7*24*3600*1000});
//                    var code = request.query.code;
//                    weixin.getAT(function(){
//                        weixin.oAuth(code,config.wx.appID,config.wx.appsecret,function(error,result){
//                            if(error){
//                                var result = {};
//                                result.error = 2;
//                                result.errorMsg = "微信验证失败，确保网络通畅，请重试";
//                                response.send(result);
//                            }else{
//                                //如果微信认证成功，则把openID写到Session中
////                                console.log(typeof(result.openid));
//                                response.cookie('wxo',result.openid,{'maxAge':7*24*3600*1000});
////                                console.log(request.cookies);
//                                next();
//                            }
//                        });
//                    },request.query.ent,config.wx.appID,config.wx.appsecret);
//                }else{
//                    var result = {};
//                    result.error = 2;
//                    result.errorMsg = "验证信息异常，请重新点击菜单进入";
//                    response.send(result);
//                }
//            }
//        }else{
//            next();
//        }
//    }else{
//        //check login
//        if(request.cookies.t&&request.cookies.d&&(parseInt(request.cookies.d)>new Date().getTime())){
//            userAction.checkToken(request,response,function(result){
//                if(0==result){
//                    next();
//                }else{
//                    //        response.render('login');
//                    var result = {};
//                    result.error = 2;
//                    if(request.url.indexOf('goUserInfo')>0){
//                        result.errorMsg = "登录失效，<a href='/'>请重新登录</a>";
//                    }else{
//                        result.errorMsg = "登录失效，<a href='' data-toggle=\"modal\" data-target=\"#mLoginModal\">请重新登录</a>";
//                    }
//
//                    response.send(result);
//                }
//            });
//        }else{
//            //        response.render('login');
//            var result = {};
//            result.error = 2;
//            if(request.url.indexOf('goUserInfo')>0){
//                result.errorMsg = "登录失效，<a href='/'>请重新登录</a>";
//            }else{
//                result.errorMsg = "登录失效，<a href='' data-toggle=\"modal\" data-target=\"#mLoginModal\">请重新登录</a>";
//            }
//            response.send(result);
//        }
//    }
//});


//router.all(/^\/\w+[^\/]$/, function (request, response, next) {
//    console.log('bbbbbbbbbbbbbbbbbbbbbbbbb');
//    response.charset = 'utf-8';
//    if(request.url!=="/"&&0>request.url.indexOf('login') && 0>request.url.indexOf('logout') &&  0>request.url.indexOf('forget') &&  0>request.url.indexOf('goForget')&&0>request.url.indexOf('goWeiXinBind') ){
//        userAction.checkToken(request,response,function(result){
//            if(0==result){
//                next();
//            }else{
//                response.redirect("/");
//            }
//        });
//    }else{
//        next();
//    }
//});

/* GET home page. */
router.get('/', function(request, response) {
    if(request.cookies.d&&(parseInt(request.cookies.d)>new Date().getTime())){
        if(request.cookies.t){
            userAction.checkToken(request,response,function(result){
                if(0==result){
                    response.redirect('/index');
                }else{
                    response.render('login');
                }
            });
        }else{
            response.render('login');
        }
    }else{
        response.render('login');
    }
});

//User
router.all('/goWeiXinBind',userAction.goWeiXinBind);
router.post('/weixinBind',userAction.wxBind);
router.all('/login',userAction.login);
router.all('/logout',userAction.logout);
router.all('/index',userAction.checkToken,userAction.index);
router.all('/goForget',userAction.goForget);
router.all('/user/goUserInfo',userAction.checkToken,userAction.goUserInfo);
router.post('/user/changePwd',userAction.checkToken,userAction.changePwd);
router.all('/bcms/accept_sub',function(req,res){
    res.json({'result':0});
});
router.post('/user/recMsg',userAction.checkToken,userAction.recMsg);
//Ent
router.get('/ent/goEnt',userAction.checkToken,entAction.goEnt);
router.get('/ent/goEntWebCfg',userAction.checkToken,entAction.goEntWebCfg);
router.post('/ent/list',userAction.checkToken,entAction.getEntList);
router.post('/ent/add',userAction.checkToken,entAction.addEnt);
router.post('/ent/update/:id',userAction.checkToken,entAction.updateEnt);
router.get('/ent/detail/:id',userAction.checkToken,entAction.entDetail);

//Ent Web Config
router.get('/ent/webcfg/goEntWebCfg',userAction.checkToken,webCfgAction.goEntWebCfg);
router.get('/ent/webcfg/getWebCfg',userAction.checkToken,webCfgAction.getCfgConfig);
router.post('/ent/webcfg/uploadImg',userAction.checkToken,webCfgAction.uploadImg);
router.post('/ent/webcfg/save',wuserAction.checkToken,ebCfgAction.save);

//Ent Members
router.get('/entMember/goEntMbrs',userAction.checkToken,entMbrAction.goEntMbrs);
router.get('/entMember/getEnts',userAction.checkToken,entMbrAction.getEnts);
router.post('/entMember/list',userAction.checkToken,entMbrAction.getEntMemberList);
router.post('/entMember/add',userAction.checkToken,entMbrAction.addEntMember);
router.post('/entMember/update/:id',userAction.checkToken,entMbrAction.updateEntMember);
router.get('/entMember/detail/:id',userAction.checkToken,entMbrAction.entMbrDetail);

//Product
router.get('/product/goPdt',userAction.checkToken,pdtAction.goPdt);
router.get('/product/goRes',userAction.checkToken,pdtAction.goRes);
router.get('/product/resList',userAction.checkToken,pdtAction.getResList);
router.post('/product/list',userAction.checkToken,pdtAction.getPdtList);
router.post('/product/add',userAction.checkToken,pdtAction.addPdt);
router.post('/product/update/:id',userAction.checkToken,pdtAction.updatePdt);
router.get('/product/detail/:id',userAction.checkToken,pdtAction.pdtDetail);
router.all('/product/ueconfig',userAction.checkToken,pdtAction.ueconfig);
router.post('/product/uploadImg',userAction.checkToken,pdtAction.uploadImg);

///Product Classify
router.get('/product/class/goPdtClass',userAction.checkToken,classAction.goPdtClass);
router.post('/product/class/add',userAction.checkToken,classAction.add);
router.post('/product/class/update/:id',userAction.checkToken,classAction.update);
router.get('/product/class/detail/:id',userAction.checkToken,classAction.detail);
router.post('/product/class/list',userAction.checkToken,classAction.list);

//Price and Inventory
router.get('/pi/goPIinput',userAction.checkToken,piAction.goPriceInventoryInput);
router.get('/pi/goPIList',userAction.checkToken,piAction.goPriceInventoryList);
router.get('/pi/getPdts',userAction.checkToken,piAction.getPdts);
router.post('/pi/list',userAction.checkToken,piAction.getPIList);
router.post('/pi/add',userAction.checkToken,piAction.addPI);
router.post('/pi/update/:id',userAction.checkToken,piAction.updatePI);

//Order
router.get('/order/goOrderInput',userAction.checkToken,orderAction.goOrderInput);
router.get('/order/goOrderList',userAction.checkToken,orderAction.goOrderList);
router.get('/order/getPdts',userAction.checkToken,orderAction.getPdts);
router.get('/order/getMyPdts',userAction.checkToken,orderAction.getMyPdts);
router.post('/order/getPdtDetail',userAction.checkToken,orderAction.getPdtDetail);
router.post('/order/list',userAction.checkToken,orderAction.getOrderList);
router.post('/order/add',userAction.checkToken,orderAction.addOrder);
router.post('/order/update/:id',userAction.checkToken,orderAction.updateOrder);
router.post('/order/detail',userAction.checkToken,orderAction.orderDetail);

//Customer
router.get('/customer/goCus',userAction.checkToken,cusAction.goCus);
router.get('/customer/goCusLevel',userAction.checkToken,cusAction.goCusLevel);
router.get('/customer/goCusScore',userAction.checkToken,cusAction.goCusScore);
router.post('/customer/list',userAction.checkToken,cusAction.getCusList);
router.get('/customer/detail/:id',userAction.checkToken,cusAction.getCusDetail);
router.post('/customer/add',userAction.checkToken,cusAction.addCustomer);
router.post('/customer/update/:id',userAction.checkToken,cusAction.updateCustomer);
router.post('/customer/level/list',userAction.checkToken,cusAction.getCusLvlList);
router.get('/customer/level/detail/:id',userAction.checkToken,cusAction.getCusLvlDetail);
router.post('/customer/level/add',userAction.checkToken,cusAction.addCustomerLevel);
router.post('/customer/level/update/:id',userAction.checkToken,cusAction.updateCustomerLevel);
router.get('/customer/score/detail',userAction.checkToken,cusAction.scoreDetail);
router.post('/customer/score/save',userAction.checkToken,cusAction.saveScoreConfig);
//WeiXin
router.get('/wx/goWeiXinCfg',userAction.checkToken,wxAction.goWeiXinCfg);
router.get('/wx/goEleUpload',userAction.checkToken,wxAction.goElementUpload);
router.get('/wx/goGrpSend',userAction.checkToken,wxAction.goGrpSend);
router.get('/wx/goAutoRes',userAction.checkToken,wxAction.goAutoRes);
router.get('/wx/getWxCfg',userAction.checkToken,wxAction.getWeiXinConfig);
router.get('/wx/getPicMsgPdts',userAction.checkToken,wxAction.getPicMsgPdts);
router.get('/wx/autoRes/:type/detail',userAction.checkToken,wxAction.getPicMsgPdts);
router.get('/wx/autoRes/keys',userAction.checkToken,wxAction.getKeys);
router.get('/wx/eleupload/list',userAction.checkToken,wxAction.autoKeyResUpdate);
router.get('/wx/eleupload/:type/detail/:id',userAction.checkToken,wxAction.autoKeyResUpdate);
router.post('/wx/saveCfg',userAction.checkToken,wxAction.saveConfig);
router.post('/wx/sendGrpMsg',userAction.checkToken,wxAction.sendGrpMsg);
router.post('/wx/autoRes/:type/save',userAction.checkToken,wxAction.autoResSave);
router.post('/wx/autoRes/key/update/:id',userAction.checkToken,wxAction.autoKeyResUpdate);
router.post('/wx/eleupload/:type/add',userAction.checkToken,wxAction.autoKeyResUpdate);
router.post('/wx/eleupload/:type/update/:id',userAction.checkToken,wxAction.autoKeyResUpdate);
router.post('/wx/eleupload/:type/delete/:id',userAction.checkToken,wxAction.autoKeyResUpdate);

//Report
router.get('/report/goRevenue',userAction.checkToken,reportAction.goRevenue);
router.get('/report/goRevenueDetail',userAction.checkToken,reportAction.goRevenueDetail);
router.get('/report/goInventory',userAction.checkToken,reportAction.goInventory);
router.post('/report/getRevenueList',userAction.checkToken,reportAction.getRevenueList);
router.post('/report/getRevenueDetailList',userAction.checkToken,reportAction.getRevenueDetailList);
router.post('/report/getInventoryList',userAction.checkToken,reportAction.getInventoryList);

//Card
router.get('/card/goCreate',userAction.checkToken,cardAction.goCreate);
router.get('/card/goUse',userAction.checkToken,cardAction.goUse);
router.get('/card/goActive',userAction.checkToken,cardAction.goActive);
router.get('/card/goRecord',userAction.checkToken,cardAction.goRecord);
router.get('/card/goList',userAction.checkToken,cardAction.goList);
router.post('/card/create',userAction.checkToken,cardAction.create);
router.post('/card/use',userAction.checkToken,cardAction.use);
router.post('/card/active',userAction.checkToken,cardAction.active);
router.post('/card/getRecords',userAction.checkToken,cardAction.getRecords);
router.post('/card/list',userAction.checkToken,cardAction.list);

//Marketing
router.get('/marketing/goMarketings',userAction.checkToken,marketAction.goMarketings);
router.get('/marketing/goCouponList',userAction.checkToken,marketAction.goCouponList);
router.get('/marketing/goCouponBind',userAction.checkToken,marketAction.goCouponBind);
router.get('/marketing/market/list',userAction.checkToken,marketAction.marketList);
router.get('/marketing/coupon/list',userAction.checkToken,marketAction.couponList);
router.get('/marketing/coupon/nameList',userAction.checkToken,marketAction.marketNameList);
router.get('/marketing/market/detail/:id',userAction.checkToken,marketAction.marketDetail);
router.get('/marketing/coupon/detail/:id',userAction.checkToken,marketAction.couponDetail);
router.post('/marketing/market/add',userAction.checkToken,marketAction.marketAdd);
router.post('/marketing/market/update/:id',userAction.checkToken,marketAction.marketUpdate);
router.post('/marketing/coupon/add',userAction.checkToken,marketAction.couponAdd);
router.post('/marketing/coupon/update/:id',userAction.checkToken,marketAction.couponUpdate);
router.post('/marketing/coupon/bind',userAction.checkToken,marketAction.couponBind);
module.exports = router;
