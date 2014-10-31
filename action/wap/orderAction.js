var httpReq = require('request');
var config = require('./../../tools/config.js');
var weixin = require('./../../tools/weixin.js');
var us = require('underscore');
var async = require('async');
var orderAction = function(){};
var timeZone = ' 00:00:00 +08:00';
var edTimeZone = ' 23:59:59 +08:00';

orderAction.goFillOrder = function(req,res){
    var result = {};
    result.pid = req.params.id;
    async.waterfall([
        function(cb){
            var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/detail?id="+req.params.id;
            config.httpReq.option.url = reqUrl;
            httpReq(config.httpReq.option,function(error,response,body){
                if(!error&&response.statusCode == 200){
                    if(body){
                        var obj = JSON.parse(body);
    //                console.log("------------------------->pdt detail:",obj);
                        if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                            result.startDate = obj.data.startDate;
                            result.endDate = obj.data.endDate;
                            result.expireDate = new Date(result.startDate).format("yyyy-MM-dd")+"-"+new Date(result.endDate).format("yyyy-MM-dd");
                            result.pName = obj.data.name;
                            cb(error,obj.data);
                        }else{
                            console.log("------------------------->wap fill order error:",obj.errMsg);
                            cb("error",obj.errMsg);
                        }
                    }else{
                        console.log("------------------------->wap fill order error:服务器异常,没有返回数据");
                        cb("error","服务器异常,没有返回数据");
                    }
                }else{
                    console.log("----------------------------wap fill order error:网络异常",error);
                    cb("error","网络异常");
                }
            });
    },function(r,cb){
            if(req.params.price){
                var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/price/get?id="+req.params.price;
                config.httpReq.option.url = reqUrl;
                httpReq(config.httpReq.option,function(error,response,body){
                    if(!error&&response.statusCode == 200){
                        if(body){
                            var obj = JSON.parse(body);
                            if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                                result.sprice = obj.data.price;
                                result.inventory = obj.data.inventory;
                                result.selectDate = new Date(obj.data.date).format("yyyy-MM-dd");
                                result.priceId = req.params.price;
                                cb(error,obj);
                            }else{
                                console.log("------------------------->wap go fill order error:",obj.errMsg);
                                cb("error",obj.errMsg);
                            }
                        }else{
                            console.log("------------------------->wap go fill order error:服务器异常,没有返回数据");
                            cb("error","服务器异常,没有返回数据");
                        }
                    }else{
                        console.log("----------------------------wap go fill order error:网络异常",error);
                        cb("error","网络异常");
                    }
                });
            }else{
                cb("error","uri can't get price");
            }
    },function(r,cb){
            if(0<=req.headers['user-agent'].indexOf('MicroMessenger')){
                if(req.cookies.wxo){
                    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/customer/weixinLogin?ent="+req.cookies.ei+"&openId="+req.cookies.wxo;
                    config.httpReq.option.url = reqUrl;
                    httpReq(config.httpReq.option,function(error,response,body){
                        if(!error&&response.statusCode == 200){
                            if(body){
                                var obj = JSON.parse(body);
                                if(!us.isEmpty(obj)&&0==obj.error){
    //                                console.log("--------------------------------wap check weixin bind obj:",obj);
                                    result.bind = obj.data?true:false;
                                    cb(null,obj);
                                }else{
                                    console.log("------------------------->wap go fill order check bind error:",obj.errMsg);
                                    cb("error",obj.errMsg);
                                }
                            }else{
                                console.log("------------------------->wap go fill order check bind error:服务器异常,没有返回数据");
                                cb("error","服务器异常,没有返回数据");
                            }
                        }else{
                            console.log("----------------------------wap go fill order check bind error:网络异常",error);
                            cb("error","网络异常");
                        }
                    });
                }else{
                    cb("error","登录信息已失效，无法获取");
                }
            }else{
                result.bind = true;
                cb(null,null);
            }
        }
    ],function(err,eMsg){
        if(null!=err){
            console.log("------------------------->wap go fill order :",eMsg);
            res.render('wap/error_500');
        }else{
            if(result.bind){
                res.render("wap/order_fill",{data:result});
            }else{
                res.redirect("/wap/goUserBind?url=/wap/goFillOrder/"+req.params.id+"/"+req.params.price);
            }
        }
    });

}

orderAction.goOrderList = function(req,res){
    var result = {};
    result.bind = false;
    async.waterfall([
    function(cb){
        if(0<=req.headers['user-agent'].indexOf('MicroMessenger')){
            if(req.cookies.wxo){
                var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/customer/weixinLogin?ent="+req.cookies.ei+"&openId="+req.cookies.wxo;
                config.httpReq.option.url = reqUrl;
                httpReq(config.httpReq.option,function(error,response,body){
                    if(!error&&response.statusCode == 200){
                        if(body){
                            var obj = JSON.parse(body);
                            if(!us.isEmpty(obj)&&0==obj.error){
                                    console.log("--------------------------------wap check weixin bind obj:",obj);
                                result.bind = obj.data?true:false;
                                cb(null,obj);
                            }else{
                                console.log("------------------------->wap go fill order check bind error:",obj.errMsg);
                                cb("error",obj.errMsg);
                            }
                        }else{
                            console.log("------------------------->wap go fill order check bind error:服务器异常,没有返回数据");
                            cb("error","服务器异常,没有返回数据");
                        }
                    }else{
                        console.log("----------------------------wap go fill order check bind error:网络异常",error);
                        cb("error","网络异常");
                    }
                });
            }else{
                cb("error","登录信息已失效，无法获取");
            }
        }else{
            result.bind = true;
            cb(null,null);
        }
    },
    function(r,cb){
        var currentNumber = 0;
        var pageSize = 25;
        var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/order/openIdList?";
        if(0<=req.headers['user-agent'].indexOf('MicroMessenger')){
            reqUrl+= "openId="+req.cookies.wxo;
        }else{
            reqUrl+= "customer="+req.cookies.t;
        }
        if(result.bind){
//    console.log('------------------------------url',reqUrl);
            config.httpReq.option.url = reqUrl;
            httpReq(config.httpReq.option,function(error,response,body){
                if(!error&&response.statusCode == 200){
                    if(body){
                        var obj = JSON.parse(body);
                        if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                            result.orders = [];
                            for(var i in obj.data.orders){
                                var o = {};
                                o.orderId = obj.data.orders[i].orderID;
                                o.pName = obj.data.orders[i].product.name;
                                o.date = new Date(obj.data.orders[i].startDate).format("yyyy-MM-dd");
                                o.status = config.orderStatus[obj.data.orders[i].status];
                                o.totalPrice = obj.data.orders[i].totalPrice;
                                result.orders.push(o);
                            }
                            cb(null,null);
                        }else{
                            console.log('------------------------>get user order list error:',obj.errMsg);
                            cb("error",'get user order list error:',obj.errMsg);
                        }
                    }
                }else{
                    console.log('------------------------>get user order list network error',error);
                    cb("error",'network error');
                }
            });
        }else{
            cb(null,null);
        }
    }],function(err,eMsg){
        if(null!=err){
            console.log("------------------------->wap go fill order :",eMsg);
            res.render('wap/error_500');
        }else{
            console.log("------------------------->result.bind :",result.bind);
            if(result.bind){
                res.render('wap/order_list',{data:result});
            }else{
                res.redirect("/wap/goUserBind?url=/wap/order/list");
            }
        }
    });
};

orderAction.addOrder = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    console.log(req.cookies);
    if(0<=req.headers['user-agent'].indexOf('MicroMessenger')){
        if(req.cookies.wxo){ //weixin flow
            params.openId = req.cookies.wxo;
            weixin.getWeiXinConfig(req,res,function(err,returnValue){
                params.token = returnValue.config.memberToken;
                params.product = req.body.product;
                params.startDate = new Date(req.body.startDate+timeZone).getTime();
                params.quantity = req.body.quantity;
                params.price = req.body.price;
                params.liveName  = req.body.liveName ;
                params.contactPhone  = req.body.contactPhone ;
                var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/order/save";
                config.httpReq.option.url = reqUrl;
                config.httpReq.option.form = params;
                console.log('---------------------p:',params);
                httpReq.post(config.httpReq.option,function(error,response,body){
                    if(!error&&response.statusCode == 200){
                        if(body){
                            var obj = JSON.parse(body);
                            if(us.isEmpty(obj)||0!=obj.error){
                                console.log(req.cookies.wxo,"------------------------->weixin addOrder error:",obj.errMsg);
                                result.error = 1;
                                result.errorMsg = obj.errMsg;
                                res.send(result);
                            }else{
//                            console.log("------------------------->weixin save order",obj);
                                result.oid = obj.data._id;
                                res.send(result);
                            }

                        }else{
                            console.log(req.cookies.wxo,"------------------------->weixin addOrder can't get data");
                            result.error = 1;
                            result.errorMsg = "服务器异常，请重试";
                            res.send(result);
                        }
                    }else{
                        console.log(req.cookies.wxo,"------------------------->weixin addOrder network error:",error);
                        result.error = 1;
                        result.errorMsg = "网络异常，请重试";
                        res.send(result);
                    }
                });
            });
        }else{
            result.error = 1;
            result.errorMsg = "用户信息已失效，请重新预定需要购买的产品！";
            res.send(result);
        }
    }else{
        res.send("wap flow");
    }


};

orderAction.goOrderPay = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var useragent = req.headers['user-agent'];
    var wxVer = parseInt(useragent.substr(useragent.lastIndexOf('/')+1,1));
    if(useragent.indexOf('MicroMessenger')<0){
        result.error = 1;
        result.errorMsg = '不支持微信以外的游览器';
    }
    if(wxVer<=4&&"success"===result.errorMsg){
        result.error = 1;
        result.errorMsg = '微信版本过低，无法支付，请升级';
    }
    if(result.error == 0){
        var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/order/detail?id="+req.params.id;
//    console.log("-----------------------url",reqUrl);
        config.httpReq.option.url = reqUrl;
        httpReq(config.httpReq.option,function(error,response,body){
            if(!error&&response.statusCode == 200){
                if(body){
                    var obj = JSON.parse(body);
//                    console.log("------------------------->wap go order pay:",obj);
                    if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    obj.data.status = config.orderStatus[obj.data.status];
//                    obj.data.payWay = config.payWay[obj.data.payWay];
//                    obj.data.orderDate = new Date(obj.data.orderDate).format("yyyy-MM-dd hh:mm:ss");
                        result.oid = obj.data._id;
                        result.orderId = obj.data.orderID;
                        result.pName = obj.data.product.name;
                        result.date = new Date(obj.data.startDate).format("yyyy-MM-dd");
                        result.quantity = obj.data.quantity;
//                        result.totalPrice = obj.data.totalPrice;
                        result.totalPrice = 1;
                        result.users = [{liveName:obj.data.liveName?obj.data.liveName:"",contactPhone:obj.data.contactPhone?obj.data.contactPhone:""}];
                        //get weixin config and return
                        weixin.getWeiXinConfig(req,res,function(err,data){
                            if(error){
                                console.log("----------------------------wap go order pay that get weixin config error:",data);
                                res.render("wap/error_500");
                            }else{
                                result.appid = data.config.appID;
                                result.partnerKey = data.config.partnerKey;
                                var xml_params = {};
                                xml_params.out_trade_no = result.oid;
                                xml_params.body = result.pName;
                                xml_params.total_fee = result.totalPrice;
                                xml_params.notify_url = config.wx.callbackDomain+"/wap/pay/paynotify/"+result.oid;
                                xml_params.trade_type = "JSAPI";
                                xml_params.appid = result.appid;
                                xml_params.mch_id = data.config.partnerId;
                                xml_params.openid = req.cookies.wxo;
                                xml_params.nonce_str = result.nonceStr;
                                xml_params.spbill_create_ip = req.ip;
                                var xml = getUnifiedOrderXml(xml_params,result.partnerKey);
                                console.log('-----------------------xml:'+xml);
                                weixin.getPrePayId(req,res,xml,function(e,d){
                                    if(e){
                                        console.log("----------------------------wap go order pay get prepay id error:",d);
                                        res.render("wap/error_500");
                                    }else{
                                        result.package = "prepay_id="+d;
                                        res.render("wap/order_pay",{data:result});
                                    }

                                });

                            }
                        });
                    }else{
                        console.log("----------------------------wap go order pay can't get data",obj.errMsg);
                        res.render("wap/error_500");
                    }
                }else{
                    console.log("----------------------------wap go order pay server error");
                    res.render("wap/error_500");
                }
            }else{
                console.log("----------------------------wap go order pay error:网络异常",error);
                res.render("wap/error_500");
            }
        });
    }else{
     res.send(result);
    }
}

orderAction.goOrderPaySucc = function(req,res){
    if(req.params.oid){
        var result = {};
        result.oid = req.params.oid;
        res.render("wap/order_success",{data:result});
    }else{
        res.send("URI异常，请重试");
    }
}

//generate unifiedorder xml
function getUnifiedOrderXml(params,key){
    var xml = "<xml>";
    xml += "<out_trade_no><![CDATA["+params.out_trade_no+"]]></out_trade_no>";
    xml += "<body><![CDATA["+params.body+"]]></body>";
    xml += "<total_fee>"+params.total_fee+"</total_fee>";
    xml += "<notify_url><![CDATA["+params.notify_url+"]]></notify_url>";
    xml += "<trade_type><![CDATA["+params.trade_type+"]]></trade_type>";
    xml += "<openid><![CDATA["+params.openid+"]]></openid>";
    xml += "<appid><![CDATA["+params.appid+"]]></appid>";
    xml += "<mch_id><![CDATA["+params.mch_id+"]]></mch_id>";
    xml += "<spbill_create_ip><![CDATA["+params.spbill_create_ip+"]]></spbill_create_ip>";
    xml += "<nonce_str><![CDATA["+params.nonce_str+"]]></nonce_str>";
    xml += "<sign><![CDATA["+getSign(params,key)+"]]></sign>";
    xml += "</xml>";
    return xml;
}

//get Sign
function getSign(params,pk){
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
    shasum.update(str);
    var mySign = shasum.digest('hex');
    return mySign.toUpperCase();
}

//generate nonce string
function getNonceStr(){
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = $chars.length;
    var noceStr = "";
    for (i = 0; i < 32; i++) {
        noceStr += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
}

module.exports = orderAction;