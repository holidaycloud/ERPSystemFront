var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var async = require('async');
var newsAction = function(){};
var timeZone = ' 00:00:00 +08:00';

//////////////////////////////////////////////page redirect/////////////////////////////////////////////////////
newsAction.goNews = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('news');
};
////////////////////////////////////////////////////product get data///////////////////////////////////////////////////
newsAction.list = function(req,res){
    var result = {};
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;

    var currentNumber = req.body.page?req.body.page/req.body.pageSize:0;
    var pageSize = req.body.pageSize?req.body.pageSize:25;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/news/list?page="+currentNumber+"&pageSize="+pageSize+"&ent="+req.cookies.ei+"&token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    for(var n in obj.data.news){
                        obj.data.news[n].createDate = new Date(obj.data.news[n].createDate).format("yyyy-MM-dd");
                        result.aaData.push(obj.data.news[n]);
                    }
                    result.iTotalRecords = obj.data.totalSize?obj.data.totalSize:0;
                    result.iTotalDisplayRecords = obj.data.totalSize?obj.data.totalSize:0;
                }else{
                    console.log('------------------------>get news list error:',obj.errMsg);
                }
            }
        }else{
            console.log('------------------------>get news list network error');
        }
        res.send(result);
    });

};


newsAction.detail = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/news/detail?id="+req.params.id+"&token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                console.log("------------------------->nes detail:",obj);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    obj.data.startDate = new Date(obj.data.startDate).format("yyyy-MM-dd");
//                    obj.data.endDate = new Date(obj.data.endDate).format("yyyy-MM-dd");
//                    obj.data.createTime = new Date(obj.data.createTime).format("yyyy-MM-dd");
//                    obj.data.productType = obj.data.productType?obj.data.productType:0;
//                    obj.data.isHot = obj.data.isHot?obj.data.isHot:false;
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
}
//////////////////////////////////////////////product add and update///////////////////////////////////////////////////////
newsAction.add = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.title = req.body.title;
    params.content = req.body.content;
    params.content = params.content.replace(/<img/g,"<img class=\"img-responsive\"");
    params.ent = req.cookies.ei;
    params.token = req.cookies.t;
//    console.log("---------------------------->pdt params:",params);
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/news/save";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->save class",obj);
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
            console.log("----------------------------error",error);
        }
        res.send(result);
    });
};

newsAction.update = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.id = req.params.id;
    params.title = req.body.title;
    params.content = req.body.content;
    params.content = params.content.replace(/<img/g,"<img class=\"img-responsive\"");
    params.token = req.cookies.t;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/news/update";
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
            console.log("----------------------------error",error);
        }
       res.send(result);
    });
};
module.exports = newsAction;