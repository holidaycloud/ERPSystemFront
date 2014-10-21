//生成缩略图
function generateReview(url){
    var obj = "<div class='list01'><div class='imgdiv'><img src='"+url+"'/></div>";
    obj +="<p></p>";
    obj +="<div class='btdiv'><a href='#'  class='delete'><img src='img/list_delete.gif' /></a></div></div>";
    $("#images").append(obj);
}

//生成图文
function generatePicMsgList(title,date,intr,url,id){
    var obj = "<div class='list02'><h2>"+title+"</h2><h4>"+date+"</h4><div class='info'><img src='"+url+"'/><p>"+intr+"</p></div>";
    obj +="<div class='btdiv'> <a href='#' class='edit'><img src='img/list_edit.gif' /></a><a href='#' class='delete'><img src='img/list_delete.gif'/></a></div></div>";
    $("#picMsgs").append(obj);
}

//文件上传
function ajaxFileUpload() {
    $.ajaxFileUpload({
        url: '/product/uploadImg', //用于文件上传的服务器端请求地址
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: 'pdtImage', //文件上传域的ID
        dataType: 'json', //返回值类型 一般设置为json
        success: function (data, status)  //服务器成功响应处理函数
        {
            if(data.error==0){
                alert(data.errorMsg);
                images.push(data.url);
                generateReview(data.url);
            }else{
                alert(data.errorMsg);
            }
            //
            //                    if (typeof (data.error) != 'undefined') {
            //                        if (data.error != '') {
            //                            alert(data.error);
            //                        } else {
            //                            alert(data.msg);
            //                        }
            //                    }
        },
        error: function (data, status, e)//服务器响应失败处理函数
        {
            alert("上传失败："+e);
        }
    });
    return false;
};