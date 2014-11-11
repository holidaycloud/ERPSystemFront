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

cardAction.goActive = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('card_active');
};

cardAction.goRecord = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('card_record');
};
////////////////////////////get data////////////////////////////////
cardAction.create = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.cardNo = req.body.cardNo;
    params.cardMoney = Math.abs(req.body.cardMoney);
    params.token = req.cookies.t;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/card/consume";
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
    params.cardMoney = (-Math.abs(req.body.cardMoney));
    params.token = req.cookies.t;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/card/consume";
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

cardAction.active = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.cardNo = req.body.cardNo;
    params.token = req.cookies.t;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/card/init";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){

                }else{
                    console.log('------------------------>card active error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器数据异常";
            }
        }else{
            console.log('------------------------>card active network error');
            result.error = 1;
            result.errorMsg = "服务器网络异常";
        }
        res.send(result);
    });
};

cardAction.getRecords = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;
//
//    var currentNumber = req.body.page?req.body.page/req.body.pageSize:0;
//    var pageSize = req.body.pageSize?req.body.pageSize:25;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/card/detail?cardNo="+req.body.cardNo;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    result.balance = obj.data.balance;
                    for(var n in obj.data.list){
                        var object = obj.data.list[n];
                        var d = {};
                        d.createDate = new Date(object.createDate).format("yyyy-MM-dd hh:mm:ss");
                        d.member = object.member.loginName;
                        if(object.consume<0){
                            d.type = "消费";
                        }else if(object.consume==0){
                            d.type = "";
                        }else{
                            d.type = "充值";
                        }
                        d.consume = Math.abs(object.consume);
                        result.aaData.push(d);
                    }
                    result.iTotalRecords = obj.data.list.length?obj.data.list.length:0;
                    result.iTotalDisplayRecords = obj.data.list.length?obj.data.list.length:0;
                }else{
                    console.log('------------------------>get card records error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }
        }else{
            console.log('------------------------>get card records network error');
            result.error = 1;
            result.errorMsg = "服务器网络异常";
        }
        res.send(result);
    });

};
module.exports = cardAction;