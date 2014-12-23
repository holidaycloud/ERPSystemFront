var httpReq = require('request');
var config = require('./../tools/config.js');
var us = require('underscore');
var async = require('async');
var specAction = function () {
};
var timeZone = ' 00:00:00 +08:00';

//////////////////////////////////////////////page redirect/////////////////////////////////////////////////////
specAction.goPdtSpec = function (req, res) {
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    res.render('product_spec');
};
////////////////////////////////////////////////////product get data///////////////////////////////////////////////////
specAction.list = function (req, res) {
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    result.specs = [];
    var reqUrl = config.httpReq.host + ":" + config.httpReq.port + "/api/product/spec/list?id=" + req.params.id + "&token=" + req.cookies.t;
    config.httpReq.option.url = reqUrl;
    httpReq(config.httpReq.option, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
                var obj = JSON.parse(body);
                if (!us.isEmpty(obj) && 0 == obj.error && null != obj.data) {
                    console.log('------------------------------',obj.data);
                    for (var n in obj.data) {
                        result.specs.push(obj.data[n]);
                    }
                } else {
                    console.log('------------------------>get product spec list error:', obj.errMsg);
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            }
        } else {
            console.log('------------------------>get product spec list network error');
            result.error = 1;
            result.errorMsg = "网络异常";
        }
        res.send(result);
    });

};

//////////////////////////////////////////////SAVE///////////////////////////////////////////////////////
specAction.save = function (req, res) {
    var result = {};
    result.error = 0;
    result.errorMsg = "success";
    var params = {};
    params.id = req.body.pdt;
    params.spec = JSON.stringify(req.body.specs);
    params.token = req.cookies.t;
//    console.log("---------------------------->pdt spec params:",params);
    var reqUrl = config.httpReq.host + ":" + config.httpReq.port + "/api/product/spec/save";
    config.httpReq.option.url = reqUrl;
    config.httpReq.option.form = params;
    httpReq.post(config.httpReq.option, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
                var obj = JSON.parse(body);
//                console.log("------------------------->save class",obj);
                if (us.isEmpty(obj) || 0 != obj.error) {
                    result.error = 1;
                    result.errorMsg = obj.errMsg;
                }
            } else {
                result.error = 1;
                result.errorMsg = "服务器异常";
            }
        } else {
            result.error = 1;
            result.errorMsg = "网络异常";
            console.log("----------------------------error", error);
        }
        res.send(result);
    });
};

module.exports = specAction;