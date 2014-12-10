var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var userAction = function(){};

userAction.login = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    //param
    var uName = req.body.username;
    var pwd = req.body.password;
//    var remember = req.body.remember;
    //link url
    var loginName = "&";
//    if(/^1[0-9]\d{10,10}$/.test(uName)){
        loginName += "mobile=";
//    }else if(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(uName)){
//        loginName += "email=";
//    }else{
//        loginName += "username=";
//    }
    loginName +=uName;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/login?passwd="+pwd+loginName;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
//            console.log("result------------------------>",body);
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    if(remember&&"true"===remember){
//                        res.cookie('m',obj.data.member.passwd,{'maxAge':7*24*3600*1000});
//                        res.cookie('s','r',{'maxAge':7*24*3600*1000});
//                    }else{
//                        res.clearCookie('m');
//                        res.cookie('s','f',{'maxAge':7*24*3600*1000});
//                    }
                    res.cookie('n',obj.data.member.loginName,{'maxAge':obj.data.expireDate});
                    res.cookie('e',obj.data.member.ent.name,{'maxAge':obj.data.expireDate});
                    res.cookie('ei',obj.data.member.ent._id,{'maxAge':obj.data.expireDate});
                    res.cookie('ea',obj.data.member.ent.isAdmin?true:false,{'maxAge':obj.data.expireDate});
                    res.cookie('t',obj.data.token,{'maxAge':obj.data.expireDate});
                    res.cookie('d',obj.data.expireDate,{'maxAge':obj.data.expireDate});
                }else{
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                console.log("error------------------------>",body);
                result.error = 1;
                result.errorMsg = "网络异常，请重试";
            }

        }else{
            console.log("error result------------------------>",error);
            result.error = 1;
            result.errorMsg = "网络异常，请重试";
        }
        res.send(result);
    });
};

//userAction.autoLogin = function(req,res,fn){
//    var result = 1;
//    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/login?passwd="+req.cookies.m+"&username="+req.cookies.n;
//    httpReq(config.httpReq.option,function(error,response,body){
//        if(!error&&response.statusCode == 200){
//            if(body){
//                var obj = JSON.parse(body);
//                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    if(req.cookies.s&&"r"===req.cookies.s){
//                        res.cookie('m',obj.data.member.passwd,{'maxAge':7*24*3600*1000});
//                        res.cookie('s','r',{'maxAge':7*24*3600*1000});
//                    }else{
//                        res.clearCookie('m');
//                        res.cookie('s','f',{'maxAge':7*24*3600*1000});
//                    }
//                    res.cookie('n',obj.data.member.loginName,{'maxAge':7*24*3600*1000});
//                    res.cookie('t',obj.data.token,{'maxAge':24*3600*1000});
//                    res.cookie('d',obj.data.expireDate,{'maxAge':24*3600*1000});
//                    result = 0;
//                }
//            }
//        }
//        fn(result);
//    });
//}

userAction.checkToken = function(req,res,next){
    var result = 1;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/token?token="+req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                    res.cookie('n',obj.data.member.loginName,{'maxAge':obj.data.expireDate});
                    res.cookie('e',obj.data.member.ent.name,{'maxAge':obj.data.expireDate});
                    res.cookie('ei',obj.data.member.ent._id,{'maxAge':obj.data.expireDate});
                    res.cookie('ea',obj.data.member.ent.isAdmin?true:false,{'maxAge':obj.data.expireDate});
                    result = 0;
                }
            }
        }
        if(0==result){
            next();
        }else{
            response.redirect("/");
        }
    });
};

userAction.goForget = function(req,res){
    res.render('forget');
}
userAction.logout = function(req,res){
    console.log('------------------------>LOGOUT');
    res.clearCookie('n');
    res.clearCookie('e');
    res.clearCookie('ei');
    res.clearCookie('ea');
    res.clearCookie('t');
    res.clearCookie('d');
    res.redirect('/');
}

userAction.goUserInfo = function(req,res){
    res.render('userinfo',{uName:req.cookies.n,uEnt:req.cookies.e});
}

userAction.changePwd = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.token = req.cookies.t;
    params.oldPasswd = req.body.oPwd;
    params.newPasswd = req.body.nPwd;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/changePasswd";
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

userAction.recMsg = function(req,res){
    console.log(req.body.message);
}

userAction.index = function(req,res){
    res.render('index',{isAdmin:req.cookies.ea});
}

userAction.goWeiXinBind = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "";
    if(req.query.code){
        var code = req.query.code;
        var reqUrl = config.wx.server+":"+config.wx.server_port+"/weixin/codeAccesstoken/548123e82321630e394590e5?code="+code;
        config.httpReq.option.url = reqUrl;
        httpReq(config.httpReq.option,function(error,response,body){
            if(!error&&response.statusCode == 200){
                if(body){
                    var obj = JSON.parse(body);
                    if(!us.isEmpty(obj)&&0==obj.error){
                        if(null!=obj.data){
                         res.cookie('wxo',obj.data.openid,{'maxAge':7*24*3600*1000});
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
            if(1 == result.error){
                res.send(result.errorMsg);
            }else{
                res.render('weixin_bind');
            }
        });
    }else{
        result.error = 2;
        result.errorMsg = "验证信息异常，请在微信游览器中重新点击进入";
        res.send(result);
    }
}

userAction.wxBind = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    //param
    var uName = req.body.username;
    var pwd = req.body.password;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/member/weixinBind";
    config.httpReq.option.url = reqUrl;
    var params = {};
    params.loginName = uName;
    params.pwd = pwd;
    params.openid = req.cookies.wxo;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
//            console.log("result------------------------>",body);
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){

                }else{
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }else{
                console.log("error------------------------>",body);
                result.error = 1;
                result.errorMsg = "网络异常，请重试";
            }

        }else{
            console.log("error result------------------------>",error);
            result.error = 1;
            result.errorMsg = "网络异常，请重试";
        }
        res.send(result);
    });
};
module.exports = userAction;