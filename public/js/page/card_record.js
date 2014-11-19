//列表控件数据
function refreshData(sSource,aoData,fnCallback){
    var params = {};
    params.cardNo = $("#cardNo").val().trim();
//    var flag = 0;
//    for(var aoD in aoData){
//        if(aoData[aoD].name === "iDisplayLength"){
//            params.pageSize = aoData[aoD].value;
//            flag++;
//        }else if(aoData[aoD].name === "iDisplayStart"){
//            params.page = aoData[aoD].value;
//            flag++;
//        }
//        if(2==flag){
//            break;
//        }
//    }
    if(""!==$("#cardNo").val().trim()){
        $.ajax({
            type: "POST",
            url: "/card/getRecords",
            cache:false,
            data:params
        }).done(function(data, textStatus){
            if(data.error==0){
                $("#showCardNo").html($("#cardNo").val().trim());
                $("#showCardMoney").html(data.balance);
                $("#cardInfo").show();
                fnCallback(data);
            }else{
                $("#showCardNo").html("");
                $("#showCardMoney").html("");
                $("#cardInfo").hide();
                fnCallback(data);
                alert(data.errorMsg);
            }
        }).fail(function(){
            alert("网络异常，请重试！");
        });
    }
}