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
var weixin = require('./../tools/weixin.js');
var config = require('./../tools/config.js');
router.all(/\/\w+\//, function (request, response, next) {
    response.charset = 'utf-8';
    if(0<=request.url.indexOf('uploads')||0<=request.url.indexOf('weixin')||0<=request.url.indexOf('wap')||0<=request.url.indexOf('bcms/accept_sub')){
        //weixin browser
        if(0<=request.headers['user-agent'].indexOf('MicroMessenger')){
            if(request.cookies.wxo){
                next();
            }else{
                if(request.query.ent&&request.query.code){
                    response.cookie('ei',request.query.ent,{'maxAge':7*24*3600*1000});
                    var code = request.query.code;
                    weixin.getAT(function(){
                        weixin.oAuth(code,config.wx.appID,config.wx.appsecret,function(error,result){
                            if(error){
                                var result = {};
                                result.error = 2;
                                result.errorMsg = "微信验证失败，确保网络通畅，请重试";
                                response.send(result);
                            }else{
                                //如果微信认证成功，则把openID写到Session中
//                                console.log(typeof(result.openid));
                                response.cookie('wxo',result.openid,{'maxAge':7*24*3600*1000});
//                                console.log(request.cookies);
                                next();
                            }
                        });
                    },request.query.ent,config.wx.appID,config.wx.appsecret);
                }else{
                    var result = {};
                    result.error = 2;
                    result.errorMsg = "验证信息异常，请重新点击菜单进入";
                    response.send(result);
                }
            }
        }else{
            next();
        }
    }else{
        //check login
        if(request.cookies.t&&request.cookies.d&&(parseInt(request.cookies.d)>new Date().getTime())){
            userAction.checkToken(request,response,function(result){
                if(0==result){
                    next();
                }else{
                    //        response.render('login');
                    var result = {};
                    result.error = 2;
                    if(request.url.indexOf('goUserInfo')>0){
                        result.errorMsg = "登录失效，<a href='/'>请重新登录</a>";
                    }else{
                        result.errorMsg = "登录失效，<a href='' data-toggle=\"modal\" data-target=\"#mLoginModal\">请重新登录</a>";
                    }

                    response.send(result);
                }
            });
        }else{
            //        response.render('login');
            var result = {};
            result.error = 2;
            if(request.url.indexOf('goUserInfo')>0){
                result.errorMsg = "登录失效，<a href='/'>请重新登录</a>";
            }else{
                result.errorMsg = "登录失效，<a href='' data-toggle=\"modal\" data-target=\"#mLoginModal\">请重新登录</a>";
            }
            response.send(result);
        }
    }
});


router.all(/^\/\w+[^\/]$/, function (request, response, next) {
    response.charset = 'utf-8';
    if(request.url!=="/"&&0>request.url.indexOf('login') && 0>request.url.indexOf('logout') &&  0>request.url.indexOf('forget') &&  0>request.url.indexOf('goForget')){
        userAction.checkToken(request,response,function(result){
            if(0==result){
                next();
            }else{
                response.redirect("/");
            }
        });
    }else{
        next();
    }
});

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
router.all('/login',userAction.login);
router.all('/logout',userAction.logout);
router.all('/index',userAction.index);
router.all('/goForget',userAction.goForget);
router.all('/user/goUserInfo',userAction.goUserInfo);
router.post('/user/changePwd',userAction.changePwd);
router.all('/bcms/accept_sub',function(req,res){
    res.json({'result':0});
});
router.post('/user/recMsg',userAction.recMsg);
//Ent
router.get('/ent/goEnt',entAction.goEnt);
router.get('/ent/goEntWebCfg',entAction.goEntWebCfg);
router.post('/ent/list',entAction.getEntList);
router.post('/ent/add',entAction.addEnt);
router.post('/ent/update/:id',entAction.updateEnt);
router.get('/ent/detail/:id',entAction.entDetail);

//Ent Web Config
router.get('/ent/webcfg/goEntWebCfg',webCfgAction.goEntWebCfg);
router.get('/ent/webcfg/getWebCfg',webCfgAction.getCfgConfig);
router.post('/ent/webcfg/uploadImg',webCfgAction.uploadImg);
router.post('/ent/webcfg/save',webCfgAction.save);

//Ent Members
router.get('/entMember/goEntMbrs',entMbrAction.goEntMbrs);
router.get('/entMember/getEnts',entMbrAction.getEnts);
router.post('/entMember/list',entMbrAction.getEntMemberList);
router.post('/entMember/add',entMbrAction.addEntMember);
router.post('/entMember/update/:id',entMbrAction.updateEntMember);
router.get('/entMember/detail/:id',entMbrAction.entMbrDetail);

//Product
router.get('/product/goPdt',pdtAction.goPdt);
router.get('/product/goRes',pdtAction.goRes);
router.get('/product/resList',pdtAction.getResList);
router.post('/product/list',pdtAction.getPdtList);
router.post('/product/add',pdtAction.addPdt);
router.post('/product/update/:id',pdtAction.updatePdt);
router.get('/product/detail/:id',pdtAction.pdtDetail);
router.all('/product/ueconfig',pdtAction.ueconfig);
router.post('/product/uploadImg',pdtAction.uploadImg);

///Product Classify
router.get('/product/class/goPdtClass',classAction.goPdtClass);
router.post('/product/class/add',classAction.add);
router.post('/product/class/update/:id',classAction.update);
router.get('/product/class/detail/:id',classAction.detail);
router.post('/product/class/list',classAction.list);

//Price and Inventory
router.get('/pi/goPIinput',piAction.goPriceInventoryInput);
router.get('/pi/goPIList',piAction.goPriceInventoryList);
router.get('/pi/getPdts',piAction.getPdts);
router.post('/pi/list',piAction.getPIList);
router.post('/pi/add',piAction.addPI);
router.post('/pi/update/:id',piAction.updatePI);

//Order
router.get('/order/goOrderInput',orderAction.goOrderInput);
router.get('/order/goOrderList',orderAction.goOrderList);
router.get('/order/getPdts',orderAction.getPdts);
router.get('/order/getMyPdts',orderAction.getMyPdts);
router.post('/order/getPdtDetail',orderAction.getPdtDetail);
router.post('/order/list',orderAction.getOrderList);
router.post('/order/add',orderAction.addOrder);
router.post('/order/update/:id',orderAction.updateOrder);
router.post('/order/detail',orderAction.orderDetail);

//Customer
router.get('/customer/goCus',cusAction.goCus);
router.get('/customer/goCusLevel',cusAction.goCusLevel);
router.get('/customer/goCusScore',cusAction.goCusScore);
router.post('/customer/list',cusAction.getCusList);
router.get('/customer/detail/:id',cusAction.getCusDetail);
router.post('/customer/level/list',cusAction.getCusLvlList);
router.get('/customer/level/detail/:id',cusAction.getCusLvlDetail);
router.post('/customer/add',cusAction.addCustomer);
router.post('/customer/update/:id',cusAction.updateCustomer);
router.post('/customer/level/add',cusAction.addCustomerLevel);
router.post('/customer/level/update/:id',cusAction.updateCustomerLevel);
//WeiXin
router.get('/wx/goWeiXinCfg',wxAction.goWeiXinCfg);
router.get('/wx/goEleUpload',wxAction.goElementUpload);
router.get('/wx/goGrpSend',wxAction.goGrpSend);
router.get('/wx/getWxCfg',wxAction.getWeiXinConfig);
router.post('/wx/saveCfg',wxAction.saveConfig);
router.get('/wx/getPicMsgPdts',wxAction.getPicMsgPdts);
router.post('/wx/sendGrpMsg',wxAction.sendGrpMsg);
router.get('/wx/weixin/init',wxAction.initWeiXin);

//Report
router.get('/report/goRevenue',reportAction.goRevenue);
router.get('/report/goRevenueDetail',reportAction.goRevenueDetail);
router.get('/report/goInventory',reportAction.goInventory);
router.post('/report/getRevenueList',reportAction.getRevenueList);
router.post('/report/getRevenueDetailList',reportAction.getRevenueDetailList);
router.post('/report/getInventoryList',reportAction.getInventoryList);

//Card
router.get('/card/goCreate',cardAction.goCreate);
router.get('/card/goUse',cardAction.goUse);
router.get('/card/goActive',cardAction.goActive);
router.get('/card/goRecord',cardAction.goRecord);
router.get('/card/goList',cardAction.goList);
router.post('/card/create',cardAction.create);
router.post('/card/use',cardAction.use);
router.post('/card/active',cardAction.active);
router.post('/card/getRecords',cardAction.getRecords);
router.post('/card/list',cardAction.list);
module.exports = router;
