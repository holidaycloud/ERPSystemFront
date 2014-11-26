//列表控件数据
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
        type: "POST",
        url: "/customer/level/list",
        cache:false,
        data:params
    }).done(function(data, textStatus){
            fnCallback(data);
        }).fail(function(){
            alert("网络异常，请重试！");
        });
}

//编辑产品事件
function editCusLevel(id){
    saveType = "update/"+id;
    $("#btnEdit_"+id).button("loading");
    $.ajax({
        type: "GET",
        url: "/customer/level/detail/"+id,
        cache:false
    }).done(function(data, textStatus){
            $("#btnEdit_"+id).button("reset");
            if(data.error==0){
                clearCusLevelModal();
                var o = data.data;
                $("#cusLvlName").val(o.name);
                $("#cusLvlScore").val(o.score);
                $("#btnCusLvlSave").html("更新");
                $("#cusLvlModal").modal();
            }else{
                showMessage("warning","没有查到数据！"+data.errorMsg);
            }
        }).fail(function(){
            $("#btnEdit_"+id).button("reset");
            alert("网络异常，请重试！");
        });
}

//clear the pdtClassModal modal
function clearCusLevelModal(){
    $("#cusLvlName").val("");
    $("#cusScoreName").val("");
}