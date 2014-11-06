//刷新列表
function refreshData(sSource,aoData,fnCallback){
    var params = {};
    params.eName = $("#entName").val();
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
        url: "/ent/list",
        cache:false,
        data:params
    }).done(function(data, textStatus){
        fnCallback(data);
    }).fail(function(){
        alert("网络异常，请重试！");
    });
}

//show the editModal
function editEnt(id){
    saveType = "update/"+id;
    $("#btnEdit_"+id).button("loading");
    $.ajax({
        type: "GET",
        url: "/ent/detail/"+id,
        cache:false
    }).done(function(data, textStatus){
        $("#btnEdit_"+id).button("reset");
        if(data.error==0){
            clearEntModal();
            var o = data.data;
            $("#fentName").val(o.name);
            $("#fcontactName").val(o.contactName);
            $("#fcontactEmail").val(o.contactEmail);
            $("#fcontactMobile").val(o.contactPhone);
            $("#fEntCode").val(o.proCode);
            $("#fentType").val(o.type);
            $("#fentRmk").val(o.remark);
            if(o.isEnable){
                $("#fentIsEnable")[0].checked = true;
            }else{
                $("#fentIsEnable")[0].checked = false;
            }
            $("#btnEntSave").html("更新");
            $("#entModal").modal();
        }else{
            showMessage("warning","没有查到数据！"+data.errorMsg);
        }
    }).fail(function(){
        $("#btnEdit_"+id).button("reset");
        alert("网络异常，请重试！");
    });
}

//clear entModal form
function clearEntModal(){
    $("#fentName").val("");
    $("#fcontactName").val("");
    $("#fcontactEmail").val("");
    $("#fcontactMobile").val("");
    $("#fEntCode").val("");
    $("#fentType").val(-1);
    $("#fentRmk").val("");
    $("#fentIsEnable")[0].checked = true;
}