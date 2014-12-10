var httpReq = require('request');
var config = require('./../tools/config.js');
var upyun = require('./../tools/upyun.js');
var us = require('underscore');
var webCfgAction = function(){};

///////////////////////////////////////////PAGE REDIRECT//////////////////////////////////////////
webCfgAction.goEntWebCfg = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('ent_webconfig');
};

//////////////////////////////////GET CONFIG////////////////////////////////////
webCfgAction.getCfgConfig = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";

    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/domain/detail?ent="+req.cookies.ei+"&token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                result.data = obj.data;
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

///////////////////////////////////SAVE CONFIG/////////////////////////////////////
webCfgAction.save = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.ent = req.cookies.ei;
    params.token = req.cookies.t;
    params.title = req.body.title;
    params.domain =req.body.domain;
    params.address =req.body.address;
    params.tel =req.body.tel;
    params.email = req.body.email;
    params.lat = req.body.lat;
    params.lon = req.body.lon;
    params.logo = req.body.logo;
    params.qrCode = req.body.qrCode;
    params.isEnable = req.body.isEnable;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/domain/save";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
//    console.log('-----------------------------params:',params);
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

////////////////////////////////////////UPLOAD IMAGE////////////////////////////////////////
webCfgAction.uploadImg = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "";
    try{
        if(req.body.upload_error==0){
            var file = req.files.webcfgImage?req.files.webcfgImage:req.files.webcfgLogo;
            upyun.uploadImage(file.name,function(err,rlt){
//                console.log(err,rlt);
                if(err){
                    result.error = 1;
                    result.errorMsg = "图片上传到服务器失败！请重试";
                }else{
                    result.errorMsg = file.originalname+"上传成功！";
                    result.url = config.ueditor.imageUrlPrefix + file.name;
                    result.type = file.extension;
                    result.original = file.originalname;
                }
                res.send(result);
            });
        }else{
            result.error = req.body.upload_error;
            result.errorMsg = req.body.upload_errorMsg;
            res.send(result);
        }
    }catch(e){
        result.error = 1;
        result.errorMsg = e.message;
        res.send(result);
    }
};

module.exports = webCfgAction;