var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var async = require('async');
var orderAction = function(){};
var timeZone = ' 00:00:00 +08:00';
var edTimeZone = ' 23:59:59 +08:00';
orderAction.goOrderInput = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('order_input');
};

orderAction.goOrderList = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('order_list');
};

orderAction.getPdts = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/nameList";
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->save pdt",obj);
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

orderAction.getMyPdts = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/nameList?ent="+req.cookies.ei;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->save pdt",obj);
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

orderAction.getPdtDetail = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var product = req.body.product;
    async.waterfall([
        function(cb){
            //获取当前时间的整点
            var dt= new Date();
            var year=dt.getFullYear();//获取年
            var month=dt.getMonth();//获取月
            var day=dt.getDate();//获取日
            var nowDate = new Date(year,month,day).getTime();

            var startDate = req.body.startDate?new Date(req.body.startDate+timeZone).getTime():"";
            var endDate = req.body.endDate?new Date(req.body.endDate+timeZone).getTime():"";
            var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/price/list?product="+product;
            if(""!==startDate){
                if(nowDate>startDate){
                    reqUrl += "&startDate="+nowDate;
                }else{
                    reqUrl += "&startDate="+startDate;
                }
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
                            throw "返回结果异常！" + obj.errMsg;
                        }else{
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
                            cb(error,obj);
                        }
                    }else{
                       throw "服务器异常";
                    }
                }else{
                    console.log("----------------------------error",error,response.statusCode,body);
                    throw "网络异常";
                }
            });
        },function(r,cb){
            var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/detail?id="+product;
            config.httpReq.option.url = reqUrl;
            httpReq(config.httpReq.option,function(error,response,body){
                if(!error&&response.statusCode == 200){
                    if(body){
                        var obj = JSON.parse(body);
//                console.log("------------------------->pdt detail:",obj);
                        if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                            obj.data.startDate = new Date(obj.data.startDate).format("yyyy-MM-dd");
                            obj.data.endDate = new Date(obj.data.endDate).format("yyyy-MM-dd");
                            obj.data.createTime = new Date(obj.data.createTime).format("yyyy-MM-dd");
                            result.pdt = obj.data;
                            cb(error,obj);
                        }else{
                            throw "返回结果异常！" + obj.errMsg;
                        }
                    }else{
                        throw "服务器异常";
                    }
                }else{
                    console.log("----------------------------error",error,response.statusCode,body);
                    throw "网络异常";
                }
            });
        }],function(err,eMsg){
            if(null!=err){
                console.log(err+","+eMsg);
                result.error = 1;
                result.errorMsg = eMsg;
            }
            res.send(result);
        });
}

orderAction.getOrderList = function(req,res){
    var result = {};
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;

    var currentNumber = req.body.page?req.body.page:0;
    var pageSize = req.body.pageSize?req.body.pageSize:0;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/order/list?page="+currentNumber+"&pageSize="+pageSize+"&ent="+req.cookies.ei;
    if(req.body.pid){
        reqUrl += "&product="+req.body.pid;
    }
    if(req.body.startDate){
        reqUrl += "&startDate="+new Date(req.body.startDate+timeZone).getTime();
    }
    if(req.body.endDate){
        reqUrl += "&endDate="+new Date(req.body.endDate+edTimeZone).getTime();
    }
//    console.log('------------------------------url',reqUrl);
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    for(var n in obj.data.orders){
                        obj.data.orders[n].status = config.orderStatus[obj.data.orders[n].status];
                        obj.data.orders[n].payWay = config.payWay[obj.data.orders[n].payWay];
                        obj.data.orders[n].startDate = new Date(obj.data.orders[n].startDate).format("yyyy-MM-dd");
                        obj.data.orders[n].orderDate = new Date(obj.data.orders[n].orderDate).format("yyyy-MM-dd hh:mm:ss");
                    }
                    if(obj.data.orders&&obj.data.orders.length>0){
                        result.aaData = obj.data.orders;
                    }
                    result.iTotalRecords = obj.data.totalSize?obj.data.totalSize:0;
                    result.iTotalDisplayRecords = obj.data.totalSize?obj.data.totalSize:0;
                }else{
                    console.log('------------------------>get order list error:',obj.errMsg);
                }
            }
        }else{
            console.log('------------------------>get order list network error');
        }
        res.send(result);
    });

};

orderAction.addOrder = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.token = req.cookies.t;
    params.product = req.body.product;
    params.startDate = new Date(req.body.startDate+timeZone).getTime();
    params.quantity = req.body.quantity;
    params.remark = req.body.remark;
    params.price = req.body.price;
    params.liveName  = req.body.liveName ;
    params.contactPhone  = req.body.contactPhone ;
    params.ent = req.body.ent;
//    console.log("---------------------------->add order params:",params);
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/order/save";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->save order",obj);
                if(us.isEmpty(obj)||0!=obj.error){
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }else{
                    result.errorMsg = "订单号："+obj.data.orderID;
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器异常";
            }
        }else{
            result.error = 1;
            result.errorMsg = "网络异常";
            console.log("----------------------------add order error",error,response.statusCode,body);
        }
        res.send(result);
    });
};

orderAction.updateOrder = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.orderID = req.params.id;
//    console.log("---------------------->update order:",params);
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/order/confirm";
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
            console.log("----------------------------update order error",error,response.statusCode,body);
        }
        res.send(result);
    });
};

orderAction.orderDetail = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";

    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/order/detail?id="+req.body.oid;
//    console.log("-----------------------url",reqUrl);
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->order detail:",obj);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                    obj.data.status = config.orderStatus[obj.data.status];
                    obj.data.payWay = config.payWay[obj.data.payWay];
                    obj.data.startDate = new Date(obj.data.startDate).format("yyyy-MM-dd");
                    obj.data.orderDate = new Date(obj.data.orderDate).format("yyyy-MM-dd hh:mm:ss");
                    result.data = obj.data;
                }else{
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
            console.log("----------------------------order detail error",error,response.statusCode,body);
        }
        res.send(result);
    });
}

module.exports = orderAction;