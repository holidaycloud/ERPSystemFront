var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var entMbrAction = function(){};

entMbrAction.goEntMbrs = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('ent_members');
};

entMbrAction.getEnts = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    getEntsList(req,function(e){
        result.data = e;
        res.send(result);
    });
}

entMbrAction.getEntMemberList = function(req,res){
    var result = {};
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;

    var currentNumber = req.body.page?req.body.page/req.body.pageSize:0;
    var pageSize = req.body.pageSize?req.body.pageSize:0;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/list?page="+currentNumber+"&pageSize="+pageSize+"&token="+req.cookies.t;
    if(!us.isEmpty(req.body.mobile)){
        reqUrl += "&mobile="+req.body.mobile;
    }
    if("true"!==req.cookies.ea){
        reqUrl += "&ent="+req.cookies.ei;
    }
//    console.log("------------------------------",("true"!==req.cookies.ea),reqUrl);
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    for(var n in obj.data.members){
                        if(obj.data.members[n].isEnable){
                            obj.data.members[n].isEnable = "启用";
                        }else{
                            obj.data.members[n].isEnable = "禁用";
                        }
                        if(!obj.data.members[n].ent){
                            obj.data.members[n].ent = {};
                            obj.data.members[n].ent._id = "";
                            obj.data.members[n].ent.name = "";
                        }
                        if(!obj.data.members[n].loginName){
                            obj.data.members[n].loginName = "";
                        }
                        if(!obj.data.members[n].mobile){
                            obj.data.members[n].mobile = "";
                        }
                        if(!obj.data.members[n].email){
                            obj.data.members[n].email = "";
                        }
                        obj.data.members[n].createDate = new Date(obj.data.members[n].createDate).format("yyyy-MM-dd");
                    }
                    if(obj.data.members&&obj.data.members.length>0){
                        result.aaData = obj.data.members;
                    }
                    result.iTotalRecords = obj.data.totalSize?obj.data.totalSize:0;
                    result.iTotalDisplayRecords = obj.data.totalSize?obj.data.totalSize:0;
                }else{
                    console.log('------------------------>get entMember list error:',obj.errMsg);
                }
            }
        }else{
            console.log('------------------------>get entMember list network error');
        }
        res.send(result);
    });

};

entMbrAction.addEntMember = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.token = req.cookies.t;
    params.loginName = req.body.mbrName;
    if("true"===req.cookies.ea){
        params.ent = req.body.mbrEnt;
    }else{
        params.ent = req.cookies.ei;
    }
    params.mobile = req.body.mbrMobile;
    params.email = req.body.mbrEmail;
    params.passwd = req.body.mbrPwd;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/register";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->save pdt",obj);
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

entMbrAction.updateEntMember = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.token = req.cookies.t;
    params.id = req.params.id;
    params.loginName = req.body.mbrName;
    if("true"===req.cookies.ea){
        params.ent = req.body.mbrEnt;
    }else{
        params.ent = req.cookies.ei;
    }
    params.mobile = req.body.mbrMobile;
    params.email = req.body.mbrEmail;
//    console.log("---------------------->update pdt:",params);
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/update";
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

entMbrAction.entMbrDetail = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    result.ents = [];
    getEntsList(req,function(e){
        result.ents = e;
        var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/detail?id="+req.params.id+"&token="+req.cookies.t;
        config.httpReq.option.url = reqUrl;
        httpReq(config.httpReq.option,function(error,response,body){
            if(!error&&response.statusCode == 200){
                if(body){
                    var obj = JSON.parse(body);
//                console.log("------------------------->pdt detail:",obj);
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
    });
}

function getEntsList(req,fn){
    var ents = [];
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/ent/nameList?token="+req.cookies.t;
    if("true"!==req.cookies.ea){
        reqUrl += "&ent="+req.cookies.ei;
    }
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                    ents = obj.data;
                }else{
                    console.log('------------------------>get ent list error:',obj.errMsg);
                }
            }
        }else{
            console.log('------------------------>get ent list network error');
        }
        fn(ents);
    });
}
module.exports = entMbrAction;