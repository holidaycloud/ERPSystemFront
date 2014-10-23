/**
 * Created by cloudbian on 14-9-2.
 */
var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var piAction = function(){};
var timeZone = ' 00:00:00 +08:00';

piAction.goPriceInventoryInput = function(req,res){
    res.render('pi_input');
}

piAction.goPriceInventoryList = function(req,res){
    res.render('pi_list');
}

piAction.getPdts = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/nameList?ent="+req.cookies.ei;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                console.log("------------------------->price input get pdts",obj);
                if(us.isEmpty(obj)||0!=obj.error){
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }else{
                    result.data = obj.data;
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器异常";
            }
        }else{
            result.error = 1;
            result.errorMsg = "服务器异常";
            console.log("----------------------------error",error,response.statusCode,body);
        }
        res.send(result);
    });
}

piAction.addPI = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.product = req.body.product;
    if(0==req.body.pType){
        params.startDate = new Date(req.body.startDate+timeZone).getTime();
        params.endDate = new Date(req.body.endDate+timeZone).getTime();
        params.price = req.body.price;
        params.weekendPrice = req.body.weekendPrice;
        params.inventory = req.body.inventory;
        params.weekendinventory = req.body.weekendinventory;
    }else if(3==req.body.pType){
        params.price = req.body.price;
        params.inventory = req.body.inventory;
    }else{
        result.error = 1;
        result.errorMsg = "无效类型，请选择正确的产品";
    }
    if(0 == result.error){
        var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/price/save";
        config.httpReq.option.url = reqUrl;
        config.httpReq.option.form = params;
        httpReq.post(config.httpReq.option,function(error,response,body){
            if(!error&&response.statusCode == 200){
                if(body){
                    var obj = JSON.parse(body);
//                console.log("------------------------->save price",obj);
                    if(us.isEmpty(obj)||0!=obj.error){
                        result.error = 1;
                        result.errorMsg = obj.errMsg;
                    }else{
                        result.data = obj.data;
                    }
                }else{
                    result.error = 1;
                    result.errorMsg = "服务器异常";
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器异常";
                console.log("----------------------------error",error,response.statusCode,body);
            }
            res.send(result);
        });
    }else{
        res.send(result);
    }
}

piAction.getPIList = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var product = req.body.product;
    var startDate = req.body.startDate?new Date(req.body.startDate+timeZone).getTime():"";
    var endDate = req.body.endDate?new Date(req.body.endDate+timeZone).getTime():"";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/price/list?product="+product;
    if(""!==startDate){
        reqUrl += "&startDate="+startDate;
    }
    if(""!==endDate){
        reqUrl += "&endDate="+endDate;
    }
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->price list",obj);
                if(us.isEmpty(obj)||0!=obj.error){
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }else{
                    if(obj.data[0].date){ //product type 0
                        var events = [];
                        for(var i in obj.data){
                            var event = {};
                            event.id = obj.data[i]._id;
                            event.start = new Date(obj.data[i].date).format("yyyy-MM-dd");
                            event.title = "";
                            event.description = "";
                            event.textColor = "black";
                            if(obj.data[i].price){
                                if(event.title === ""){
                                    event.title += "价格";
                                }else{
                                    event.title += "/价格";
                                }
                                if(event.description === ""){
                                    event.description += obj.data[i].price;
                                }else{
                                    event.description += "/" +obj.data[i].price;
                                }
                            }
                            if(obj.data[i].inventory){
                                if(event.title === ""){
                                    event.title += "库存";
                                }else{
                                    event.title += "/库存";
                                }
                                if(event.description === ""){
                                    event.description += obj.data[i].inventory;
                                }else{
                                    event.description += "/" +obj.data[i].inventory;
                                }
                            }
                            events.push(event);
                        }
                        result.data = events;
                    }else{ //product type 3
                        result.data = obj.data[0];
                    }
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器异常";
            }
        }else{
            result.error = 1;
            result.errorMsg = "服务器异常";
            console.log("----------------------------error",error,response.statusCode,body);
        }
        res.send(result);
    });
}

piAction.updatePI = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.id = req.params.id;
    if(req.body.price){
        params.price = req.body.price;
    }
    if(req.body.inventory){
        params.inventory = req.body.inventory;
    }

    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/price/update";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(us.isEmpty(obj)||0!=obj.error){
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器异常";
            }
        }else{
            result.error = 1;
            result.errorMsg = "网络异常";
            console.log("----------------------------error",error,response.statusCode,body);
        }
        res.send(result);
    });
}
module.exports = piAction;