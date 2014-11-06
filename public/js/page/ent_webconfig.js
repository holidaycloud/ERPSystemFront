//生成单个缩略图
function generateReview(url){
    var obj = "<div class='list01'><div class='imgdiv'><img src='"+url+"'/></div>";
    obj +="<p></p>";
    obj +="<div class='btdiv'><a href='#' class='delete delPic' purl='"+url+"'><img src='img/list_delete.gif'/></a></div></div>";
    $("#images").html(obj);
    $(".delPic").bind('click',function(){
    for(var i in images){
        if(images[i]===$(this).attr("purl")){
            delete images[i];
            break;
        }
    }
    $(this).parent().parent().remove();
});
}

//文件上传
function ajaxFileUpload() {
$.ajaxFileUpload({
    url: '/ent/webcfg/uploadImg', //用于文件上传的服务器端请求地址
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

//资源列表选择框格式化
function formatSelect2(e){
    var d = $(e.element);
    return e.text;
}

//列表控件数据
function refreshData(sSource,aoData,fnCallback){
    var params = {};
    params.isRes = false;
    params.pName = $("#pName").val();
    var flag = 0;
    for(var aoD in aoData){
        if(aoData[aoD].name === "iDisplayLength"){
            params.pageSize = aoData[aoD].value;
            flag++;
        }else if(aoData[aoD].name === "iDisplayStart"){
            params.page = aoData[aoD].value;
            flag++;
        }
        if(2==flag){
            break;
        }
    }

    $.ajax({
        type: "POST",
        url: "/product/list",
        cache:false,
        data:params
    }).done(function(data, textStatus){
            fnCallback(data);
        }).fail(function(){
            alert("网络异常，请重试！");
        });
}

//编辑产品事件
function editPdt(id){
    saveType = "update/"+id;
    $("#btnEdit_"+id).button("loading");
    $.ajax({
        type: "GET",
        url: "/product/detail/"+id,
        cache:false
    }).done(function(data, textStatus){
            $("#btnEdit_"+id).button("reset");
            if(data.error==0){
                clearPdtModal();
                var o = data.data;
                $("#pdtType").val(o.productType);
                $("#pdtType").parent().addClass("state-disabled");
                $("#pdtType").attr("disabled",true);
                changeTypeEvent(o.productType);
                $("#pdtName").val(o.name);
                $("#pdtIntr").val(o.introduction);
                $("#pdtLat").val(o.gps.lat);
                $("#pdtLon").val(o.gps.lon);
                if(o.isHot){
                    $("#pdtHot")[0].checked = true;
                }
                if(o.isRecommend){
                    $("#pdtRcmd")[0].checked = true;
                }
                if(o.images&&o.images.length>0){
                    for(var i in o.images){
                        if(i==0){
                            first = o.images[i].url;
                            media_id = o.images[i].media_id?o.images[i].media_id:"";
                        }
                        images.push(o.images[i].url);
                        generateReview(o.images[i].url);
                    }
                }
                ue.setContent(o.content);
                $("#pdtClass").val(o.classify?o.classify:"");
                if(o.lable){
                    var str = "";
                    for(var i in o.lable){
                       if(i!=0){
                           str +=" ";
                       }
                        str += o.lable[i];
                    }
                    $("#pdtTags").val(str);
                }
                if(0==$("#pdtType").val()){
                    $("#pdtRl").select2("val", o.subProduct);
                    $("#pdtStDate").val(o.startDate);
                    $("#pdtStDate").datepicker('disable');
                    $("#pdtEndDate").val(o.endDate);
                    $("#pdtEndDate").datepicker('disable');
                }else if(1==$("#pdtType").val()){
                    $("#pdtSdTp").timepicker("setTime",o.startDate);
                    $("#pdtEdTp").timepicker("setTime",o.endDate);
                }else if(3!=$("#pdtType").val()){
                    $("[name=weekend]").each(function(){
                        $(this)[0].checked = false;
                        for(var i in o.weekend){
                            if($(this).val() == o.weekend[i]){
                                $(this)[0].checked = true;
                                break;
                            }
                        }
                    });
                }
                $("#btnPdtSave").html("更新");
                $("#pdtModal").modal();
            }else{
                showMessage("warning","没有查到数据！"+data.errorMsg);
            }
        }).fail(function(){
            $("#btnEdit_"+id).button("reset");
            alert("网络异常，请重试！");
        });
}

//clear the pdtModal form
function clearPdtModal(){
    $("#pdtType").val(0);
    $("#pdtType").parent().removeClass("state-disabled");
    $("#pdtType").attr("disabled",false);
    changeTypeEvent($("#pdtType").val());
    $("#pdtName").val("");
    $("#pdtIntr").val("");
    $("#pdtLat").val("");
    $("#pdtLon").val("");
    $("#pdtHot")[0].checked = false;
    $("#pdtRcmd")[0].checked = false;
    images = [];
    var file = $("#pdtImage");
    file.after(file.clone().val(""));
    file.remove();
    $("#pdtImgName").val("");
    $("#images").html("");

    ue.execCommand('cleardoc');
    $("#pdtClass").val("");
    $("#pdtTags").val("");
    $("#pdtRl").select2("val","");
//        $("#pdtContent").val("");
    $("#pdtSdTp").timepicker("setTime",false);
    $("#pdtEdTp").timepicker("setTime",false);
    $("#pdtStDate").val("");
    $("#pdtStDate").datepicker('enable')
    $("#pdtEndDate").val("");
    $("#pdtEndDate").datepicker('enable')
    $("[name=weekend]").each(function(){
        if($(this).val()==="0"||$(this).val()==="6"){
            $(this)[0].checked = true;
        }else{
            $(this)[0].checked = false;
        }
    });
}