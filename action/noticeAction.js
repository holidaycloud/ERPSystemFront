var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var noticeAction = function(){};
noticeAction.goSend = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('notice_send');
};

noticeAction.goNotice = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('notice');
};
/////////////////////////////////ACTION/////////////////////////////////////////
noticeAction.send = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.person = req.body.person;
    params.content = req.body.content;
    params.token = req.cookies.t;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/notice/send";
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
            console.log("----------------------------send notice submit error",error);
        }
        res.send(result);
    });
};

noticeAction.recMsg = function(req,res){
    ////接收推送消息接口
    ////type 类型 0 通知中心消息  1 普通显示消息
    ////msg 消息内容
    ////receiver 接收消息的对象 null 全部对象
    //global.users[req.cookies.t].emit('notice',"test");
    try{
        var type = req.body.type;
        var msg = req.body.msg;
        var receiver = req.body.receiver;
        if(receiver !== "all"){
            global.users[receiver].emit('notice',{type:type,content:msg});
        }else{
            for(var id in global.users){
                global.users[id].emit('notice',{type:type,content:msg});
            }
        }
        res.send({error:0,errorMsg:"success"});
    }catch(e){
        res.send({error:1,errorMsg: e.message});
    }
};
///////////////////////////////GET DATA///////////////////////////////////
noticeAction.list = function(req,res){
    var result = {};
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;
    var currentNumber = req.body.page?req.body.page/req.body.pageSize:0;
    var pageSize = req.body.pageSize?req.body.pageSize:0;
    var ent = req.cookies.ei;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/notice/list?page="+currentNumber+"&pageSize="+pageSize+"&token="+req.cookies.t;
//    console.log("------------------------------",reqUrl);
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                    for(var i in obj.data.notices){
                        var n = obj.data.notices[i];
                        n.createDate = new Date(n.createDate).format("yyyy-MM-dd hh:mm:ss");
                        n.type = config.noticeType[n.type];
                        result.aaData.push(n);
                    }
                    result.iTotalRecords = obj.data.totalSize?obj.data.totalSize:0;
                    result.iTotalDisplayRecords = obj.data.totalSize?obj.data.totalSize:0;
                }else{
                    console.log('------------------------>notice list error:',obj.errMsg);
                }
            }
        }else{
            console.log('------------------------>notice list network error');
        }
        res.send(result);
    });
};

noticeAction.count = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/notice/count?token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq.get(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(us.isEmpty(obj)||0!=obj.error){
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }else{
                    result.data = obj.data;
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器异常";
            }
        }else{
            result.error = 1;
            result.errorMsg = "网络异常";
            console.log("----------------------------get notice count error",error);
        }
        res.send(result);
    });
};

noticeAction.getAllMembers = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/nameList?token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq.get(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(us.isEmpty(obj)||0!=obj.error){
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }else{
                    result.data = obj.data;
                }
            }else{
                result.error = 1;
                result.errorMsg = "服务器异常";
            }
        }else{
            result.error = 1;
            result.errorMsg = "网络异常";
            console.log("----------------------------get all members name list error",error);
        }
        res.send(result);
    });
};

module.exports = noticeAction;