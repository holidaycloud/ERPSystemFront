
//clear the resModal form
function clearResModal(){
    $("#resName").val("");
    $("#resIntr").val("");
    $("#resLat").val("");
    $("#resLon").val("");
    ue.execCommand('cleardoc');
//        $("#ResContent").val("");
    $("[name=resweekend]").each(function(){
        if($(this).val()==="0"||$(this).val()==="6"){
            $(this)[0].checked = true;
        }else{
            $(this)[0].checked = false;
        }
    });
}

//列表控件数据方法
function refreshData(sSource,aoData,fnCallback){
    var params = {};
    params.isRes = true;
    params.pName = $("#rName").val();
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
    params.isRes = true;
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

//编辑资源调用方法
function editRes(id){
    saveType = "update/"+id;
    $("#btnEdit_"+id).button("loading");
    $.ajax({
        type: "GET",
        url: "/product/detail/"+id,
        cache:false
    }).done(function(data, textStatus){
        $("#btnEdit_"+id).button("reset");
        if(data.error==0){
            clearResModal();
            var o = data.data;
            $("#resName").val(o.name);
            $("#resIntr").val(o.introduction);
            $("#resLat").val(o.gps.lat);
            $("#resLon").val(o.gps.lon);
            ue.setContent(o.content);
            $("[name=resweekend]").each(function(){
                $(this)[0].checked = false;
                for(var i in o.weekend){
                    if($(this).val() == o.weekend[i]){
                        $(this)[0].checked = true;
                        break;
                    }
                }
            });
            $("#btnResSave").html("更新");
            $("#resModal").modal();
        }else{
            showMessage("warning","没有查到数据！"+data.errorMsg);
        }
    }).fail(function(){
        $("#btnEdit_"+id).button("reset");
        alert("网络异常，请重试！");
    });
}