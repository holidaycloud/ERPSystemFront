var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var entAction = function(){};

entAction.goEnt = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('ent');
};

entAction.getEntList = function(req,res){
    var result = {};
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;

    var currentNumber = req.body.page?req.body.page/req.body.pageSize:0;
    var pageSize = req.body.pageSize?req.body.pageSize:0;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/ent/list?page="+currentNumber+"&pageSize="+pageSize;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    for(var n in obj.data.ents){
                        if(obj.data.ents[n].isEnable){
                            obj.data.ents[n].isEnable = "启用";
                        }else{
                            obj.data.ents[n].isEnable = "禁用";
                        }
                        if(obj.data.ents[n].type==0){
                            obj.data.ents[n].type = "即是分销商又是供应商";
                        }else if(obj.data.ents[n].type==1){
                            obj.data.ents[n].type = "分销商";
                        }else if(obj.data.ents[n].type==2){
                            obj.data.ents[n].type = "供应商";
                        }
                        obj.data.ents[n].createTime = new Date(obj.data.ents[n].createTime).format("yyyy-MM-dd");
                    }
                    if(obj.data.ents&&obj.data.ents.length>0){
                        result.aaData = obj.data.ents;
                    }
                    result.iTotalRecords = obj.data.totalSize?obj.data.totalSize:0;
                    result.iTotalDisplayRecords = obj.data.totalSize?obj.data.totalSize:0;
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

entAction.addEnt = function(req,res){
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

entAction.updateEnt = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.id = req.params.id;
    params.name = req.body.entName;
    params.contactName = req.body.cName;
    params.contactEmail = req.body.cEmail;
    params.contactPhone = req.body.cMobile;
    params.proCode = req.body.code;
    params.remark = req.body.rmk;
    params.type = req.body.type;
    params.isEnable = req.body.isEnable;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/ent/update";
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

entAction.entDetail = function(req,res){
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

module.exports = entAction;