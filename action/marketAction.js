var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var timeZone = ' 00:00:00 +08:00';
var marketAction = function(){};

///////////////////////////////page redirect////////////////////////////////
marketAction.goMarketings = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('market_list');
};

marketAction.goCouponList = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('coupon_list');
};

marketAction.goCouponBind = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('coupon_bind');
};
////////////////////////////get data////////////////////////////////

marketAction.marketList = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;

    var currentNumber = req.body.page?req.body.page/req.body.pageSize:0;
    var pageSize = req.body.pageSize?req.body.pageSize:25;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/marketing/list?page="+currentNumber+"&pageSize="+pageSize+"&ent=" + req.cookies.ei+"&token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    for(var n in obj.data.markets){
                        var object = obj.data.markets[n];
                        object.startDate = new Date(object.startDate).format("yyyy-MM-dd");
                        object.endDate = new Date(object.endDate).format("yyyy-MM-dd");
                        result.aaData.push(object);
                    }
                    result.iTotalRecords = obj.data.totalSize?obj.data.totalSize:0;
                    result.iTotalDisplayRecords = obj.data.totalSize?obj.data.totalSize:0;
                }else{
                    console.log('------------------------>get market list error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }
        }else{
            console.log('------------------------>get market list network error');
            result.error = 1;
            result.errorMsg = "服务器网络异常";
        }
        res.send(result);
    });

};

marketAction.couponList = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;

    var currentNumber = req.body.page?req.body.page/req.body.pageSize:0;
    var pageSize = req.body.pageSize?req.body.pageSize:25;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/coupon/list?page="+currentNumber+"&pageSize="+pageSize+"&ent=" + req.cookies.ei+"&token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    for(var n in obj.data.coupons){
                        var object = obj.data.coupons[n];
                        object.type = config.couponType[object.type];
                        object.startDate = new Date(object.startDate).format("yyyy-MM-dd");
                        object.endDate = new Date(object.endDate).format("yyyy-MM-dd");
                        result.aaData.push(object);
                    }
                    result.iTotalRecords = obj.data.totalSize?obj.data.totalSize:0;
                    result.iTotalDisplayRecords = obj.data.totalSize?obj.data.totalSize:0;
                }else{
                    console.log('------------------------>get market list error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }
        }else{
            console.log('------------------------>get market list network error');
            result.error = 1;
            result.errorMsg = "服务器网络异常";
        }
        res.send(result);
    });

};

marketAction.marketDetail = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";

    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/marketing/detail?id="+req.params.id+"&token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->pdt detail:",obj);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                    obj.data.startDate = new Date(obj.data.startDate).format("yyyy-MM-dd");
                    obj.data.endDate = new Date(obj.data.endDate).format("yyyy-MM-dd");
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
            console.log("----------------------------error",error);
        }
        res.send(result);
    });
};

marketAction.marketNameList = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/marketing/namelist?ent=" + req.cookies.ei+"&token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    result.data = obj.data;
                }else{
                    console.log('------------------------>get market name list error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }
        }else{
            console.log('------------------------>get market name list network error');
            result.error = 1;
            result.errorMsg = "服务器网络异常";
        }
        res.send(result);
    });

};

marketAction.couponDetail = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";

    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/coupon/detail?id="+req.params.id+"&token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->pdt detail:",obj);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                    obj.data.startDate = new Date(obj.data.startDate).format("yyyy-MM-dd");
                    obj.data.endDate = new Date(obj.data.endDate).format("yyyy-MM-dd");
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
            console.log("----------------------------error",error);
        }
        res.send(result);
    });
};
//////////////////////////////////////data save or update//////////////////////////////////////////
marketAction.marketAdd = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.name = req.body.name;
    params.content = req.body.content;
    params.channel = req.body.channel;
    params.startDate = new Date(req.body.startDate+timeZone).getTime();
    params.endDate = new Date(req.body.endDate+timeZone).getTime();
    params.ent = req.cookies.ei;
    params.token = req.cookies.t;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/marketing/save";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){

                }else{
                    console.log('------------------------>market add error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器数据异常";
            }
        }else{
            console.log('------------------------>market add network error');
            result.error = 1;
            result.errorMsg = "服务器网络异常";
        }
        res.send(result);
    });
};

marketAction.marketUpdate = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.id = req.params.id;
    params.name = req.body.name;
    params.content = req.body.content;
    params.channel = req.body.channel;
    params.startDate = new Date(req.body.startDate+timeZone).getTime();
    params.endDate = new Date(req.body.endDate+timeZone).getTime();
    params.ent = req.cookies.ei;
    params.token = req.cookies.t;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/marketing/update";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){

                }else{
                    console.log('------------------------>market update error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器数据异常";
            }
        }else{
            console.log('------------------------>market update network error');
            result.error = 1;
            result.errorMsg = "服务器网络异常";
        }
        res.send(result);
    });
};
marketAction.couponAdd = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.marketing = req.body.marketing;
    params.name = req.body.name;
    params.qty = req.body.qty;
    params.minValue = req.body.minValue;
    params.type = req.body.type;
    if(params.type==4){
        params.value = 0;
    }else{
        params.value = req.body.value;
    }
    params.product = req.body.product;
    params.startDate = new Date(req.body.startDate+timeZone).getTime();
    params.endDate = new Date(req.body.endDate+timeZone).getTime();
    params.ent = req.cookies.ei;
    params.token = req.cookies.t;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/coupon/generate";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){

                }else{
                    console.log('------------------------>coupon add error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器数据异常";
            }
        }else{
            console.log('------------------------>coupon add network error');
            result.error = 1;
            result.errorMsg = "服务器网络异常";
        }
        res.send(result);
    });
};

marketAction.couponUpdate = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.id = req.params.id;
    params.marketing = req.body.marketing;
    params.name = req.body.name;
    params.qty = req.body.qty;
    params.minValue = req.body.minValue;
    params.type = req.body.type;
    if(params.type==4){
        params.value = 0;
    }else{
        params.value = req.body.value;
    }
    params.product = req.body.product;
    params.startDate = new Date(req.body.startDate+timeZone).getTime();
    params.endDate = new Date(req.body.endDate+timeZone).getTime();
    params.ent = req.cookies.ei;
    params.token = req.cookies.t;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/coupon/update";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){

                }else{
                    console.log('------------------------>coupon update error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器数据异常";
            }
        }else{
            console.log('------------------------>coupon update network error');
            result.error = 1;
            result.errorMsg = "服务器网络异常";
        }
        res.send(result);
    });
};

marketAction.couponBind = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.marketing = req.body.marketing;
    params.customer = req.body.customer;
    params.ent = req.cookies.ei;
    params.token = req.cookies.t;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/coupon/give";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){

                }else{
                    console.log('------------------------>coupon bind error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器数据异常";
            }
        }else{
            console.log('------------------------>coupon bind network error');
            result.error = 1;
            result.errorMsg = "服务器网络异常";
        }
        res.send(result);
    });
};


module.exports = marketAction;