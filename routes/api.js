/**
 * Created by zzy on 7/31/14.
 */
var express = require('express');
var router = express.Router();
var MemberCtrl = require('./../control/memberCtrl');
var EntCtrl = require('./../control/entCtrl');

//Member接口
router.get('/member/login', function(request, response) {
    var loginName = request.query.mobile||request.query.email||request.query.username;
    var passwd = request.query.passwd;
    MemberCtrl.login(loginName,passwd,function(err,res){
        response.json(res);
    });
});

//Ent接口
router.post('/ent/register', function(request, response) {
    var name = request.body.name;
    var contactName = request.body.contactName;
    var contactEmail = request.body.contactEmail;
    var contactPhone = request.body.contactPhone;
    var proCode = request.body.proCode;
    var remark = request.body.remark;
    var type = request.body.type;
    EntCtrl.register(name,contactName,contactEmail,contactPhone,proCode,remark,type,function(err,res){
        response.json(res);
    });
});


module.exports = router;