var httpReq = require('request');
var config = require('./../tools/config.js');
var weixin = require('./../tools/weixin.js');
var us = require('underscore');
var async = require('async');
var pdtAction = function(){};
var timeZone = ' 00:00:00 +08:00';

pdtAction.goPdt = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('product');
};

pdtAction.goRes = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('product_res');
};

pdtAction.getPdtList = function(req,res){
    var result = {};
    result.aaData = [];
    result.iTotalRecords = 0;
    result.iTotalDisplayRecords = 0;

    var currentNumber = req.body.page?req.body.page/req.body.pageSize:0;
    var pageSize = req.body.pageSize?req.body.pageSize:25;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/list?page="+currentNumber+"&pageSize="+pageSize+"&ent="+req.cookies.ei+"&isRes="+req.body.isRes;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    for(var n in obj.data.products){
                        var tempwk = "";
                        if(obj.data.products[n].weekend){
                            for(var w in obj.data.products[n].weekend){
                                if(""!==tempwk){
                                    tempwk +=","+ config.weekend[obj.data.products[n].weekend[w]];
                                }else{
                                    tempwk += config.weekend[obj.data.products[n].weekend[w]];
                                }
                            }
                        }
                        obj.data.products[n].weekend = tempwk;
                        if(obj.data.products[n].isEnable){
                            obj.data.products[n].isEnable = "启用";
                        }else{
                            obj.data.products[n].isEnable = "禁用";
                        }
                        if(obj.data.products[n].startDate){
                            obj.data.products[n].startDate = new Date(obj.data.products[n].startDate).format("yyyy-MM-dd");
                        }else{
                            obj.data.products[n].startDate = "";
                        }
                        if(obj.data.products[n].endDate){
                            obj.data.products[n].endDate = new Date(obj.data.products[n].endDate).format("yyyy-MM-dd");
                        }else{
                            obj.data.products[n].endDate = "";
                        }
                        obj.data.products[n].createTime = new Date(obj.data.products[n].createTime).format("yyyy-MM-dd");
                    }
                    if(obj.data.products&&obj.data.products.length>0){
                        result.aaData = obj.data.products;
                    }
                    result.iTotalRecords = obj.data.totalSize?obj.data.totalSize:0;
                    result.iTotalDisplayRecords = obj.data.totalSize?obj.data.totalSize:0;
                }else{
                    console.log('------------------------>get product list error:',obj.errMsg);
                }
            }
        }else{
            console.log('------------------------>get product list network error');
        }
        res.send(result);
    });

};

pdtAction.getResList = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/nameList?ent="+req.cookies.ei+"&isRes=true";
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->save pdt",obj);
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
            result.errorMsg = "服务器异常";
            console.log("----------------------------error",error);
        }
        res.send(result);
    });
}

pdtAction.addPdt = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.name = req.body.name;
    params.introduction = req.body.introduction;
    params.lat = req.body.lat;
    params.lon = req.body.lon;
    params.isHot = req.body.isHot;
    params.content = req.body.content;
    if(3!=params.type){
        params.weekend = req.body.weekend;
    }
    params.ent = req.cookies.ei;
    params.type = req.body.type;
    if(0==params.type){
        params.startDate = new Date(req.body.startDate+timeZone).getTime();
        params.endDate = new Date(req.body.endDate+timeZone).getTime();
    }else if(1==params.type){
        params.startDate = req.body.start;
        params.endDate = req.body.end;
    }
    params.subProduct = us.isArray(req.body.subPdts)?req.body.subPdts:[];
    if(undefined!=req.body.images){
        params.imageUrl  = req.body.images;
    }else{
        params.imageUrl  = [];
    }
    params.imagesMediaId = [];
    params.imagesTitle = [];

    async.waterfall([
        function(cb){ //////////////////////////upload weixin image
            if(params.imageUrl.length>0){
                WeiXinImageUpload(req,res,req.cookies.ei,params.imageUrl[0],params,cb);
            }else{
                cb(null,null);
            }
        },function (r,cb){ /////////////////////////save product
//    console.log("---------------------------->pdt params:",params);
            var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/save";
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
                    console.log("----------------------------error",error);
                }
                cb(null,result);
            });
        }
    ],function(error,errorMsg){
        if(error){
            result.error = 1;
            result.errorMsg = "保存产品时异常！"+errorMsg;
        }
        res.send(result);
    });
};

pdtAction.updatePdt = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.id = req.params.id;
    params.name = req.body.name;
    params.introduction = req.body.introduction;
    params.lat = req.body.lat;
    params.lon = req.body.lon;
    params.isHot = req.body.isHot;
    params.content = req.body.content;
//    params.startDate = new Date(req.body.startDate+timeZone).getTime();
//    params.endDate = new Date(req.body.endDate+timeZone).getTime();
    if(3!=params.type){
        params.weekend = req.body.weekend;
    }
    params.ent = req.cookies.ei;
    if(undefined!=req.body.images){
        params.imageUrl = req.body.images;
    }else{
        params.imageUrl = [];
    }
    params.imagesMediaId = [];
    params.imagesTitle = [];
    params.type = req.body.type;
    params.subProduct = us.isArray(req.body.subPdts)?req.body.subPdts:[];
    async.waterfall([
        function(cb){ //////////////////////////upload weixin image
            if(params.imageUrl.length>0&&req.body.isChgImg&&req.body.isChgImg==="1"){
//                console.log("-------------------------upload image need");
                WeiXinImageUpload(req,res,req.cookies.ei,params.imageUrl[0],params,cb);
            }else{
//                console.log("-------------------------upload image not need");
                for(var i in params.imageUrl){
                    if(i==0){
                        params.imagesMediaId.push(req.body.media_id);
                        params.imagesTitle.push(params.name);
                    }else{
                        params.imagesMediaId.push(null);
                        params.imagesTitle.push(null);
                    }
                }
                cb(null,result);
            }
        },function (r,cb){ /////////////////////////update product
//    console.log("---------------------->update pdt:",params);
            var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/update";
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
                cb(null,result);
            });
        }
    ],function(error,errorMsg){
        if(error){
            result.error = 1;
            result.errorMsg = "更新产品时异常！"+errorMsg;
        }
        res.send(result);
    });
};

pdtAction.pdtDetail = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";

    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/detail?id="+req.params.id;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
//                console.log("------------------------->pdt detail:",obj);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
                    obj.data.startDate = new Date(obj.data.startDate).format("yyyy-MM-dd");
                    obj.data.endDate = new Date(obj.data.endDate).format("yyyy-MM-dd");
                    obj.data.createTime = new Date(obj.data.createTime).format("yyyy-MM-dd");
                    obj.data.productType = obj.data.productType?obj.data.productType:0;
                    obj.data.isHot = obj.data.isHot?obj.data.isHot:false;
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

pdtAction.ueconfig = function(req,res){
    var action = req.query.action;
    if("config"===action){
        res.send(config.ueditor);
    }else if("uploadimage"===action){
        var result = {};
        try{
//            console.log('---------------------->',req.files.upfile);
            var suffix = req.files.upfile.extension.toLowerCase();
            var flag = false;

            //check suffix
            for(var i in config.ueditor.imageAllowFiles){
                if(("."+suffix) === config.ueditor.imageAllowFiles[i]){
                    flag = true;
                    break;
                }
            }
            if(!flag){
                result.state = "请添加支持的图片格式：.png, .jpg, .jpeg, .gif, .bmp";
            }else{
                if(req.files.upfile.size>config.ueditor.imageMaxSize){
                    result.state = "目前图片大小仅支持："+(config.ueditor.imageMaxSize/1000)+"KB";
                }else{
                    if("image" ===req.files.upfile.mimetype.split('/')[0].toLowerCase()){
                        result.state = "SUCCESS";
                        result.url = config.ueditor.fileUrlPrefix + req.files.upfile.name;
                        result.type = suffix;
                        result.original = req.files.upfile.originalname;
                    }else{
                        result.state = "非法文件，此文件不是图片";
                    }
                }
            }
            res.send(result);
        }catch(e){
            result.state = e.message;
            res.send(result);
        }

    }

}

pdtAction.uploadImg = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "";
    try{
//            console.log('---------------------->',req.files.pdtImage);
        var suffix = req.files.pdtImage.extension.toLowerCase();
        var flag = false;

        //check suffix
        for(var i in config.ueditor.imageAllowFiles){
            if(("."+suffix) === config.ueditor.imageAllowFiles[i]){
                flag = true;
                break;
            }
        }
        if(!flag){
            result.error = 1;
            result.errorMsg = "请添加支持的图片格式：.png, .jpg, .jpeg, .gif, .bmp";
        }else{
            if(req.files.pdtImage.size>config.ueditor.imageMaxSize){
                result.error = 1;
                result.errorMsg = "目前图片大小仅支持："+(config.ueditor.imageMaxSize/1000)+"KB";
            }else{
                if("image" ===req.files.pdtImage.mimetype.split('/')[0].toLowerCase()){
                    result.errorMsg = req.files.pdtImage.originalname+"上传成功！";
                    result.url = config.ueditor.imageUrlPrefix + req.files.pdtImage.name;
                    result.type = suffix;
                    result.original = req.files.pdtImage.originalname;
                }else{
                    result.errorMsg = "非法文件，此文件不是图片";
                }
            }
        }
        res.send(result);
    }catch(e){
        result.errorMsg = e.message;
        res.send(result);
    }
}

//产品产品第一张图片进行微信素材上传
function WeiXinImageUpload(req,res,id,filePath,params,cb){
    weixin.getWeiXinConfig(req,res,function(error,data){
        if(error){
            cb("error",data);
        }else{
            if(data.error == 3){
                console.log('---------------------------weixin config is not generate canot upload');
                if(params.imageUrl.length>0){
                    for(var i=0;i<params.imageUrl.length;i++){
                        params.imagesMediaId.push(null);
                        params.imagesTitle.push(null);
                    }
                }
                cb(null,params);
            }else{
                console.log('---------------------------weixin image upload');
                var request = require('request');
                var fs = require('fs');
                var r = request.post({
                    url: config.wx.server + ":" + config.wx.server_port + "/weixin/upload/"+id,
                    headers: {
                        'accept': '*/*'
                    }
                }, function (err, res, body) {
                    if (err) {
                        console.log('---------------------------weixin image upload error',err);
                        cb("error",err);
                    } else {
                        var obj = JSON.parse(body);
//            console.log('---------------------------weixin image upload:',obj);
                        if(obj.error==0){
                            params.imagesMediaId.push(obj.data.media_id);
                            params.imagesTitle.push(params.name);
                            if(params.imageUrl.length>1){
                                for(var i=1;i<params.imageUrl.length;i++){
                                    params.imagesMediaId.push(null);
                                    params.imagesTitle.push(null);
                                }
                            }
                            cb(null,params);
                        }else{
                            cb("error",obj.errMsg);
                        }
                    }
                });
                var form = r.form();
                form.append('file', request(filePath));
                form.append('type', 'image');
            }
        }
    });
}
module.exports = pdtAction;