var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
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

    var currentNumber = req.body.page?req.body.page:0;
    var pageSize = req.body.pageSize?req.body.pageSize:25;
    var reqUrl = config.httpReq.host+":"+config.httpReq.port+"/api/product/list?page="+currentNumber+"&pageSize="+pageSize+"&ent="+req.cookies.ei;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option,function(error,response,body){
        if(!error&&response.statusCode == 200){
            if(body){
                var obj = JSON.parse(body);
                if(!us.isEmpty(obj)&&0==obj.error&&null!=obj.data){
//                    console.log('------------------------------',obj.data);
                    for(var n in obj.data.products){
                        var tempwk = "";
                        for(var w in obj.data.products[n].weekend){
                            if(""!==tempwk){
                                tempwk +=","+ config.weekend[obj.data.products[n].weekend[w]];
                            }else{
                                tempwk += config.weekend[obj.data.products[n].weekend[w]];
                            }
                        }
                        obj.data.products[n].weekend = tempwk;
                        if(obj.data.products[n].isEnable){
                            obj.data.products[n].isEnable = "启用";
                        }else{
                            obj.data.products[n].isEnable = "禁用";
                        }
                        obj.data.products[n].startDate = new Date(obj.data.products[n].startDate).format("yyyy-MM-dd");
                        obj.data.products[n].endDate = new Date(obj.data.products[n].endDate).format("yyyy-MM-dd");
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

pdtAction.addPdt = function(req,res){
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.name = req.body.name;
    params.introduction = req.body.introduction;
    params.lat = req.body.lat;
    params.lon = req.body.lon;
    params.content = req.body.content;
    params.startDate = new Date(req.body.startDate+timeZone).getTime();
    params.endDate = new Date(req.body.endDate+timeZone).getTime();
    params.weekend = req.body.weekend;
    params.ent = req.cookies.ei;
    if(undefined!=req.body.images){
        params.images = req.body.images;
    }else{
        params.images = [];
    }
    console.log("---------------------------->pdt params:",params);
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
            console.log("----------------------------error",error,response.statusCode,body);
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
    params.content = req.body.content;
//    params.startDate = new Date(req.body.startDate+timeZone).getTime();
//    params.endDate = new Date(req.body.endDate+timeZone).getTime();
    params.weekend = req.body.weekend;
    params.ent = req.cookies.ei;
    if(undefined!=req.body.images){
        params.images = req.body.images;
    }else{
        params.images = [];
    }
    console.log("---------------------->update pdt:",params);
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
            console.log("----------------------------error",error,response.statusCode,body);
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
                console.log
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

module.exports = pdtAction;