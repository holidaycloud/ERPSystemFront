var upy = require("upyun");
var config = require("./config.js");
var upyun = function(){};
var uy = new upy(config.upyun.bucket,config.upyun.operator,config.upyun.pswd,config.upyun.apiVer);

//获取空间大小
upyun.getUsage =  function(fn){
    uy.getUsage(function(err,result){
        fn(err,result);
    });
};

//上传图片
upyun.uploadImage = function(filePath,fn){
    uy.uploadFile("/"+filePath,config.upyun.fileBasePath+"/"+filePath,"image/jpeg",true,{},fn);
};
module.exports = upyun;