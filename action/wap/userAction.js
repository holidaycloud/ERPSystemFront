var httpReq = require('request');
var config = require('./../../tools/config.js');
var us = require('underscore');
var async = require('async');
var userAction = function(){};
var timeZone = ' 00:00:00 +08:00';
var edTimeZone = ' 23:59:59 +08:00';

userAction.goUserBind = function(req,res){
    var result = {};
    if(!req.query.url||""===req.query.url){
        console.log("-----------------------weixin goUserBind can't get redirect url");
        res.render("wap/error_500");
    }else{
        result.url = req.query.url;
        res.render("wap/user_bind",{data:result});
    }
}

userAction.bind = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    if(!req.cookies.wxo||!req.cookies.ei){
        console.log("-----------------------weixin user binding info lose");
        result.error = 1;
        result.errorMsg = "微信登录状态失效，请关闭重试";
    }else{
        params.ent = req.cookies.ei;
        params.openId = req.cookies.wxo;
        params.mobile = req.body.userName;
        params.passwd = req.body.password;
        var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/customer/weixinBind";
        config.httpReq.option.url = reqUrl;
        config.httpReq.option.form = params;
        httpReq.post(config.httpReq.option,function(error,response,body){
            if(!error&&response.statusCode == 200){
                if(body){
                    var obj = JSON.parse(body);
                    if(us.isEmpty(obj)||0!=obj.error){
                        console.log(req.cookies.wxo,"------------------------->weixin binding error:",obj.errMsg);
                        result.error = 1;
                        result.errorMsg = obj.errMsg;
                        res.send(result);
                    }else{
                        res.send(result);
                    }
                }else{
                    console.log(req.cookies.wxo,"------------------------->weixin binding can't get data");
                    result.error = 1;
                    result.errorMsg = "服务器异常，请重试";
                    res.send(result);
                }
            }else{
                console.log(req.cookies.wxo,"------------------------->weixin binding network error:",error);
                result.error = 1;
                result.errorMsg = "网络异常，请重试";
                res.send(result);
            }
        });
    }
}
module.exports = userAction;