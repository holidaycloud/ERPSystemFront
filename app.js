var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');
var http = require('http');
//var mongoose = require('mongoose');
//var uri = 'mongodb://172.16.0.15/wohoooo';
//global.db = mongoose.createConnection(uri);

//var api = require('./routes/api');
var config = require('./tools/config.js');
var index = require('./routes/index');
var weixin = require('./routes/weixin');
var wap = require('./routes/wap');
var app = express();

var log4js = require('log4js');
//log4js config
log4js.configure({
    appenders : [ {
        type : 'console'
    }],
    replaceConsole : true
});
var logger = log4js.getLogger('normal');

app.enable('trust proxy');
app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
    res.set('X-Powered-By','Server');
    next();
});
app.use(log4js.connectLogger(logger, {
    level : log4js.levels.INFO
}));
//upload
var upload_error = 0;
var upload_errorMsg = "";
app.use(multer({
    dest : config.upyun.fileBasePath
    ,limits: {
        fileSize:config.ueditor.imageMaxSize
    }
    ,onFileSizeLimit: function (file) {
        upload_error = 1;
        upload_errorMsg = "目前图片大小仅支持："+(config.ueditor.imageMaxSize/1000)+"KB";
        var fs = require('fs');
        fs.unlink('./' + file.path);
    }
    ,onFileUploadStart: function (file) {
        var suffix = file.extension.toLowerCase();
        upload_error = 0;
        upload_errorMsg = "";
        var flag = false;

        //check suffix
        for(var i in config.ueditor.imageAllowFiles){
            if(("."+suffix) === config.ueditor.imageAllowFiles[i]){
                flag = true;
                break;
            }
        }
        if(!flag){
            upload_error = 1;
            upload_errorMsg = "请添加支持的图片格式：.png, .jpg, .jpeg, .gif, .bmp";
        }else{
            if("image" !==file.mimetype.split('/')[0].toLowerCase()){
                upload_error = 1;
                upload_errorMsg = "非法文件，此文件不是图片";
            }
        }
    }
    ,onParseEnd: function (req, next) {
        req.body.upload_error = upload_error;
        req.body.upload_errorMsg = upload_errorMsg;
        next();
    }
}));
app.use('/', index);
app.use('/weixin', weixin);
app.use('/wap', wap);
//app.use('/api', api);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('error', {
        message: err,
        error: {}
    });
});

/// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error_500', {
        message: err.message,
        error: {}
    });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
module.exports = app;



Date.prototype.format = function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1 ? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}