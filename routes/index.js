var express = require('express');
var router = express.Router();
var userAction = require('./../action/userAction');
var entAction = require('./../action/entAction');
var classAction = require('./../action/classAction');
var specAction = require('./../action/specAction');
var pdtAction = require('./../action/pdtAction');
var entMbrAction = require('./../action/entMbrAction');
var webCfgAction = require('./../action/webCfgAction');
var entAgentAction = require('./../action/agentAction');
var piAction = require('./../action/piAction');
var orderAction = require('./../action/orderAction');
var cusAction = require('./../action/cusAction');
var wxAction = require('./../action/wxAction');
var reportAction = require('./../action/reportAction');
var cardAction = require('./../action/cardAction');
var marketAction = require('./../action/marketAction');
var newsAction = require('./../action/newsAction');
var noticeAction = require('./../action/noticeAction');
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
//            userAction.ajaxCheckToken(request,response,function(result){
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
//        userAction.ajaxCheckToken(request,response,function(result){
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
router.get('/', userAction.checkToken,function(request, response) {
    response.redirect('/index');
});

//User
router.all('/goWeiXinBind',userAction.goWeiXinBind);
router.post('/weixinBind',userAction.wxBind);
router.all('/login',userAction.login);
router.all('/logout',userAction.logout);
router.all('/index',userAction.checkToken,userAction.index);
router.all('/goForget',userAction.goForget);
router.all('/user/goUserInfo',userAction.ajaxCheckToken,userAction.goUserInfo);
router.post('/user/changePwd',userAction.ajaxCheckToken,userAction.changePwd);
router.all('/bcms/accept_sub',function(req,res){
    res.json({'result':0});
});
router.post('/user/recMsg',userAction.ajaxCheckToken,userAction.recMsg);
//Ent
router.get('/ent/goEnt',userAction.ajaxCheckToken,entAction.goEnt);
router.get('/ent/goEntWebCfg',userAction.ajaxCheckToken,entAction.goEntWebCfg);
router.post('/ent/list',userAction.ajaxCheckToken,entAction.getEntList);
router.post('/ent/add',userAction.ajaxCheckToken,entAction.addEnt);
router.post('/ent/update/:id',userAction.ajaxCheckToken,entAction.updateEnt);
router.get('/ent/detail/:id',userAction.ajaxCheckToken,entAction.entDetail);

//Ent Web Config
router.get('/ent/webcfg/goEntWebCfg',userAction.ajaxCheckToken,webCfgAction.goEntWebCfg);
router.get('/ent/webcfg/getWebCfg',userAction.ajaxCheckToken,webCfgAction.getCfgConfig);
router.post('/ent/webcfg/uploadImg',userAction.ajaxCheckToken,webCfgAction.uploadImg);
router.post('/ent/webcfg/save',userAction.ajaxCheckToken,webCfgAction.save);

//Ent Members
router.get('/entMember/goEntMbrs',userAction.ajaxCheckToken,entMbrAction.goEntMbrs);
router.get('/entMember/getEnts',userAction.ajaxCheckToken,entMbrAction.getEnts);
router.post('/entMember/list',userAction.ajaxCheckToken,entMbrAction.getEntMemberList);
router.post('/entMember/add',userAction.ajaxCheckToken,entMbrAction.addEntMember);
router.post('/entMember/update/:id',userAction.ajaxCheckToken,entMbrAction.updateEntMember);
router.get('/entMember/detail/:id',userAction.ajaxCheckToken,entMbrAction.entMbrDetail);

//Ent Agent
router.get('/ent/agent/goEntAgent',userAction.ajaxCheckToken,entAgentAction.goEntAgent);
router.get('/ent/agent/ents',userAction.ajaxCheckToken,entAgentAction.ents);
router.get('/ent/agent/list',userAction.ajaxCheckToken,entAgentAction.list);
router.post('/ent/agent/bind',userAction.ajaxCheckToken,entAgentAction.bind);
router.post('/ent/agent/unBind/:id',userAction.ajaxCheckToken,entAgentAction.unBind);

//Product
router.get('/product/goPdt',userAction.ajaxCheckToken,pdtAction.goPdt);
router.get('/product/goRes',userAction.ajaxCheckToken,pdtAction.goRes);
router.get('/product/resList',userAction.ajaxCheckToken,pdtAction.getResList);
router.post('/product/list',userAction.ajaxCheckToken,pdtAction.getPdtList);
router.post('/product/add',userAction.ajaxCheckToken,pdtAction.addPdt);
router.post('/product/update/:id',userAction.ajaxCheckToken,pdtAction.updatePdt);
router.get('/product/detail/:id',userAction.ajaxCheckToken,pdtAction.pdtDetail);
router.all('/product/ueconfig',userAction.ajaxCheckToken,pdtAction.ueconfig);
router.post('/product/uploadImg',userAction.ajaxCheckToken,pdtAction.uploadImg);
router.get('/product/qrCode/:id',userAction.ajaxCheckToken,pdtAction.getQrCode);

///Product Classify
router.get('/product/class/goPdtClass',userAction.ajaxCheckToken,classAction.goPdtClass);
router.post('/product/class/add',userAction.ajaxCheckToken,classAction.add);
router.post('/product/class/update/:id',userAction.ajaxCheckToken,classAction.update);
router.get('/product/class/detail/:id',userAction.ajaxCheckToken,classAction.detail);
router.post('/product/class/list',userAction.ajaxCheckToken,classAction.list);

//Product Spec
router.get('/product/spec/goPdtSpec',userAction.ajaxCheckToken,specAction.goPdtSpec);
router.get('/product/spec/list/:id',userAction.ajaxCheckToken,specAction.list);
router.post('/product/spec/save',userAction.ajaxCheckToken,specAction.save);

//Price and Inventory
router.get('/pi/goPIinput',userAction.ajaxCheckToken,piAction.goPriceInventoryInput);
router.get('/pi/goPIList',userAction.ajaxCheckToken,piAction.goPriceInventoryList);
router.get('/pi/getPdts',userAction.ajaxCheckToken,piAction.getPdts);
router.post('/pi/list',userAction.ajaxCheckToken,piAction.getPIList);
router.get('/pi/specList/:id',userAction.ajaxCheckToken,piAction.getSpecList);
router.post('/pi/add',userAction.ajaxCheckToken,piAction.addPI);
router.post('/pi/update/:id',userAction.ajaxCheckToken,piAction.updatePI);

//Order
router.get('/order/goOrderInput',userAction.ajaxCheckToken,orderAction.goOrderInput);
router.get('/order/goOrderList',userAction.ajaxCheckToken,orderAction.goOrderList);
router.get('/order/getPdts',userAction.ajaxCheckToken,orderAction.getPdts);
router.get('/order/getMyPdts',userAction.ajaxCheckToken,orderAction.getMyPdts);
router.post('/order/getPdtDetail',userAction.ajaxCheckToken,orderAction.getPdtDetail);
router.post('/order/list',userAction.ajaxCheckToken,orderAction.getOrderList);
router.post('/order/add',userAction.ajaxCheckToken,orderAction.addOrder);
router.post('/order/confirm/:id',userAction.ajaxCheckToken,orderAction.confirm);
router.post('/order/update/:id',userAction.ajaxCheckToken,orderAction.updateOrder);
router.post('/order/detail',userAction.ajaxCheckToken,orderAction.orderDetail);

//Customer
router.get('/customer/goCus',userAction.ajaxCheckToken,cusAction.goCus);
router.get('/customer/goCusLevel',userAction.ajaxCheckToken,cusAction.goCusLevel);
router.get('/customer/goCusScore',userAction.ajaxCheckToken,cusAction.goCusScore);
router.post('/customer/list',userAction.ajaxCheckToken,cusAction.getCusList);
router.get('/customer/detail/:id',userAction.ajaxCheckToken,cusAction.getCusDetail);
router.post('/customer/add',userAction.ajaxCheckToken,cusAction.addCustomer);
router.post('/customer/update/:id',userAction.ajaxCheckToken,cusAction.updateCustomer);
router.post('/customer/level/list',userAction.ajaxCheckToken,cusAction.getCusLvlList);
router.get('/customer/level/detail/:id',userAction.ajaxCheckToken,cusAction.getCusLvlDetail);
router.post('/customer/level/add',userAction.ajaxCheckToken,cusAction.addCustomerLevel);
router.post('/customer/level/update/:id',userAction.ajaxCheckToken,cusAction.updateCustomerLevel);
router.get('/customer/score/detail',userAction.ajaxCheckToken,cusAction.scoreDetail);
router.post('/customer/score/save',userAction.ajaxCheckToken,cusAction.saveScoreConfig);

//WeiXin
router.get('/wx/goWeiXinCfg',userAction.ajaxCheckToken,wxAction.goWeiXinCfg);
router.get('/wx/goEleUpload',userAction.ajaxCheckToken,wxAction.goElementUpload);
router.get('/wx/goGrpSend',userAction.ajaxCheckToken,wxAction.goGrpSend);
router.get('/wx/goAutoRes',userAction.ajaxCheckToken,wxAction.goAutoRes);
router.get('/wx/getWxCfg',userAction.ajaxCheckToken,wxAction.getWeiXinConfig);
router.get('/wx/getPicMsgPdts',userAction.ajaxCheckToken,wxAction.getPicMsgPdts);
router.get('/wx/autoRes/:type/detail',userAction.ajaxCheckToken,wxAction.getPicMsgPdts);
router.get('/wx/autoRes/keys',userAction.ajaxCheckToken,wxAction.getKeys);
router.get('/wx/eleupload/list',userAction.ajaxCheckToken,wxAction.autoKeyResUpdate);
router.get('/wx/eleupload/:type/detail/:id',userAction.ajaxCheckToken,wxAction.autoKeyResUpdate);
router.post('/wx/saveCfg',userAction.ajaxCheckToken,wxAction.saveConfig);
router.post('/wx/sendGrpMsg',userAction.ajaxCheckToken,wxAction.sendGrpMsg);
router.post('/wx/autoRes/:type/save',userAction.ajaxCheckToken,wxAction.autoResSave);
router.post('/wx/autoRes/key/update/:id',userAction.ajaxCheckToken,wxAction.autoKeyResUpdate);
router.post('/wx/eleupload/:type/add',userAction.ajaxCheckToken,wxAction.autoKeyResUpdate);
router.post('/wx/eleupload/:type/update/:id',userAction.ajaxCheckToken,wxAction.autoKeyResUpdate);
router.post('/wx/eleupload/:type/delete/:id',userAction.ajaxCheckToken,wxAction.autoKeyResUpdate);

//Report
router.get('/report/goRevenue',userAction.ajaxCheckToken,reportAction.goRevenue);
router.get('/report/goRevenueDetail',userAction.ajaxCheckToken,reportAction.goRevenueDetail);
router.get('/report/goInventory',userAction.ajaxCheckToken,reportAction.goInventory);
router.get('/report/goEntOrdersCol',userAction.ajaxCheckToken,reportAction.goEntOrdersCol);
router.post('/report/getRevenueList',userAction.ajaxCheckToken,reportAction.getRevenueList);
router.post('/report/getRevenueDetailList',userAction.ajaxCheckToken,reportAction.getRevenueDetailList);
router.post('/report/getInventoryList',userAction.ajaxCheckToken,reportAction.getInventoryList);
router.post('/report/getEntOrdersData',userAction.ajaxCheckToken,reportAction.getEntOrdersData);
//Card
router.get('/card/goCreate',userAction.ajaxCheckToken,cardAction.goCreate);
router.get('/card/goUse',userAction.ajaxCheckToken,cardAction.goUse);
router.get('/card/goActive',userAction.ajaxCheckToken,cardAction.goActive);
router.get('/card/goRecord',userAction.ajaxCheckToken,cardAction.goRecord);
router.get('/card/goList',userAction.ajaxCheckToken,cardAction.goList);
router.post('/card/create',userAction.ajaxCheckToken,cardAction.create);
router.post('/card/use',userAction.ajaxCheckToken,cardAction.use);
router.post('/card/active',userAction.ajaxCheckToken,cardAction.active);
router.post('/card/getRecords',userAction.ajaxCheckToken,cardAction.getRecords);
router.post('/card/list',userAction.ajaxCheckToken,cardAction.list);

//Marketing
router.get('/marketing/goMarketings',userAction.ajaxCheckToken,marketAction.goMarketings);
router.get('/marketing/goCouponList',userAction.ajaxCheckToken,marketAction.goCouponList);
router.get('/marketing/goCouponBind',userAction.ajaxCheckToken,marketAction.goCouponBind);
router.get('/marketing/market/list',userAction.ajaxCheckToken,marketAction.marketList);
router.get('/marketing/coupon/list',userAction.ajaxCheckToken,marketAction.couponList);
router.get('/marketing/coupon/nameList',userAction.ajaxCheckToken,marketAction.marketNameList);
router.get('/marketing/market/detail/:id',userAction.ajaxCheckToken,marketAction.marketDetail);
router.get('/marketing/coupon/detail/:id',userAction.ajaxCheckToken,marketAction.couponDetail);
router.post('/marketing/market/add',userAction.ajaxCheckToken,marketAction.marketAdd);
router.post('/marketing/market/update/:id',userAction.ajaxCheckToken,marketAction.marketUpdate);
router.post('/marketing/coupon/add',userAction.ajaxCheckToken,marketAction.couponAdd);
router.post('/marketing/coupon/update/:id',userAction.ajaxCheckToken,marketAction.couponUpdate);
router.post('/marketing/coupon/bind',userAction.ajaxCheckToken,marketAction.couponBind);

//News
router.get('/news/goNews',userAction.ajaxCheckToken,newsAction.goNews);
router.get('/news/list',userAction.ajaxCheckToken,newsAction.list);
router.get('/news/detail/:id',userAction.ajaxCheckToken,newsAction.detail);
router.post('/news/add/',userAction.ajaxCheckToken,newsAction.add);
router.post('/news/update/:id',userAction.ajaxCheckToken,newsAction.update);

//Notice
router.get('/notice/goSendNotice',userAction.ajaxCheckToken,noticeAction.goSend);
router.get('/notice/goNotices',userAction.ajaxCheckToken,noticeAction.goNotice);
router.post('/notice/send',userAction.ajaxCheckToken,noticeAction.send);
router.get('/notice/list',userAction.ajaxCheckToken,noticeAction.list);
router.get('/notice/getAllMembers',userAction.ajaxCheckToken,noticeAction.getAllMembers);
router.get('/notice/count',userAction.ajaxCheckToken,noticeAction.count);
router.post('/notice/receiveMsg',noticeAction.recMsg);
module.exports = router;
