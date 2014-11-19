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
            url: "/card/list",
            cache:false,
            data:params
        }).done(function(data, textStatus){
            if(data.error==0){
                fnCallback(data);
            }else{
                alert(data.errorMsg);
            }
        }).fail(function(){
            alert("网络异常，请重试！");
        });
}