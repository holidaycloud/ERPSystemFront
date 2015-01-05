var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var agentAction = function(){};

agentAction.goEntAgent = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('ent_agent');
};
///////////////////////////////////////////////////////GET DATA////////////////////////////////////////////////////////
agentAction.ents = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    result.data = [];
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/ent/nameList?token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    for(var n in obj.data){
                        if(obj.data[n]._id === req.cookies.ei){
                            continue;
                        }
                        result.data.push(obj.data[n]);
                    }
                }else{
                    console.log('------------------------>get ent list error:',obj.errMsg);
                }
            }
        }else{
            console.log('------------------------>get ent list network error');
        }
        res.send(result);
    });
};

agentAction.list = function(req,res){
    var result = {};
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/ent/agent/list?ent="+req.cookies.ei+"&token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    for(var n in obj.data){
                        result.aaData.push(obj.data[n]);
                    }
                    result.iTotalRecords = result.aaData.length>0?result.aaData.length:0;
                    result.iTotalDisplayRecords = result.aaData.length>0?result.aaData.length:0;
                }else{
                    console.log('------------------------>get ent agent list error:',obj.errMsg);
                }
            }
        }else{
            console.log('------------------------>get ent agent list network error');
        }
        res.send(result);
    });
};

/////////////////////////////////////////////BIND AND DELETE//////////////////////////////////////////////
agentAction.bind = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.token = req.cookies.t;
    params.ent = req.cookies.ei;
    params.agent =  req.body.ent;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/ent/agent/bind";
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

agentAction.unBind = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.token = req.cookies.t;
    params.ent = req.cookies.ei;
    params.agent = req.params.id;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/ent/agent/unbind";
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

module.exports = agentAction;