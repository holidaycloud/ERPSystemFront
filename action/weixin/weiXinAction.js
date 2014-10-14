/**
 * Created by cloudbian on 14-4-21.
 */
var weixin = require('./../../tools/weixin.js');
var config = require('./../../tools/config.js');
var httpReq = require('request');
var weixinAction = function(){};
//verify
weixinAction.notify = function(req,res){
    var ent = req.params.ent //54124f09e07fa9341ba90cf3
    var signature = req.query.signature;
    var ts = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    try{
        if(weixin.check(config.wx.wxToken,signature,ts,nonce)){
            if(null==echostr){
                res.send('error');
            }else{
                res.send(echostr);
            }
        }else{
            res.send('error');
        }
    }catch(e){
        console.log('wap check verify is error',e);
        res.send('error');
    }
};

//get msg
weixinAction.msgNotify = function(req,res){
    res.set('Content-Type', 'text/xml');
    var ent = req.params.ent?req.params.ent:"54124f09e07fa9341ba90cf3";
    //check
    var signature = req.query.signature;
    var ts = req.query.timestamp;
    var nonce = req.query.nonce;
//    console.log(signature,ts,nonce);
    if(weixin.check(config.wx.wxToken,signature,ts,nonce)){
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
        res.send('无效信息!');
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
        weixin.payNotify(_data,function(err,result){
            if(err){
                console.log("wap pay notify is error:"+err);
                res.send("fail");
            }else{
                try{
                    config.httpReq.option.url = config.httpReq.host+":"+config.httpReq.port+"/order/detail/"+req.params.id;
                    httpReq(config.httpReq.option,function(e,r,b){
                        if(e|| r.statusCode!=200){
                            console.log("wap pay notify while get order detail is error:"+e);
                            res.send("fail");
                        }else{
                            if(b){
                                var obj = JSON.parse(b);
                                if(0===obj.error){
                                    if(0===obj.data.status){
                                        if("0"===req.query.trade_state){
                                            config.httpReq.option.url = config.httpReq.host+":"+config.httpReq.port+"/order/update/"+req.params.id;
                                            var params = {};
                                            params.status = 1;
                                            params.orderId = req.query.transaction_id;
                                            config.httpReq.option.form = params;
                                            httpReq.post(config.httpReq.option,function(er,rs,bd){
                                                if(er||rs.statusCode!=200){
                                                    console.log("wap pay notify update order status is error:"+er);
                                                    res.send("fail");
                                                }else{
                                                    if(bd){
                                                        var o = JSON.parse(bd);
                                                        if(0===o.error){
                                                            console.log("orderID:"+o.data.orderID+" wap pay notify is success");
                                                            res.send("success");
                                                            //send sms
//                                                    sendOrderSMSFn(r.data.contactPhone,r.data.orderID,r.data.member._id,function(error,ret){
//                                                        if(error){
//                                                            console.log("mobile:"+r.data.contactPhone+",orderID:"+r.data.orderID+",memberId:"+r.data.member._id+" send pay success sms is failed,reason is "+ret);
//                                                        }else{
//                                                            console.log("mobile:"+r.data.contactPhone+",orderID:"+r.data.orderID+",memberId:"+r.data.member._id+" send pay success sms is success");
//                                                        }
//                                                    });
                                                            //deliver
                                                            weixin.getAT(function(){
                                                                weixin.deliver(result,req.query.transaction_id,req.query.out_trade_no,function(error,ret){
                                                                    if(error){
                                                                        console.log(req.query.out_trade_no+" deliver is failed:"+ret);
                                                                    }else{
                                                                        console.log(req.query.out_trade_no+" deliver is success");
                                                                    }
                                                                });
                                                            });
                                                        }else{
                                                            console.log("wap pay notify is error:"+ o.errorMsg);
                                                            res.send("fail");
                                                        }
                                                    }else{
                                                        console.log("wap pay notify update order status can't response");
                                                        res.send("fail");
                                                    }
                                                }
                                            });
                                        }
                                    }else{
                                        console.log("orderID:"+obj.data.orderID+" wap pay notify is success,but this order status has been changed to"+ obj.data.status);
                                        res.send("success");
                                    }
                                }else{
                                    console.log("wap pay notify is error:"+ obj.errMsg);
                                    res.send("fail");
                                }
                            }else{
                                console.log("wap pay notify can't response");
                                res.send("fail");
                            }
                        }
                    });
                }catch(e){
                    console.log("wap pay notify is error:"+e.message);
                    res.send("fail");
                }
            }
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