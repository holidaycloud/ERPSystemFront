var httpReq = require('request');
var config = require('./../tools/config.js');
var weixin = require('./../tools/weixin.js');
var us = require('underscore');
var timeZone = ' 00:00:00 +08:00';
var cusAction = function(){};

cusAction.goCus = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('customers');
};

cusAction.getCusLevels = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/list?ent="+req.cookies.ei;
//    console.log("------------------------------",("true"!==req.cookies.ea),reqUrl);
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){

                }else{
                    console.log('------------------------>get entMember list error:',obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }
        }else{
            console.log('------------------------>get entMember list network error');
            result.error = 1;
            result.errorMsg = "网络异常";
        }
        res.send(result);
    });
};

cusAction.getCusList = function(req,res){
    var result = {};
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;
    var currentNumber = req.body.page?req.body.page/req.body.pageSize:0;
    var pageSize = req.body.pageSize?req.body.pageSize:0;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/customer/list?ent="+req.cookies.ei+"&page="+currentNumber+"&pageSize="+pageSize;;
//    console.log("------------------------------",("true"!==req.cookies.ea),reqUrl);
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log("--------------------------customer list:",obj.data);
                    for(var n in obj.data.customers){
                        delete obj.data.customers[n].ent;
                        delete obj.data.customers[n].weixinOpenId
                        if(obj.data.customers[n].isEnable){
                            obj.data.customers[n].isEnable = "启用";
                        }else{
                            obj.data.customers[n].isEnable = "禁用";
                        }
                        if(!obj.data.customers[n].loginName){
                            obj.data.customers[n].loginName = "";
                        }
                        if(!obj.data.customers[n].email){
                            obj.data.customers[n].email = "";
                        }
                        if(!obj.data.customers[n].address){
                            obj.data.customers[n].address = "";
                        }
                        obj.data.customers[n].createDate = new Date(obj.data.customers[n].createDate).format("yyyy-MM-dd");
                    }
                    if(obj.data.customers&&obj.data.customers.length>0){
                        result.aaData = obj.data.customers;
                    }
                    result.iTotalRecords = obj.data.totalSize?obj.data.totalSize:0;
                    result.iTotalDisplayRecords = obj.data.totalSize?obj.data.totalSize:0;
                }else{
                    console.log('------------------------>get customer list error:',obj.errMsg);
                }
            }
        }else{
            console.log('------------------------>get customer list network error');
        }
        res.send(result);
    });
}
cusAction.getCusDetail = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/customer/detail?id="+req.params.id;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->pdt detail:",obj);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                    delete obj.data.ent;
                    delete obj.data.weixinOpenId
                    if(obj.data.isEnable){
                        obj.data.isEnable = "启用";
                    }else{
                        obj.data.isEnable = "禁用";
                    }
                    if(!obj.data.loginName){
                        obj.data.loginName = "";
                    }
                    if(!obj.data.name){
                        obj.data.name = "";
                    }
                    if(!obj.data.email){
                        obj.data.email = "";
                    }
                    if(!obj.data.address){
                        obj.data.address = "";
                    }
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

cusAction.addCustomer = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.ent = req.cookies.ei;
    params.mobile = req.body.cusMobile;
    params.name = req.body.cusName?req.body.cusName:"";
    params.loginName = req.body.cusLoginName?req.body.cusLoginName:"";
    params.email = req.body.cusEmail?req.body.cusEmail:"";
    params.address = req.body.cusAddress?req.body.cusAddress:"";
    params.passwd = req.body.cusPwd;
    params.isEnable = req.body.cusEnable;
    params.birthday  = new Date(req.body.cusYear+"-"+req.body.cusMonth+"-"+req.body.cusDay+timeZone).getTime();
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/customer/register";
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
}

cusAction.updateCustomer = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.id = req.params.id;
    params.ent = req.cookies.ei;
    params.mobile = req.body.cusMobile;
    params.name = req.body.cusName?req.body.cusName:"";
    params.loginName = req.body.cusLoginName?req.body.cusLoginName:"";
    params.email = req.body.cusEmail?req.body.cusEmail:"";
    params.address = req.body.cusAddress?req.body.cusAddress:"";
    params.passwd = req.body.cusPwd;
    params.isEnable = req.body.cusEnable;
    params.birthday  = new Date(req.body.cusYear+"-"+req.body.cusMonth+"-"+req.body.cusDay+timeZone).getTime();
//    console.log("---------------------->update pdt:",params);
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/customer/update";
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
}

module.exports = cusAction;