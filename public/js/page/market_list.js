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
        type: "GET",
        url: "/marketing/market/list",
        cache:false,
        data:params
    }).done(function(data, textStatus){
            fnCallback(data);
        }).fail(function(){
            alert("网络异常，请重试！");
        });
}

//编辑产品事件
function editMarket(id){
    saveType = "update/"+id;
    $("#btnEdit_"+id).button("loading");
    $.ajax({
        type: "GET",
        url: "/marketing/market/detail/"+id,
        cache:false
    }).done(function(data, textStatus){
            $("#btnEdit_"+id).button("reset");
            if(data.error==0){
                clearMarketModal();
                var o = data.data;
                $("#mrktName").val(o.name);
                $("#mrktContent").val(o.content);
                $("#mrktChannel").val(o.channel);
                $("#mrktStDate").val(o.startDate);
                $("#mrktEndDate").val(o.endDate);
                $("#btnMrktSave").html("更新");
                $("#marketModal").modal();
            }else{
                showMessage("warning","没有查到数据！"+data.errorMsg);
            }
        }).fail(function(){
            $("#btnEdit_"+id).button("reset");
            alert("网络异常，请重试！");
        });
}

//clear the MarketModal modal
function clearMarketModal(){
    $("#mrktName").val("");
    $("#mrktContent").val("");
    $("#mrktChannel").val("");
    $("#mrktStDate").val("");
    $("#mrktStDate").datepicker('setDate',"+0d");
    $("#mrktEndDate").val("");
    $("#mrktEndDate").datepicker('setDate',"+0d");
}