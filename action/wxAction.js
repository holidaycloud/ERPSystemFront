var httpReq = require('request');
var config = require('./../tools/config.js');
var weixin = require('./../tools/weixin.js');
var us = require('underscore');
var async = require('async');
var wxAction = function(){};

wxAction.goWeiXinCfg = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    result.data ={};
    result.data.url = config.wx.callbackDomain + "/" + req.cookies.ei + "/notify";
    result.data.warnUrl = config.wx.callbackDomain + "/" + req.cookies.ei + "/warn";
    result.data.payDir = config.wx.callbackDomain + "/" + req.cookies.ei + "/pay/";
    result.data.payEg = config.wx.callbackDomain + "/" + req.cookies.ei + "/pay/order";
    result.data.cusUrl = config.wx.callbackDomain + "/" + req.cookies.ei + "/customer";
    res.render("weixin_config",result);
}

wxAction.goElementUpload = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render("weixin_eleupload");
}

wxAction.goGrpSend = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render("weixin_groupsend");
}

wxAction.getWeiXinConfig = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.wx.server+":"+config.wx.server_port+"/weixin/configDetail/"+req.cookies.ei;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){

        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->get weixin config detail:",obj);
                if(!us.isEmpty(obj)&&0==obj.error){
                    if(null!=obj.data){
                        result.data = obj.data;
                    }
                }else{
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                console.log("------------------------->get weixin config data error");
                result.error = 1;
                result.errorMsg = "服务器异常";
            }
        }else{
            console.log("----------------------------error",error);
            result.error = 1;
            result.errorMsg = "网络异常";
        }
        res.send(result);
    });
}

wxAction.saveConfig = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.token = req.body.token;
    params.appID = req.body.appId;
    params.appsecret = req.body.appsecret;
    params.partnerId = req.body.partnerId;
    params.partnerKey = req.body.partnerKey;
    params.paySignKey = req.body.paySignKey;
    var reqUrl = config.wx.server+":"+config.wx.server_port+"/weixin/saveConfig/"+req.cookies.ei;
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->save weixin config:",obj);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
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

wxAction.getPicMsgPdts = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/list?ent="+req.cookies.ei+"&isRes=false&page=0&pageSize=999";
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->get picMsg products:",obj);
                if(!us.isEmpty(obj)&&0==obj.error){
                    if(null!=obj.data){
                        result.data = obj.data.products;
                    }
                }else{
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                console.log("------------------------->get picMsg pdts data error");
                result.error = 1;
                result.errorMsg = "服务器异常";
            }
        }else{
            console.log("----------------------------picMsg pdts error",error);
            result.error = 1;
            result.errorMsg = "网络异常";
        }
        res.send(result);
    });
}

wxAction.sendGrpMsg = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var type = req.body.type;
    var params = {};
    if("1"===type){     //////////////////////////picMsg send
        params.thumb_media_id = [];
        params.author = [];
        params.title = [];
        params.content_source_url = [];
        params.content = [];
        params.digest = [];
        params.show_cover_pic = [];
        async.waterfall([
            function(cb){
                var pdts = req.body.pdts;
                for(var i in pdts){
                    params.thumb_media_id.push(pdts[i].media);
                    params.author.push(null);
                    params.title.push(pdts[i].title);
                    params.content_source_url.push(config.wx.callbackDomain+"/wap/goDetail/"+pdts[i].id+"?ent="+req.cookies.ei);
                    params.content.push(pdts[i].intr);
                    params.digest.push(null);
                    params.show_cover_pic.push(null);
                }
                //upload articles
                var reqUrl = config.wx.server+":"+config.wx.server_port+"/weixin/uploadArticles/"+req.cookies.ei;
                config.httpReq.option.url = reqUrl;
                config.httpReq.option.form = params;
                httpReq.post(config.httpReq.option,function(error,response,body){
                    if(!error&&response.statusCode == 200){
                        if(body){
                            var obj = JSON.parse(body);
                            console.log("------------------------->upload picMsg",body);
                            if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                                result.data = obj.data;
                            }else{
                                result.error = 1;
                                result.errorMsg = obj.errMsg;
                                console.log("----------------------------weixin group send error:",obj.errMsg);
                            }
                        }else{
                            result.error = 1;
                            result.errorMsg = "服务器异常";
                            console.log("----------------------------weixin group send server error");
                        }
                    }else{
                        result.error = 1;
                        result.errorMsg = "网络异常";
                        console.log("----------------------------weixin group send network error",error);
                    }
                    cb(null,result);
                });
            },function(r,cb){
                if(result.error==0){
                    //send group msg
                    params = {};
                    params.articleID = result.data._id;
                    var reqUrl = config.wx.server+":"+config.wx.server_port+"/weixin/groupSendArticle/"+req.cookies.ei;
                    config.httpReq.option.url = reqUrl;
                    config.httpReq.option.form = params;
                    httpReq.post(config.httpReq.option,function(error,response,body){
                        if(!error&&response.statusCode == 200){
                            if(body){
                                var obj = JSON.parse(body);
                                console.log("------------------------->weixin group send picMsg",obj);
                                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                                    result.data = obj.data;
                                }else{
                                    result.error = 1;
                                    result.errorMsg = obj.errMsg;
                                    console.log("----------------------------weixin group send picMsg error:",obj.errMsg);
                                }
                            }else{
                                result.error = 1;
                                result.errorMsg = "服务器异常";
                                console.log("----------------------------weixin group send picMsg server error");
                            }
                        }else{
                            result.error = 1;
                            result.errorMsg = "网络异常";
                            console.log("----------------------------weixin group send picMsg network error",error);
                        }
                        cb(null,result);
                    });
                }else{
                    cb("error","upload articles error");
                }
            }
        ],function(error,result){
            res.send(result);
        });

    }
}

wxAction.initWeiXin = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var appID = req.query.appID;//"wx190214d55eec21df"
    var appsecret = req.query.appsecret;//"74ed5cffe3f1bf576d0d3fc9cab2d370",
    var paySignKey = req.query.paySignKey;//"",
    var partnerId = req.query.partnerId;//"1218852001",
    var partnerKey = req.query.partnerKey;//"fa909f07b280503e68c0231b358aa9b9",
    var wxToken = req.query.token;//"HC";
    var ent = req.cookies.ei?req.cookies.ei:"54124f09e07fa9341ba90cf3";
    var token = "";
    weixin.getAT(function(){
        //先删除原有菜单，然后重新生成菜单
        weixin.delMenu(ent,function(errMsg){
            if(""!==errMsg){
                result.error = 1;
                result.errorMsg = errMsg;
            }else{
                weixin.createMenu(ent,token,function(errMsg){
                    if(""!==errMsg){
                        result.error = 1;
                        result.errorMsg = errMsg;
                    }else{
                        res.send(result);
                    }
                });
            }
        });

    },ent,config.wx.appID,config.wx.appsecret);
//    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/login"；
//    config.httpReq.option.url = reqUrl;
//    httpReq(config.httpReq.option,function(error,response,body){
//        if(!error&&response.statusCode == 200){
////            console.log("result------------------------>",body);
//            if(body){
//                var obj = JSON.parse(body);
//                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//
//                }else{
//                    result.error = 1;
//                    result.errorMsg = obj.errMsg;
//                }
//            }else{
//                console.log("error------------------------>",body);
//                result.error = 1;
//                result.errorMsg = "网络异常，请重试";
//            }
//
//        }else{
//            console.log("error result------------------------>",error);
//            result.error = 1;
//            result.errorMsg = "网络异常，请重试";
//        }
    result.notifyUrl = "http://cloud.bingdian.com/weixin/54124f09e07fa9341ba90cf3/notify";
    result.custNotifyUrl = "http://cloud.bingdian.com/weixin/54124f09e07fa9341ba90cf3/customer";
        res.send(result);
//    });
};
module.exports = wxAction;