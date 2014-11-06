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
        url: "/product/class/list",
        cache:false,
        data:params
    }).done(function(data, textStatus){
            fnCallback(data);
        }).fail(function(){
            alert("网络异常，请重试！");
        });
}

//编辑产品事件
function editPdtClass(id){
    saveType = "update/"+id;
    $("#btnEdit_"+id).button("loading");
    $.ajax({
        type: "GET",
        url: "/product/class/detail/"+id,
        cache:false
    }).done(function(data, textStatus){
            $("#btnEdit_"+id).button("reset");
            if(data.error==0){
                clearPdtClassModal();
                var o = data.data;
                $("#pdtClsName").val(o.name);
                if(o.isEnable){
                    $("#pdtClsEnable")[0].checked = true;
                }
                $("#btnPdtClsSave").html("更新");
                $("#pdtClsModal").modal();
            }else{
                showMessage("warning","没有查到数据！"+data.errorMsg);
            }
        }).fail(function(){
            $("#btnEdit_"+id).button("reset");
            alert("网络异常，请重试！");
        });
}

//clear the pdtClassModal modal
function clearPdtClassModal(){
    $("#pdtClsName").val("");
    $("#pdtClsEnable")[0].checked = false;
    $("#pdtClsEnable").attr("disabled",false);
}