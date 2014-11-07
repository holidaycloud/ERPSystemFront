//生成单个缩略图
function generateReview(url,pannel,tempVar){
    var obj = "<div class='list01'><div class='imgdiv'><img src='"+url+"'/></div>";
    obj +="<p></p>";
    obj +="<div class='btdiv'><a href='#' class='delete delPic' purl='"+url+"'><img src='img/list_delete.gif'/></a></div></div>";
    $("#"+pannel).html(obj);
    $(".delPic").bind('click',function(){
    varObj[tempVar] = "";
    $(this).parent().parent().remove();
});
}

//文件上传
function ajaxFileUpload(fieldsName,pannel,tempVar) {
$.ajaxFileUpload({
    url: '/ent/webcfg/uploadImg', //用于文件上传的服务器端请求地址
    secureuri: false, //是否需要安全协议，一般设置为false
    fileElementId: fieldsName, //文件上传域的ID
    dataType: 'json', //返回值类型 一般设置为json
    success: function (data, status)  //服务器成功响应处理函数
    {
        if(data.error==0){
            alert(data.errorMsg);
            varObj[tempVar] = data.url;
            generateReview(data.url,pannel,tempVar);
        }else{
            alert(data.errorMsg);
        }
    },
    error: function (data, status, e)//服务器响应失败处理函数
    {
        alert("上传失败："+e);
    }
});
return false;
};

//clear the webCfg form
function clearWebCfgForm(){
    $("#webcfgDomain").val("");
    $("#webcfgName").val("");
    $("#webcfgAddress").val("");
    $("#webcfgTel").val("");
    $("#webcfgEmail").val("");
    $("#webcfgLon").val("");
    $("#webcfgLat").val("");
    varObj.logo = "";
    varObj.image = "";
    var file = $("#webcfgLogo");
    file.after(file.clone().val(""));
    file.remove();
    $("#webcfgLogoName").val("");
    $("#logos").html("");

    var file = $("#webcfgImage");
    file.after(file.clone().val(""));
    file.remove();
    $("#webcfgImgName").val("");
    $("#images").html("");
}

//ajax save config
function saveConfig(params){
    $("#ldModal").modal({
        backdrop:false,
        keyboard:false
    });
    $.ajax({
        type: "POST",
        url: "/ent/webcfg/save",
        cache:false,
        data:params
    }).done(function(data, textStatus){
        if(data.error==0){
            showMessage("success","配置保存成功了！");
            $("#pdtModal").modal("hide");
        }else{
            showMessage("danger","配置保存失败！"+data.errorMsg);
            $("#pdtModal").modal("hide");
        }
        $("#ldModal").modal("hide");
    }).fail(function(){
        $("#ldModal").modal("hide");
        alert("网络异常，请重试！");
    });
}