var httpReq = require('request');
var async = require('async');
var config = require('./../../tools/config.js');
var us = require('underscore');
var pdtAction = function(){};

pdtAction.goPdtList = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/staitcList?ent="+req.params.id;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->wap product list:",obj);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                    delete obj.data.createTime;
                    delete obj.data.startDate;
                    delete obj.data.endDate;
                    delete obj.data.ent;
                    delete obj.data.weekend;
                    delete obj.data.createTime;
                    delete obj.data.gps;
                    result.data = obj.data;
//                    console.log(obj.data);
                    res.render('wap/product_list',result);
                }else{
                    console.log("------------------------->wap product list error:",obj.errMsg);
                    res.render('wap/error_500');
                }
            }else{
                console.log("------------------------->wap product list error:服务器异常,没有返回数据");
                res.render('wap/error_500');
            }
        }else{
            console.log("----------------------------wap product list error:网络异常",error);
            res.render('wap/error_500');
        }
    });
};

pdtAction.goPdtDetail = function(req,res){
    var result = {};
    async.waterfall([
        function(cb){
            var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/detail?id="+req.params.id;
            config.httpReq.option.url = reqUrl;
            httpReq(config.httpReq.option,function(error,response,body){
                if(!error&&response.statusCode == 200){
                    if(body){
                        var obj = JSON.parse(body);
//                console.log("------------------------->pdt detail:",obj.data);
                        if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                            delete obj.data.createTime;
                            delete obj.data.startDate;
                            delete obj.data.endDate;
                            delete obj.data.ent;
                            delete obj.data.weekend;
                            delete obj.data.createTime;
                            delete obj.data.gps;
                            result.data = obj.data;
                            cb(error,obj);
                        }else{
                            console.log("------------------------->wap product detail error:",obj.errMsg);
                            cb("error",obj.errMsg);
                        }
                    }else{
                        console.log("------------------------->wap product detail error:服务器异常,没有返回数据");
                        cb("error","服务器异常,没有返回数据");
                    }
                }else{
                    console.log("----------------------------wap product detail error:网络异常",error);
                    cb("error","网络异常");
                }
            });
        },function(r,cb){
                var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/price/first?product="+req.params.id;
                config.httpReq.option.url = reqUrl;
                console.log(reqUrl);
                httpReq(config.httpReq.option,function(error,response,body){
                    if(!error&&response.statusCode == 200){
                        if(body){
                            var obj = JSON.parse(body);
                            console.log('------------------------------------------------get price first',body);
                            if(!us.isEmpty(obj)&&0==obj.error){
                                if(null!=obj.data){
                                    result.data.sprice = obj.data.price;
                                    result.data.inventory = obj.data.inventory;
                                    result.data.selectDate = new Date(obj.data.date).format("yyyy-MM-dd");
                                    result.data.priceId = obj.data._id;
                                }else{
                                    result.data.sprice = -1;
                                    result.data.inventory = 0;
                                    result.data.selectDate = "";
                                    result.data.priceId = "542e106b877850dd6b80b3a0";
                                }
                                cb(error,obj);
                            }else{
                                console.log("------------------------->wap product detail price error:",obj.errMsg);
                                cb("error",obj.errMsg);
                            }
                        }else{
                            console.log("------------------------->wap product detail price error:服务器异常,没有返回数据");
                            cb("error","服务器异常,没有返回数据");
                        }
                    }else{
                        console.log("----------------------------wap product detail price error:网络异常",error);
                        cb("error","网络异常");
                    }
                });
//                result.data.price = "5424dd9c280448ac543dac83";
//                cb(null,result);
        }
    ],function(err,eMsg){
        if(null!=err){
            console.log("------------------------->wap product goPdtDetail error:",eMsg);
            res.render('wap/error_500');
        }else{
            res.render('wap/product_detail',result);
        }
    });
}

pdtAction.goPdtCalendar = function(req,res){
    //获取当前时间的整点
    var dt= new Date();
    var year=dt.getFullYear();//获取年
    var month=dt.getMonth();//获取月
    var day=dt.getDate();//获取日
    var nowDate = new Date(year,month,day).getTime();
    var startDate = Number(req.params.sd);
    if(nowDate>startDate){
        startDate = nowDate;
    }
    var endDate = Number(req.params.ed);
    if(startDate>endDate){
        endDate = startDate;
    }
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/price/list?product="+req.params.id+"&startDate="+startDate+"&endDate="+endDate;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->price list",obj);
                if(us.isEmpty(obj)||0!=obj.error){
                    console.log('-----------------------------wap cal get prices error',obj.errMsg);
                    res.render('wap/error_500');
                }else{
                    var result = {};
                    var prices = [];
                    if(obj.data.length>0){
                        var priceHash = us.indexBy(obj.data,'date');
                        try{
                            for(var today = startDate;today <= endDate;today += 86400000 ){
                                var p = {};
                                if( priceHash[today]){
                                    p.price = priceHash[today].price;
                                    p.invent = priceHash[today].inventory;
                                    p._id = priceHash[today]._id;
                                }else{
                                    p.price = -1;
                                    p.invent = -1;
                                    p._id = "";
                                }
                                prices.push(p);
                            }
                        }catch(e){
                            console.log('catch error!',e);
                        }
                    }
                    result.prices = prices;
                    result.time = startDate;
                    result.id = req.params.id;
                    res.render('wap/product_calendar',{product:result});
                }
            }else{
                console.log('-----------------------------wap cal get prices error,no response');
                res.render('wap/error_500');
            }
        }else{
            console.log('-----------------------------wap cal get prices error,network error');
           res.render('wap/error_500');
        }
    });
}

module.exports = pdtAction;