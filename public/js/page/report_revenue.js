//刷新列表数据
function refreshData(sSource,aoData,fnCallback){
    var params = {};
    params.startDate = $("#stDate").val();
    params.endDate = $("#endDate").val();

    $.ajax({
        type: "POST",
        url: "/report/getRevenueList",
        cache:false,
        data:params
    }).done(function(data, textStatus){
        fnCallback(data);
    }).fail(function(){
        alert("网络异常，请重试！");
    });
}