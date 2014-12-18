
//clear the newsModal form
function clearNewsModal(){
    $("#newsTitle").val("");
    ue.execCommand('cleardoc');
}

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
        url: "/news/list",
        cache:false,
        data:params
    }).done(function(data, textStatus){
        fnCallback(data);
    }).fail(function(){
        alert("网络异常，请重试！");
    });
}

//编辑资源调用方法
function editNews(id){
    saveType = "update/"+id;
    $("#btnEdit_"+id).button("loading");
    $.ajax({
        type: "GET",
        url: "/news/detail/"+id,
        cache:false
    }).done(function(data, textStatus){
        $("#btnEdit_"+id).button("reset");
        if(data.error==0){
            clearNewsModal();
            var o = data.data;
            $("#newsTitle").val(o.title);
            ue.setContent(o.content);
            $("#btnNewsSave").html("更新");
            $("#newsModal").modal();
        }else{
            showMessage("warning","没有查到数据！"+data.errorMsg);
        }
    }).fail(function(){
        $("#btnEdit_"+id).button("reset");
        alert("网络异常，请重试！");
    });
}