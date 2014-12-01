//生成列表缩略图
function generateReview(url,id){
    var obj = "<div class='list01'><div class='imgdiv'><img src='"+url+"'/></div>";
    obj +="<p></p>";
    obj +="<div class='btdiv'><a href='#'  class='delete delPic' eleId='"+id+"'><img src='img/list_delete.gif' /></a></div></div>";
    $("#images").append(obj);
    $(".delPic").bind("click",function(){
        delEle($(this),"pic",$(this).attr("eleId"));
    });
}

//生成列表图文预览
function generatePicMsgReview(title,date,intr,url,id){
    var obj = "<div class='list02'id='picMsg_"+id+"'>";
    obj += generatePicMsgChunk(title,date,intr,url,id);
    obj += "</div>";
    $("#picMsgs").append(obj);
    $(".editPicMsg").bind("click",function(){
        editEle($(this),"picMsg",$(this).attr("eleId"));
    });

    $(".delPicMsg").bind("click",function(){
        delEle($(this),"picMsg",$(this).attr("eleId"));
    });
}

//生成图文块
function generatePicMsgChunk(title,date,intr,url,id){
    var h = "<h2>"+title+"</h2><h4>"+date+"</h4><div class='info'><img src='"+url+"'/><p>"+intr+"</p></div>";
    h +="<div class='btdiv'> <a href='#' class='edit editPicMsg'><img src='img/list_edit.gif' /></a><a href='#' class='delete delPicMsg' eleId='"+id+"'><img src='img/list_delete.gif'/></a></div>";
    return h;
}

//生成picMsg or pic Modal 缩略图
function generateModalReview(url,type){
    var obj = "<div class='list01'><div class='imgdiv'><img src='"+url+"'/></div>";
    obj +="<p></p>";
    obj +="<div class='btdiv'><a href='#'  class='delete delPic'><img src='img/list_delete.gif' /></a></div></div>";
    if(type==="picMsg"){
        $("#euPicMsgImage").html(obj);
        $(".delPic").bind("click",function(){
            picMsgImage = "";
            $(this).parent().parent().remove();
        });
    }else if(type==="pic"){
        $("#euPicImage").html(obj);
        $(".delPic").bind("click",function(){
            picImage = "";
            $(this).parent().parent().remove();
        });
    }
}

//文件上传
function ajaxFileUpload(type,fieldId) {
    $.ajaxFileUpload({
        url: "/wx/eleupload/"+type+"/uploadImg", //用于文件上传的服务器端请求地址
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: fieldId, //文件上传域的ID
        dataType: 'json', //返回值类型 一般设置为json
        success: function (data, status)  //服务器成功响应处理函数
        {
            if(data.error==0){
                alert(data.errorMsg);
                switch(type){
                    case "picMsg":
                        picMsgImage = data.url;
                        generateModalReview(data.url,"picMsg");
                        break;
                    case "pic":
                        picImage = data.url;
                        generateModalReview(data.url,"pic");
                        break;
                }

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

//edit ele
function editEle(type,id){
    pmSaveType = "update/"+id;
    $("#ldModal").modal({
    backdrop:false,
    keyboard:false
    });
    $.ajax({
        type: "GET",
        url: "/wx/eleupload/"+type+"/detail/"+id,
        cache:false
    }).done(function(data, textStatus){
        if(data.error==0){
            if(type==="picMsg"){
                clearPicMsgModal();
                var o = data.data;
                $("#euPicMsgName").val(o.title);
                $("#euPicMsgIntr").val(o.intr);
                generateModalReview(o.url,"picMsg");
                $("#btnEuPicMsgSave").html("更新");
                $("#euPicMsgModal").modal();
            }
        }else{
            alert("获取详情失败！"+data.errorMsg);
        }
        $("#ldModal").modal("hide");
    }).fail(function(){
        $("#ldModal").modal("hide");
        alert("网络异常，请重试！");
    });
}

//delete ele
function delEle(obj,type,id){
//    $("#ldModal").modal({
//        backdrop:false,
//        keyboard:false
//    });
//    $.ajax({
//        type: "POST",
//        url: "/wx/eleupload/"+type+"/delete/"+id,
//        cache:false
//    }).done(function(data, textStatus){
//        if(data.error==0){
//            alert("素材删除成功了！");
            obj.parent().parent().remove();
//        }else{
//            alert("素材删除失败！"+data.errorMsg);
//        }
//        $("#ldModal").modal("hide");
//    }).fail(function(){
//        $("#ldModal").modal("hide");
//        alert("网络异常，请重试！");
//    });
}

//clear the picMsg modal form
function clearPicMsgModal(){
    $("#euPicMsgName").val("");
    $("#euPicMsgIntr").val("");
    picMsgImage = "";
    var file = $("#euPicMsgImg");
    file.after(file.clone().val(""));
    file.remove();
    $("#euPicMsgImgName").val("");
    $("#euPicMsgImage").html("");
}

//clear the pic modal form
function clearPicModal(){
    picImage = "";
    var file = $("#euPicImg");
    file.after(file.clone().val(""));
    file.remove();
    $("#euPicImgName").val("");
    $("#euPicImage").html("");
}