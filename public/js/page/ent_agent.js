//下拉框格式化和选择事件
function formatSelect2(e) {
    selectId = e.id;
    return e.text;
}

//刷新列表
function refreshData(sSource,aoData,fnCallback){
    var params = {};
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
        type: "GET",
        url: "/ent/agent/list",
        cache:false,
        data:params
    }).done(function(data, textStatus){
        fnCallback(data);
    }).fail(function(){
        alert("网络异常，请重试！");
    });
}

//show the unbind
function unbind(id){
    $("#btnEdit_"+id).button("loading");
    $.ajax({
        type: "POST",
        url: "/ent/agent/unBind/"+id,
        cache:false
    }).done(function(data, textStatus){
        $("#btnEdit_"+id).button("reset");
        if(data.error==0){
            showMessage("success","删除指定分销商成功！"+data.errorMsg);
            table.fnDraw();
        }else{
            showMessage("warning","没有查到数据！"+data.errorMsg);
        }
    }).fail(function(){
        $("#btnEdit_"+id).button("reset");
        alert("网络异常，请重试！");
    });
}