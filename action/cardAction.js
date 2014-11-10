var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var timeZone = ' 00:00:00 +08:00';
var cardAction = function(){};

///////////////////////////////page redirect////////////////////////////////
cardAction.goCreate = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('card_create');
};

cardAction.goUse = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('card_use');
};
////////////////////////////get data////////////////////////////////
cardAction.create = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.cardNo = req.body.cardNo;
    params.cardMoney = req.body.cardMoney;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/list";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){

                }else{
                    console.log('------------------------>card create error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器数据异常";
            }
        }else{
            console.log('------------------------>card create network error');
            result.error = 1;
            result.errorMsg = "服务器网络异常";
        }
        res.send(result);
    });
};

cardAction.use = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.cardNo = req.body.cardNo;
    params.cardMoney = req.body.cardMoney;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/list";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){

                }else{
                    console.log('------------------------>card use error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器数据异常";
            }
        }else{
            console.log('------------------------>card use network error');
            result.error = 1;
            result.errorMsg = "服务器网络异常";
        }
        res.send(result);
    });
};
module.exports = cardAction;