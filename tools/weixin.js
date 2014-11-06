/**
 * @author bjj
 */
var config = require("./../tools/config.js");
var httpReq = require('request');
var us = require('underscore');
var qs = require("querystring");
var parseString = require('xml2js').parseString;
var WeiXin = function () {
};
WeiXin.sendMsg = {};
var ats = {};

WeiXin.ACCESS_TOKEN = "";
WeiXin.expressTime = 0;

WeiXin.check = function (token,signature, timestamp, nonce) {
    var tmpArr = [token, timestamp, nonce];
//	console.log("Before Sort",tmpArr);
    tmpArr.sort();
//	console.log("After Sort",tmpArr);
    var str = tmpArr[0] + tmpArr[1] + tmpArr[2];
    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    var mySign = shasum.digest('hex');
    if (mySign === signature) {
        return true;
    } else {
        return false;
    }
};

//get msg
WeiXin.message = function ( ent, xml, cb) {
    var parseString = require('xml2js').parseString;
    parseString(xml, function (err, result) {
        var msgType = result.xml.MsgType[0];
        WeiXin[msgType](ent,result,cb);
    });
};

WeiXin.image = function (xml) {

};

WeiXin.voice = function (xml) {

};

WeiXin.video = function (xml) {

};

WeiXin.location = function (xml) {

};

WeiXin.link = function (xml) {

};

WeiXin.event = function (ent,xml,cb) {
    if ("CLICK" === xml.xml.Event[0]) {
        var message = "";
        switch (xml.xml.EventKey[0]) {
            case 'PDTLIST':
                var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/list?ent="+ent;
                config.httpReq.option.url = reqUrl;
                httpReq(config.httpReq.option,function(error,response,body){
                    if(!error&&response.statusCode==200){
                        if(body){
                            var obj = JSON.parse(body);
                            if(!us.isEmpty(obj)&&obj.error==0&&null!=obj.data){
//                                return WeiXin.sendMsg['plist'](xml.xml.FromUserName[0],xml.xml.ToUserName[0],obj.data);
                                cb(null,WeiXin.sendMsg['plist'](xml.xml.FromUserName[0],xml.xml.ToUserName[0],obj.data,ent));
                            }else{
                                cb(WeiXin.sendMsg['text'](xml.xml.FromUserName[0],xml.xml.ToUserName[0],"暂时获取不到产品列表，稍后重试"));
                            }
                        }
                    }else{
                        cb(WeiXin.sendMsg['text'](xml.xml.FromUserName[0],xml.xml.ToUserName[0],"暂时获取不到产品列表，稍后重试"));
                    }
                });
                break;
            case 'ORDERLIST':
                break;
            case 'PAY_ORDER':
                break;
        }
    }
};

//send msg
WeiXin.sendMsg.text = function (to, from,text) {
    return   "<xml>"
            + "<ToUserName><![CDATA[" + to + "]]></ToUserName>"
            + "<FromUserName><![CDATA[" + from + "]]></FromUserName>"
            + "<CreateTime>" + new Date().getTime() + "</CreateTime>"
            + "<MsgType><![CDATA[text]]></MsgType>"
            + "<Content><![CDATA["+text+"]]></Content>"
            + "</xml>";
};

WeiXin.sendMsg.plist = function (to, from, plist,ent) {
    var totalSize = 10;
    if(plist.products.length<10){
        totalSize = plist.products.length;
    }
     var msg = "<xml>";
            msg += "<ToUserName><![CDATA[" + to + "]]></ToUserName>";
            msg += "<FromUserName><![CDATA[" + from + "]]></FromUserName>";
            msg += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
            msg += "<MsgType><![CDATA[news]]></MsgType>";
            msg += "<ArticleCount>"+totalSize+"</ArticleCount>";
            msg += "<Articles>";

            for(var i=0;i<totalSize;i++){
                msg += "<item>";
                msg += "<Title><![CDATA["+plist.products[i].name+"]]></Title>";
                msg += "<Description><![CDATA["+plist.products[i].name+"]]></Description>";
                msg += "<PicUrl><![CDATA[http://dd885.b0.upaiyun.com/eb42654a71d982c8e2d13905.jpg]]></PicUrl>";
                var content = "http://cloud.bingdian.com/wap/goDetail/"+plist.products[i]._id+"?ent="+ent;
                msg += "<Url><![CDATA[https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.wx.appID+"&redirect_uri="+content+"&response_type=code&scope=snsapi_base&state=holidaycloud#wechat_redirect]]></Url>";
                msg += "</item>";
            }
            msg += "</Articles>"
            msg += "</xml>";
//    console.log(msg);
    return msg;
};

//get access token if express will request or not
WeiXin.getAT = function (fn,ent,appID,appsecret) {
    try{
        if (ats.ent&&new Date().getTime() <= ats.ent.expressTime) {
            fn();
        } else {
//            console.log("token need regenerate");
            config.httpReq.option.url = config.wx.wxhost + "/cgi-bin/token?grant_type=client_credential&appid=" + appID + "&secret=" + appsecret;
            httpReq(config.httpReq.option,function (error, response, body) {
                if(!error&&response.statusCode == 200){
                    if(body){
                        var obj = JSON.parse(body);
//                    console.log(obj);
                        if (obj.access_token) {
                            ats.ent = {};
                            ats.ent.ACCESS_TOKEN = obj.access_token;
                            ats.ent.expressTime = new Date().getTime() + obj.expires_in * 1000;
                            fn();
                        }else{
                            console.log("----------------------response can't find token");
                            fn();
                        }
                    }else{
                        console.log("----------------------get token error,can't get it");
                        fn();
                    }
                }else{
                    console.log("----------------------request token error",error);
                    fn();
                }
            });
        }
    }catch(e){
        console.log('----------------------------request token error',e);
    }

}
//menu
WeiXin.createMenu = function (ent,token,fn) {
    var params = {
        "button": [
            {
                "name": "产品预订",
                "type": "click",
                "key": "PDTLIST"
            },
            {
                "name": "我的订单",
                "type": "view",
                "url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.wx.appID+"&redirect_uri=http://cloud.bingdian.com/wap/order/list?ent="+ent+"&response_type=code&scope=snsapi_base&state=holidaycloud#wechat_redirect"
            },
            {
                "type": "click",
                "name": "维权",
                "key": "CUSTOM"
            }
        ]
    };
    config.httpReq.option.url = config.wx.wxhost + "/cgi-bin/menu/create?access_token=" + ats.ent.ACCESS_TOKEN;
    config.httpReq.option.form = JSON.stringify(params);
    httpReq.post(config.httpReq.option, function (error, response, body) {
        var errMsg = "";
        if(!error&&response.statusCode==200){
            if(body){
                var obj = JSON.parse(body);
                if (0 !== obj.errcode) {
                    errMsg = obj.errmsg;
                }
            }else{
                errMsg = "request create menu,not receive response";
            }
        }else{
            errMsg = "network error";
        }
        fn(errMsg);
    });
}

WeiXin.delMenu = function (ent,fn) {
    config.httpReq.option.url = config.wx.wxhost + "/cgi-bin/menu/delete?access_token=" + ats.ent.ACCESS_TOKEN;
    httpReq(config.httpReq.option,function (error, response, body) {
        console.log("dele menu is " + ats.ent.ACCESS_TOKEN);
        var errMsg = "";
        if(!error&&response.statusCode==200){
            if(body){
                var obj = JSON.parse(body);
                if (0 !== obj.errcode) {
                    errMsg = obj.errmsg;
                }
            }else{
                errMsg = "delete menu,but can't get response";
            }
        }else{
            errMsg = "network error";
        }
        fn(errMsg);
    });
}

//deliver notify
WeiXin.deliver = function(openid,transid,out_trade_no,cb){
    //postParams
    var params = {};
    params.appid = config.wx.appID;
    params.openid = openid;
    params.transid = transid;
    params.out_trade_no = out_trade_no;
    params.deliver_timestamp = Math.round((new Date().getTime()/1000)).toString();
    params.deliver_status = "1"; //1 deliver success  2 deliver failed,if failed then deliver_msg is set failed reason
    params.deliver_msg = "OK";
    params.appkey = config.wx.paySignKey; //only generate sign use it\
    var keys = ["appid","appkey","openid","transid","out_trade_no","deliver_timestamp","deliver_status","deliver_msg"];
    params.app_signature = WeiXin.generateSign(keys,params);
    params.sign_method = "sha1";
    //params delete appkey
    delete params.appkey;

    config.httpReq.option.url = config.wx.wxhost + "/pay/delivernotify?access_token=" + WeiXin.ACCESS_TOKEN;
    config.httpReq.option.form = JSON.stringify(params);
    httpReq.post(config.httpReq.option,function (err, response, body) {
        if(!err&&response.statusCode==200){
            if(body){
                var obj = JSON.parse(body);
                if(obj.errcode!==0){
                    cb(obj.errcode,obj.errmsg);
                }else{
                    cb(null,obj.errmsg);
                }
            }else{
                cb("error","delivernotify can't receive response");
            }
        }else{
            cb("error",err);
        }
    });
}

//customer
WeiXin.customer = function (data,cb) {
    parseString(data, function (err, result) {
        type = result.xml.MsgType[0];
        if(err){
            cb('error','数据异常无法解析');
        }else{
            var keys = ["appid","appkey","timestamp","openid"];
            var values = {};
            values.appid = config.wx.appID;
            values.appkey = config.wx.paySignKey;
            values.timestamp = result.xml.TimeStamp[0];
            values.openid = result.xml.OpenId[0];
            var sign = WeiXin.generateSign(keys,values);
            if(result.xml.AppSignature[0] === sign){
                WeiXin.customer[type](result,function(e,r){
                    if(e){
                        cb("error",r);
                    }else{
                        if(0===r.error){
                            cb(null,"success");
                        }else{
                            cb(r.error, r.errorMsg);
                        }
                    }
                });
            }else{
                cb('error','签名不正确',result.xml.AppSignature[0]+","+sign);
            }
        }
    });
}

//处理用户新增诉求
WeiXin.customer.request = function(result,cb){
    var params = {};
    params.openID = result.xml.OpenId[0];
    params.msgType = result.xml.MsgType[0];
    params.feedbackID = result.xml.FeedBackId[0];
    params.transID = result.xml.TransId[0];
    params.reason = result.xml.Reason[0];
    params.solution = result.xml.Solution[0];
    params.extInfo = result.xml.ExtInfo[0];
    config.httpReq.option.url = config.httpReq.host+":"+config.httpReq.port+"/wap/feedback/create";
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function (err, response) {
        if (err) {
            cb("error",err);
        }else{
            cb(null,response);
        }
    });
}

//处理用户确认处理完毕
WeiXin.customer.confirm = function(result,cb){
    var params = {};
    params.msgType = result.xml.MsgType[0];
    config.httpReq.option.url = config.httpReq.host+":"+config.httpReq.port+"/wap/feedback/update/"+result.xml.FeedBackId[0];
    config.httpReq.option.form = params;
   httpReq.post(config.httpReq.option,function (err, response) {
        if (err) {
            cb("error",err);
        }else{
            cb(null,response);
        }
    });
}

//处理用户拒绝处理完毕
WeiXin.customer.reject = function(result,cb){
    var params = {};
    params.msgType = result.xml.MsgType[0];
    config.httpReq.option.url = config.httpReq.host+":"+config.httpReq.port+"/wap/feedback/update/"+result.xml.FeedBackId[0];
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function (err, response) {
        if (err) {
            cb("error",err);
        }else{
            cb(null,response);
        }
    });
}

//feedback
WeiXin.feedback = function(openid,feedbackid,cb){
    config.httpReq.option.url = config.httpReq.host+":"+config.httpReq.port+"/payfeedback/update?access_token=" + WeiXin.ACCESS_TOKEN + "&openid=" + openid + "&feedbackid=" + feedbackid;
    httpReq(config.httpReq.option,function (err, response) {
        if (err) {
            cb("error",err);
        }else{
            if(0!==response.errcode){
                cb(response.errcode,response.errmsg);
            }else{
                cb(null,"ok");
            }
        }
    });
}

//pay notify
WeiXin.payNotify = function(xml,pk,cb){
    var parseString = require('xml2js').parseString;
    parseString(xml, function (err, result) {
        console.log("--------------------------notify for pay xml:",xml);
        if(err){
            cb("error",err);
        }else{
            var sign = "";
            var resValue = {};
            for(var key in result.xml){
                if(key !=="sign"){//&&"undefined"!==result.xml[key][0]
                    resValue[key] = result.xml[key][0];
                }else{
                    sign = result.xml[key][0];
                }
            }
            var mySign = WeiXin.generateSign(resValue,pk);
            if(sign===mySign){
                cb(null,resValue);
            }else{
                cb("error","sign is not true,"+mySign+","+sign);
            }
        }
    });
}

//生成签名
WeiXin.generateSign = function(params,pk){
    var arrayKeys = [];
    var str = "";
    for(var key in params){
        arrayKeys.push(key);
    }
    arrayKeys.sort();
    for(var i=0;i<arrayKeys.length;i++){
        if(i==0){
            str = arrayKeys[i] +"="+ params[arrayKeys[i]];
        }else{
            str += "&" + arrayKeys[i] +"="+ params[arrayKeys[i]];
        }
    }
    str +="&key="+pk;
    console.log('------------------------str',str);
    var crypto = require('crypto');
    var shasum = crypto.createHash('md5');
    shasum.update(str,"utf8");
    var mySign = shasum.digest('hex');
    return mySign.toUpperCase();
}

//oAuth2.0
WeiXin.oAuth = function(code,appID,appsecret,cb){
    config.httpReq.option.url = config.wx.wxhost+"/sns/oauth2/access_token?appid="+appID+"&secret="+appsecret+"&code="+code+"&grant_type=authorization_code";
    httpReq(config.httpReq.option,function (err, response, body) {
        if(!err&&response.statusCode==200){
            if(body){
                var obj = JSON.parse(body);
//                console.log(obj);
                cb(null,obj);
            }else{
                cb('error',"request oauth can't response");
            }
        }else{
            cb('error',err);
        }
    });
}

//get weixin config by entId
WeiXin.getWeiXinConfig = function(req,res,cb){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var ent = (req.cookies.ei&&undefined!==req.cookies.ei)?req.cookies.ei:req.params.ent;
    try{
        var reqUrl = config.wx.server+":"+config.wx.server_port+"/weixin/configDetail/"+ent;
//    console.log("-----------------------url",reqUrl);
        config.httpReq.option.url = reqUrl;
        httpReq(config.httpReq.option,function(error,response,body){
            if(!error&&response.statusCode == 200){
                if(body){
                    var obj = JSON.parse(body);
//                    console.log("------------------------->wap go order pay:",obj);
                    if(!us.isEmpty(obj)&&0==obj.error){
                        if(null!=obj.data){
                            result.config = obj.data;
                            cb(null,result);
                        }else{
                            result.error = 3;
                            result.errorMsg = "未生成商户配置";
                            cb(null,result);
                        }

                    }else{
                        console.log("----------------------------get weixin config can't get data",obj.errMsg);
                        cb("error",obj.errMsg);
                    }
                }else{
                    console.log("----------------------------get weixin config server error");
                    cb("error","服务器异常");
                }
            }else{
                console.log("----------------------------get weixin config error:网络异常",error);
                cb("error","网络异常");
            }
        });
    }catch(e){
        result.error = 1;
        result.errorMsg = "获取微信配置失败！"+e;
        cb("error",result);
    }
}

//get getPrePayId
WeiXin.getPrePayId = function(req,res,xml,cb){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    try{
        var reqUrl = config.wx.wxphost+"/pay/unifiedorder";
//    console.log("-----------------------url",reqUrl);
        config.httpReq.option.url = reqUrl;
        config.httpReq.option.form = xml;
        httpReq.post(config.httpReq.option,function(error,response,body){
            if(!error&&response.statusCode == 200){
                if(body){
                    var parseString = require('xml2js').parseString;
                    parseString(body, function (err, result) {
                        if(err){
                            cb("error",err);
                        }else{
                            var data = {};
                            console.log("------------------------->get weixin prepay id",result);
                            if(result.xml.return_code[0]==="FAIL"){
                                cb("error",result.xml.return_msg[0]);
                            }else{
                                if(result.xml.result_code[0]==="SUCCESS"){
                                    cb(null,result.xml.prepay_id[0]);
                                }else{
                                    console.log("------------------------->get weixin prepay id，微信服务器异常无法支付");
                                    cb("error","微信服务器异常无法支付");
                                }
                            }
                        }
                    });
                }else{
                    console.log("----------------------------get weixin prepay id server error");
                    cb("error","服务器异常");
                }
            }else{
                console.log("----------------------------get weixin prepay id network error:网络异常",error);
                cb("error","网络异常");
            }
        });
    }catch(e){
        result.error = 1;
        result.errorMsg = "获取微信配置失败！"+e;
        cb("error",result);
    }
}

module.exports = WeiXin;