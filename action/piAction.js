/**
 * Created by cloudbian on 14-9-2.
 */
var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var piAction = function () {
};
var timeZone = ' 00:00:00 +08:00';

piAction.goPriceInventoryInput = function (req, res) {
    res.render('pi_input');
}

piAction.goPriceInventoryList = function (req, res) {
    res.render('pi_list');
}

///////////////////////////////////////////////PAGE REDIRECT////////////////////////////////////////////
piAction.getPdts = function (req, res) {
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host + ":" + config.httpReq.port + "/api/product/nameList?ent=" + req.cookies.ei + "&token=" + req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
                var obj = JSON.parse(body);
//                console.log("------------------------->price input get pdts",obj);
                if (us.isEmpty(obj) || 0 != obj.error) {
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                } else {
                    result.data = obj.data;
                }
            } else {
                result.error = 1;
                result.errorMsg = "服务器异常";
            }
        } else {
            result.error = 1;
            result.errorMsg = "服务器异常";
            console.log("----------------------------error", error, response.statusCode, body);
        }
        res.send(result);
    });
}

piAction.getPIList = function (req, res) {
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var product = req.body.product;
    var startDate = req.body.startDate ? new Date(req.body.startDate + timeZone).getTime() : "";
    var endDate = req.body.endDate ? new Date(req.body.endDate + timeZone).getTime() : "";
    var reqUrl = config.httpReq.host + ":" + config.httpReq.port + "/api/price/list?product=" + product + "&token=" + req.cookies.t;
    if ("" !== startDate) {
        reqUrl += "&startDate=" + startDate;
    }
    if ("" !== endDate) {
        reqUrl += "&endDate=" + endDate;
    }
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
                var obj = JSON.parse(body);
//                console.log("------------------------->price list",obj);
                if (us.isEmpty(obj) || 0 != obj.error) {
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                } else {
                    if (obj.data.length > 0) {
                        if (obj.data[0].date) { //product type 0
                            var events = [];
                            for (var i in obj.data) {
                                var event = {};
                                event.id = obj.data[i]._id;
                                event.start = new Date(obj.data[i].date).format("yyyy-MM-dd");
                                event.title = "";
                                event.description = "";
                                event.textColor = "black";
                                if (obj.data[i].basePrice) {
                                    if (event.title === "") {
                                        event.title += "成本价";
                                    } else {
                                        event.title += "/成本价";
                                    }
                                    if (event.description === "") {
                                        event.description += obj.data[i].basePrice;
                                    } else {
                                        event.description += "/" + obj.data[i].basePrice;
                                    }
                                }
                                if (obj.data[i].tradePrice) {
                                    if (event.title === "") {
                                        event.title += "结算价";
                                    } else {
                                        event.title += "/结算价";
                                    }
                                    if (event.description === "") {
                                        event.description += obj.data[i].tradePrice;
                                    } else {
                                        event.description += "/" + obj.data[i].tradePrice;
                                    }
                                }
                                if (obj.data[i].price) {
                                    if (event.title === "") {
                                        event.title += "卖价";
                                    } else {
                                        event.title += "/卖价";
                                    }
                                    if (event.description === "") {
                                        event.description += obj.data[i].price;
                                    } else {
                                        event.description += "/" + obj.data[i].price;
                                    }
                                }
                                if (obj.data[i].inventory) {
                                    if (event.title === "") {
                                        event.title += "库存";
                                    } else {
                                        event.title += "/库存";
                                    }
                                    if (event.description === "") {
                                        event.description += obj.data[i].inventory;
                                    } else {
                                        event.description += "/" + obj.data[i].inventory;
                                    }
                                }
                                events.push(event);
                            }
                            result.data = events;
                        } else { //product type 3
                            result.data = obj.data[0];
                        }
                    } else {
                        result.data = [];
                    }
                }
            } else {
                result.error = 1;
                result.errorMsg = "服务器异常";
            }
        } else {
            result.error = 1;
            result.errorMsg = "服务器异常";
            console.log("----------------------------error", error, response.statusCode, body);
        }
        res.send(result);
    });
}

piAction.getSpecList = function (req, res) {
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/price/spec/list?id="+req.params.id+"&token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    var specs = [];
                    for(var n in obj.data){
                        specs.push(obj.data[n]);
                    }
                }else{
                    console.log('------------------------>get price spec list error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }
        }else{
            console.log('------------------------>get price spec list network error');
            result.error = 1;
            result.errorMsg = "网络异常";
        }
        res.send(result);
    });
}

//////////////////////////////////////////SAVE OR UPDATE////////////////////////////////////////////
piAction.addPI = function (req, res) {
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.product = req.body.product;
    if (0 == req.body.pType) {
        params.startDate = new Date(req.body.startDate + timeZone).getTime();
        params.endDate = new Date(req.body.endDate + timeZone).getTime();
        params.basePrice = req.body.basePrice;
        params.tradePrice = req.body.tradePrice;
        params.price = req.body.price;
        params.weekendBasePrice = req.body.weekendBasePrice;
        params.weekendTradePrice = req.body.weekendTradePrice;
        params.weekendPrice = req.body.weekendPrice;
        params.inventory = req.body.inventory;
        params.weekendinventory = req.body.weekendinventory;
    } else if (3 == req.body.pType) {
        params.spec = req.body.spec;
    } else {
        result.error = 1;
        result.errorMsg = "无效类型，请选择正确的产品";
    }
    params.token = req.cookies.t;
    if (0 == result.error) {
        var reqUrl = config.httpReq.host + ":" + config.httpReq.port + "/api/price/save";
        config.httpReq.option.url = reqUrl;
        config.httpReq.option.form = params;
        httpReq.post(config.httpReq.option, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body) {
                    var obj = JSON.parse(body);
//                console.log("------------------------->save price",obj);
                    if (us.isEmpty(obj) || 0 != obj.error) {
                        result.error = 1;
                        result.errorMsg = obj.errMsg;
                    } else {
                        result.data = obj.data;
                    }
                } else {
                    result.error = 1;
                    result.errorMsg = "服务器异常";
                }
            } else {
                result.error = 1;
                result.errorMsg = "服务器异常";
                console.log("----------------------------error", error, response.statusCode, body);
            }
            res.send(result);
        });
    } else {
        res.send(result);
    }
}

piAction.updatePI = function (req, res) {
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.id = req.params.id;
    if (req.body.basePrice) {
        params.basePrice = req.body.basePrice;
    }
    if (req.body.tradePrice) {
        params.tradePrice = req.body.tradePrice;
    }
    if (req.body.price) {
        params.price = req.body.price;
    }
    if (req.body.inventory) {
        params.inventory = req.body.inventory;
    }
    params.token = req.cookies.t;
    var reqUrl = config.httpReq.host + ":" + config.httpReq.port + "/api/price/update";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
                var obj = JSON.parse(body);
                if (us.isEmpty(obj) || 0 != obj.error) {
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            } else {
                result.error = 1;
                result.errorMsg = "服务器异常";
            }
        } else {
            result.error = 1;
            result.errorMsg = "网络异常";
            console.log("----------------------------error", error, response.statusCode, body);
        }
        res.send(result);
    });
}
module.exports = piAction;