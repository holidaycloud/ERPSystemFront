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
    result.data.url = config.wx.callbackDomain + "/weixin/" + req.cookies.ei + "/notify";
    result.data.warnUrl = config.wx.callbackDomain + "/weixin/" + req.cookies.ei + "/warn";
    result.data.payDir = config.wx.callbackDomain + "/wap/order/goPay/";
    result.data.oauthUrl = config.wx.callbackDomain.substr(7,config.wx.callbackDomain.length);
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

wxAction.goAutoRes = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render("weixin_autores");
}



//////////////////////////////////////////GET DATA////////////////////////////////////////////////
wxAction.getWeiXinConfig = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.wx.server+":"+config.wx.server_port+"/weixin/configDetail/"+req.cookies.ei+"?token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){

        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->get weixin config detail:",obj);
                if(!us.isEmpty(obj)&&0==obj.error){
                    if(null!=obj.data){
//                        obj.data.memberToken = obj.data.memberToken?obj.data.memberToken:"";
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

wxAction.getPicMsgPdts = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/list?ent="+req.cookies.ei+"&isRes=false&page=0&pageSize=999"+"&token="+req.cookies.t;
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

wxAction.getResDetail = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var type = req.params.type;
    var reqUrl = config.wx.server+":"+config.wx.server_port+"/weixin/autoRes/"+type+"/"+req.cookies.ei+"?token="+req.cookies.t;
    if("key"===type){
        reqUrl += "?id="+req.query.id;
    }else{
        reqUrl +="?msg="+req.body.msg;
    }
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                console.log("------------------------->get weixin autoRes detail:",obj);
                if(!us.isEmpty(obj)&&0==obj.error){
                    if(null!=obj.data){
                        result.data = obj.data;
                    }
                }else{
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                console.log("------------------------->get weixin autoRes data error");
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

wxAction.getKeys = function(req,res){
    var result = {};
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;
    var currentNumber = req.body.page?req.body.page/req.body.pageSize:0;
    var pageSize = req.body.pageSize?req.body.pageSize:25;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/weixin/autoRes/key/list?page="+currentNumber+"&pageSize="+pageSize+"&ent="+req.cookies.ei+"&token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    for(var n in obj.data){
                        var o = obj.data[n];
                        var tmp = "";
                        if(o.keys){
                            for(var i in o.keys){
                                if(i==0){
                                    tmp = o.keys[i];
                                }else{
                                    tmp += " "+o.keys[i];
                                }
                            }
                            o.keys = tmp;
                        }
                        result.aaData.push(o);
                    }
                    result.iTotalRecords = obj.data.totalSize?obj.data.totalSize:0;
                    result.iTotalDisplayRecords = obj.data.totalSize?obj.data.totalSize:0;
                }else{
                    console.log('------------------------>get autoRes key list error:',obj.errMsg);
                }
            }
        }else{
            console.log('------------------------>get autoRes key list network error');
        }
        res.send(result);
    });
}
//////////////////////////////////////////////ACTION////////////////////////////////////////////////////
wxAction.saveConfig = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
//    async.waterfall([
//        function(cb){
//            if(""!==req.body.mToken){
//                cb(null,null);
//            }else{
//                var params = {};
//                params.loginName = "微信专用";
//                params.ent = req.cookies.ei;
//                params.mobile = "10000000000";
//                params.email = "";
//                params.passwd = "";
//                var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/register";
//                config.httpReq.option.url = reqUrl;
//                config.httpReq.option.form = params;
//                httpReq.post(config.httpReq.option,function(error,response,body){
//                    if(!error&&response.statusCode == 200){
//                        if(body){
//                            var obj = JSON.parse(body);
//                            if(us.isEmpty(obj)||0!=obj.error){
//                                result.error = 1;
//                                result.errorMsg = obj.errMsg;
//                            }else{
//                                result.member = obj.data._id;
//                            }
//                        }else{
//                            result.error = 1;
//                            result.errorMsg = "服务器异常";
//                        }
//                    }else{
//                        result.error = 1;
//                        result.errorMsg = "网络异常";
//                        console.log("----------------------------error",error,response.statusCode,body);
//                    }
//                    cb(null,result);
//                });
//            }
//        },function(r,cb){
//            if(""!==req.body.mToken){
//                cb(null,null);
//            }else{
//                var params = {};
//                params.member = result.member;
//                var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/noExpireToken?member="+result.member;
//                config.httpReq.option.url = reqUrl;
////                config.httpReq.option.form = params;
//                httpReq(config.httpReq.option,function(error,response,body){
//                    if(!error&&response.statusCode == 200){
//                        if(body){
//                            var obj = JSON.parse(body);
//                            if(us.isEmpty(obj)||0!=obj.error){
//                                result.error = 1;
//                                result.errorMsg = obj.errMsg;
//                            }else{
//                                result.memberToken = obj.data;
//                            }
//                        }else{
//                            result.error = 1;
//                            result.errorMsg = "服务器异常";
//                        }
//                    }else{
//                        result.error = 1;
//                        result.errorMsg = "网络异常";
//                        console.log("----------------------------error",error);
//                    }
//                    cb(null,result);
//                });
//            }
//        },function(r,cb){
//            if(result.error!=0){
//                cb("error",result.errorMsg);
//            }else{
                var params = {};
                params.token = req.body.token;
                params.appID = req.body.appId;
                params.appsecret = req.body.appsecret;
                if(req.body.partnerId){
                    params.partnerId = req.body.partnerId;
                }else{
                    params.partnerId = null;
                }
                if(req.body.partnerKey){
                    params.partnerKey = req.body.partnerKey;
                }else{
                    params.partnerKey = null;
                }
                params.paySignKey = null;
                params.token = req.cookies.t;
//                if(""!==req.body.mToken){
//                    params.memberToken = req.body.mToken;
//                }else{
//                    params.memberToken =  result.memberToken?result.memberToken:"";
//                }
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
//                                result.memberToken = params.memberToken;
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
//            }
//        }
//    ],function(error,errMsg){
//        res.send(result);
//    });
}

wxAction.sendGrpMsg = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var type = req.body.type;
    var params = {};
    params.token = req.cookies.t;
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
//                            console.log("------------------------->upload picMsg",body);
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
                    params.token = req.cookies.t;
                    params.articleID = result.data._id;
                    var reqUrl = config.wx.server+":"+config.wx.server_port+"/weixin/groupSendArticle/"+req.cookies.ei;
                    config.httpReq.option.url = reqUrl;
                    config.httpReq.option.form = params;
                    httpReq.post(config.httpReq.option,function(error,response,body){
                        if(!error&&response.statusCode == 200){
                            if(body){
                                var obj = JSON.parse(body);
//                                console.log("------------------------->weixin group send picMsg",obj);
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

wxAction.autoResSave = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.ent = req.cookies.ei;
    params.token = req.cookies.t;
    if("key"===req.params.type){
        params.name = req.body.name;
        params.keys = req.body.keys;
        params.autoRes = req.body.autoRes;
    }else{
        params.msg = req.body.msg;
    }
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/weixin/autoRes/"+type+"/save";
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
}

wxAction.autoKeyResUpdate = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.ent = req.cookies.ei;
    params.token = req.cookies.t;
    params.name = req.body.name;
    params.keys = req.body.keys;
    params.autoRes = req.body.autoRes;

    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/weixin/autoRes/key/update/"+req.params.id;
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
}

/////////////////////////////////////////////UPLOAD IMAGE///////////////////////////////////////////////////////
wxAction.uploadImg = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "";
    var type = req.params.type;
    var fieldName = "";
    if("picMsg"===type){
        fieldName = "euPicMsgImg";
    }else if ("pic"===type){
        fieldName = "euPicImg";
    }
    try{
        if(req.body.upload_error==0){
            upyun.uploadImage(req.files.fieldName.name,function(err,rlt){
//                console.log(err,rlt);
                if(err){
                    result.error = 1;
                    result.errorMsg = "图片上传到服务器失败！请重试";
                }else{
                    result.errorMsg = req.files.fieldName.originalname+"上传成功！";
                    result.url = config.ueditor.imageUrlPrefix + req.files.fieldName.name;
                    result.type = req.files.fieldName.extension;
                    result.original = req.files.fieldName.originalname;
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
}
module.exports = wxAction;