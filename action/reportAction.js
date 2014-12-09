var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var timeZone = ' 00:00:00 +08:00';
var reportAction = function(){};

///////////////////////////////page redirect////////////////////////////////
reportAction.goRevenue = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('report_revenue');
};

reportAction.goRevenueDetail = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('report_revenuedetail');
};

reportAction.goInventory = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('report_inventory');
};
////////////////////////////get data////////////////////////////////
reportAction.getRevenueList = function(req,res){
    var result = {};
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;
    var start = new Date(req.body.startDate+timeZone).getTime();
    var end = new Date(req.body.endDate+timeZone).getTime();
    var ent = req.cookies.ei;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/report/revenue?start="+start+"&end="+end+"&ent="+ent+"&token="+req.cookies.t;
//    console.log("------------------------------",reqUrl);
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                    for(var i in obj.data){
                        obj.data[i].profitRate = Math.round(obj.data[i].profitRate*100);
                        result.aaData.push(obj.data[i]);
                    }
                    result.iTotalRecords = obj.data.length?obj.data.length:0;
                    result.iTotalDisplayRecords = obj.data.length?obj.data.length:0;
                }else{
                    console.log('------------------------>report revenue list error:',obj.errMsg);
                }
            }
        }else{
            console.log('------------------------>report revenue list network error');
        }
        res.send(result);
    });
};

reportAction.getRevenueDetailList = function(req,res){
    var result = {};
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;
    var start = new Date(req.body.startDate+timeZone).getTime();
    var end = new Date(req.body.endDate+timeZone).getTime();
    var currentNumber = req.body.page?req.body.page/req.body.pageSize:0;
    var pageSize = req.body.pageSize?req.body.pageSize:0;
    var ent = req.cookies.ei;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/report/revenueDetail?page="+currentNumber+"&pageSize="+pageSize+"&start="+start+"&end="+end+"&ent="+ent+"&token="+req.cookies.t;
//    console.log("------------------------------",reqUrl);
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                    for(var i in obj.data.orders){
                        obj.data.orders[i].payWay = config.payWay[obj.data.orders[i].payWay];
                        obj.data.orders[i].createTime = new Date(obj.data.orders[i].createTime).format("yyyy-MM-dd");
                        result.aaData.push(obj.data.orders[i]);
                    }
                    result.iTotalRecords = obj.data.totalSize?obj.data.totalSize:0;
                    result.iTotalDisplayRecords = obj.data.totalSize?obj.data.totalSize:0;
                }else{
                    console.log('------------------------>report revenue detail list error:',obj.errMsg);
                }
            }
        }else{
            console.log('------------------------>report revenue detail list network error');
        }
        res.send(result);
    });
};

reportAction.getInventoryList = function(req,res){
    var result = {};
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;
    var start = new Date(req.body.startDate+timeZone).getTime();
    var end = new Date(req.body.endDate+timeZone).getTime();
    var currentNumber = req.body.page?req.body.page/req.body.pageSize:0;
    var pageSize = req.body.pageSize?req.body.pageSize:0;
    var ent = req.cookies.ei;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/report/inventory?page="+currentNumber+"&pageSize="+pageSize+"&start="+start+"&end="+end+"&ent="+ent+"&token="+req.cookies.t;
//    console.log("------------------------------",reqUrl);
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                    result.iTotalRecords = obj.data.totalSize?obj.data.totalSize:0;
                    result.iTotalDisplayRecords = obj.data.totalSize?obj.data.totalSize:0;
                }else{
                    console.log('------------------------>report inventory list error:',obj.errMsg);
                }
            }
        }else{
            console.log('------------------------>report inventory list network error');
        }
        res.send(result);
    });
};
module.exports = reportAction;