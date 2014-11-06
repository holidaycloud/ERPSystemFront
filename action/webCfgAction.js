var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var webCfgAction = function(){};

///////////////////////////////////////////PAGE REDIRECT//////////////////////////////////////////
webCfgAction.goEntWebCfg = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('ent_webconfig');
};

///////////////////////////////////SAVE CONFIG/////////////////////////////////////
webCfgAction.addEnt = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.name = req.body.entName;
    params.contactName = req.body.cName;
    params.contactEmail = req.body.cEmail;
    params.contactPhone = req.body.cMobile;
    params.proCode = req.body.code;
    params.remark = req.body.rmk;
    params.type = req.body.type;
    params.isEnable = req.body.isEnable;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/ent/register";
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
};

////////////////////////////////////////GET CONFIG////////////////////////////////////////
webCfgAction.entDetail = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";

    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/ent/detail?id="+req.params.id;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                    obj.data.createTime = new Date(obj.data.createTime).format("yyyy-MM-dd");
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
            console.log("----------------------------error",error,response.statusCode,body);
        }
        res.send(result);
    });
}

module.exports = webCfgAction;