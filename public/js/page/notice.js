//列表控件数据方法
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
        url: "/notice/list",
        cache:false,
        data:params
    }).done(function(data, textStatus){
        fnCallback(data);
    }).fail(function(){
        alert("网络异常，请重试！");
    });
}