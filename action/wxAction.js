var httpReq = require('request');
var config = require('./../tools/config.js');
var weixin = require('./../tools/weixin.js');
var us = require('underscore');
var wxAction = function(){};

wxAction.goWeiXinCfg = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render("weixin_config");
}

wxAction.goElementUpload = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render("weixin_eleupload");
}

wxAction.goGrpSend = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render("weixin_groupsend");
}

wxAction.initWeiXin = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var appID = req.query.appID;//"wx190214d55eec21df"
    var appsecret = req.query.appsecret;//"74ed5cffe3f1bf576d0d3fc9cab2d370",
    var paySignKey = req.query.paySignKey;//"",
    var partnerId = req.query.partnerId;//"1218852001",
    var partnerKey = req.query.partnerKey;//"fa909f07b280503e68c0231b358aa9b9",
    var wxToken = req.query.token;//"HC";
    var ent = req.cookies.ei?req.cookies.ei:"54124f09e07fa9341ba90cf3";
    var token = "";
    weixin.getAT(function(){
        //先删除原有菜单，然后重新生成菜单
        weixin.delMenu(ent,function(errMsg){
            if(""!==errMsg){
                result.error = 1;
                result.errorMsg = errMsg;
            }else{
                weixin.createMenu(ent,token,function(errMsg){
                    if(""!==errMsg){
                        result.error = 1;
                        result.errorMsg = errMsg;
                    }else{
                        res.send(result);
                    }
                });
            }
        });

    },ent,config.wx.appID,config.wx.appsecret);
//    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/login"；
//    config.httpReq.option.url = reqUrl;
//    httpReq(config.httpReq.option,function(error,response,body){
//        if(!error&&response.statusCode == 200){
////            console.log("result------------------------>",body);
//            if(body){
//                var obj = JSON.parse(body);
//                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//
//                }else{
//                    result.error = 1;
//                    result.errorMsg = obj.errMsg;
//                }
//            }else{
//                console.log("error------------------------>",body);
//                result.error = 1;
//                result.errorMsg = "网络异常，请重试";
//            }
//
//        }else{
//            console.log("error result------------------------>",error);
//            result.error = 1;
//            result.errorMsg = "网络异常，请重试";
//        }
    result.notifyUrl = "http://cloud.bingdian.com/weixin/54124f09e07fa9341ba90cf3/notify";
    result.custNotifyUrl = "http://cloud.bingdian.com/weixin/54124f09e07fa9341ba90cf3/customer";
        res.send(result);
//    });
};
module.exports = wxAction;