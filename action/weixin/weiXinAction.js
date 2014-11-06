/**
 * Created by cloudbian on 14-4-21.
 */
var weixin = require('./../../tools/weixin.js');
var config = require('./../../tools/config.js');
var httpReq = require('request');
var us = require('underscore');
var weixinAction = function(){};
//verify
weixinAction.notify = function(req,res){
    var ent = req.params.ent;//54124f09e07fa9341ba90cf3
    var signature = req.query.signature;
    var ts = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var reqUrl = config.wx.server+":"+config.wx.server_port+"/weixin/"+ent+"?signature="+signature+"&timestamp="+ts+"&nonce="+nonce+"&echostr="+echostr;
    config.httpReq.option.url = reqUrl;

    try{
        httpReq(config.httpReq.option,function(error,response,body){
            console.log("------------------------->weixin check:",body);
            if(!error&&response.statusCode == 200){
                if(body){
                    res.send(body);
                }else{
                    console.log("------------------------->weixin check data error");
                    res.send('error');
                }
            }else{
                console.log("----------------------------weixin check network error",error);
                res.send('error');
            }
        });
    }catch(e){
        console.log('wap check verify is error',e);
        res.send('error');
    }
};

//get msg
weixinAction.msgNotify = function(req,res){
    res.set('Content-Type', 'text/xml');
    var ent = req.params.ent;//54124f09e07fa9341ba90cf3
    var signature = req.query.signature;
    var ts = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var reqUrl = config.wx.server+":"+config.wx.server_port+"/weixin/"+ent+"?signature="+signature+"&timestamp="+ts+"&nonce="+nonce+"&echostr="+echostr;
    config.httpReq.option.url = reqUrl;
    try{
        httpReq(config.httpReq.option,function(error,response,body){
            if(!error&&response.statusCode == 200){
                if(body){
                    var _data = "";
                    req.on('data',function(chunk){
                        _data+=chunk;
                    });
                    req.on('end',function(){
                        weixin.message(ent,_data,function(err,result){
                            res.send(result);
                        });
                    });
                }else{
                    console.log("------------------------->weixin check error");
                    res.send('error');
                }
            }else{
                console.log("----------------------------weixin check error",error);
                res.send('error');
            }
        });
    }catch(e){
        console.log('wap check verify is error',e);
        res.send('error');
    }
}

//pay
weixinAction.order = function(req,res){
    var msg = "";
    var ip = req.ip;
    var useragent = req.headers['user-agent'];
    if(useragent.indexOf('MicroMessenger')<0){
        msg = '不支持微信以外的游览器';
    }
    var wxVer = parseInt(useragent.substr(useragent.lastIndexOf('/')+1,1));
    if(wxVer<=4&&""===msg){
        msg = '微信版本过低，无法支付，请升级';
    }
    if(""===msg){
        var wx = {};
        wx.appId = config.wx.appID;
        wx.partnerId = config.wx.partnerId;
        wx.key = config.wx.paySignKey;
        wx.partnerKey = config.wx.partnerKey;
        wx.ip = ip;
        res.render('wap/test',{wx:wx});
//        res.render('wap/demo');
    }else{
        res.send(msg);
    }
};

//payNotify
weixinAction.payNotify = function(req,res){
    var _data = "";
    req.on('data',function(chunk){
        _data+=chunk;
    });
    req.on('end',function(){
        var resValue = {};
        resValue.return_code = "SUCCESS";
        resValue.return_msg = "";
        weixin.getWeiXinConfig(req,res,function(error,wxcfg){
            weixin.payNotify(_data,wxcfg.config.partnerKey,function(err,result){
                if(err){
                    console.log("weixin pay notify 1 is error:"+result);
                    resValue.return_code = "FAIL";
                    resValue.return_msg = result;
                    res.send(resValue);
                }else {
                    if(result.return_code==="SUCCESS"){
                        if(result.result_code==="SUCCESS"){
                            try{
                                ////////////////get order status//////////////////
                                config.httpReq.option.url = config.httpReq.host+":"+config.httpReq.port+"/api/order/detail?id="+result.out_trade_no;
                                httpReq(config.httpReq.option,function(e,r,b){
                                    if(e|| r.statusCode!=200){
                                        console.log("weixin pay notify get order detail is error:"+e+",orderid is:",result.out_trade_no);
                                        resValue.return_code = "FAIL";
                                        resValue.return_msg = e;
                                        res.send(resValue);
                                    }else{
                                        if(b) {
                                            var obj = JSON.parse(b);
                                            if(obj.error==0){
                                                if(0==obj.data.status){
                                                    ///////////////////update order status////////////////////
                                                    config.httpReq.option.url = config.httpReq.host+":"+config.httpReq.port+"/api/order/changeStatus";
                                                    var params = {};
                                                    params.status = 1;
                                                    params.orderID = result.out_trade_no;
                                                    config.httpReq.option.form = params;
                                                    httpReq.post(config.httpReq.option,function(er,rs,bd){
                                                        if(er|| rs.statusCode!=200){
                                                            console.log("weixin pay notify update order status is error:"+er+",orderid is:",result.out_trade_no);
                                                            resValue.return_code = "FAIL";
                                                            resValue.return_msg = er;
                                                            res.send(resValue);
                                                        }else{
                                                            if(bd) {
                                                                var o = JSON.parse(bd);
                                                                if(0==o.error){
                                                                    console.log("weixin pay notify success,orderid is:",result.out_trade_no);
                                                                    res.send(resValue);
                                                                }else{
                                                                    resValue.return_code = "FAIL";
                                                                    resValue.return_msg = "weixin pay notify update order status is error:"+o.errMsg+",orderid is:",result.out_trade_no;
                                                                    console.log(resValue.return_msg);
                                                                    res.send(resValue);
                                                                }
                                                            }else{
                                                                resValue.return_code = "FAIL";
                                                                resValue.return_msg = "weixin pay notify update order status hasnot body,orderid is:",result.out_trade_no;
                                                                console.log(resValue.return_msg);
                                                                res.send(resValue);
                                                            }
                                                        }
                                                    });
                                                }else{
                                                    console.log("weixin pay notify success,order status is not 0,status is "+obj.data.status+",orderid is:",result.out_trade_no);
                                                    res.send(resValue);
                                                }
                                            }else{
                                                resValue.return_code = "FAIL";
                                                resValue.return_msg = "weixin pay notify get order detail is error:"+obj.errMsg+",orderid is:",result.out_trade_no;
                                                console.log(resValue.return_msg);
                                                res.send(resValue);
                                            }
                                        }else{
                                            resValue.return_code = "FAIL";
                                            resValue.return_msg = "weixin pay notify get order detail hasnot body,orderid is:"+result.out_trade_no;
                                            console.log(resValue.return_msg);
                                            res.send(resValue);
                                        }
                                    }
                                });
                            }catch(ex){
                                console.log("weixin pay notify 2 is error:"+ex);
                                resValue.return_code = "FAIL";
                                resValue.return_msg = ex;
                                res.send(resValue);
                            }
                        }else{
                            console.log("weixin pay notify 3 is error:result code is fail");
                            resValue.return_code = "FAIL";
                            resValue.return_msg = "result code is fail";
                            res.send(resValue);
                        }
                    }else{
                        console.log("weixin pay notify 4 is error:"+result.return_msg);
                        resValue.return_code = "FAIL";
                        resValue.return_msg = result.return_msg;
                        res.send(resValue);
                    }
                }
            });
        });
    });
}

//deliver
weixinAction.deliver = function(req,res){
    var response = {};
    var openid = req.query.openid;
    var transid = req.query.transid;
    var out_trade_no = req.query.out_trade_no;
    weixin.getAT(function(){
        weixin.deliver(openid,transid,out_trade_no,function(e,r){
            if(e){
                response.error = 1;
                response.errorMsg = r;
            }else{
                response.error = 0;
                response.errorMsg = r;
            }
            res.send(response);
        });
    },config.wx.appID,config.wx.appsecret);
}

//customer
weixinAction.customerNotify = function(req,res){
    var _data = "";
    req.on('data',function(chunk){
        _data+=chunk;
    });
    req.on('end',function(){
        weixin.customer(_data,function(err,result){
            if(err){
                console.log("customer is error:",err,result);
            }
            res.send("success");
        });
    });
}

weixinAction.feedback = function(req,res){
    var response = {};
    var openid = req.query.openid;
    var feedbackid = req.query.feedbackid;
    weixin.getAT(function(){
        weixin.feedback(openid,feedbackid,function(err,result){
            if(err){
                response.error = 1;
                response.errorMsg = err;
            }else{
                response.error = 0;
                response.errorMsg = result;
            }
            res.send(response);
        });
    },config.wx.appID,config.wx.appsecret);
}

//warn
weixinAction.warn = function(req,res){
    res.send("success");
}

module.exports = weixinAction;