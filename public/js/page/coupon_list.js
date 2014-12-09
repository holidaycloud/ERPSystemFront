//根据类型改变页面字段显示
function changeTypeEvent(type){
    if(4==type){
       $("#cpnValueRow").hide();
    }else{
        $("#cpnValue").val("");
        $("#cpnValueRow").show();
    }
}

//产品列表选择框格式化
function formatSelect2(e){
    var d = $(e.element);
    return e.text;
}

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
        url: "/marketing/coupon/list",
        cache:false,
        data:params
    }).done(function(data, textStatus){
            fnCallback(data);
        }).fail(function(){
            alert("网络异常，请重试！");
        });
}

//编辑产品事件
function couponDetail(id){
    $("#btnEdit_"+id).button("loading");
    $.ajax({
        type: "GET",
        url: "/marketing/coupon/detail/"+id,
        cache:false
    }).done(function(data, textStatus){
            $("#btnEdit_"+id).button("reset");
            if(data.error==0){
                clearCouponModal();
                var o = data.data;
                $("#cpnMarket").val(o.marketing);
                $("#cpnQtyRow").hide();
                $("#cpnMinValue").val(o.minValue);
                $("#cpnType").val(o.type);
                changeTypeEvent(o.type);
                $("#cpnValue").val(o.value);
                $("#cpnName").val(o.name);
                $("#cpnPdts").val(o.product);
                $("#cpnStDate").val(o.startDate);
                $("#cpnEndDate").val(o.endDate);
                $("#cpnBtnGroup").hide();
                changeCouponModal(true);
                $("#couponModal").modal();
            }else{
                showMessage("warning","没有查到数据！"+data.errorMsg);
            }
        }).fail(function(){
            $("#btnEdit_"+id).button("reset");
            alert("网络异常，请重试！");
        });
}

//clear the CouponModal modal
function clearCouponModal(){
    $("#cpnMarket").val("");
    $("#cpnQuantity").val("");
    $("#cpnMinValue").val("");
    $("#cpnType").val(0);
    $("#cpnValue").val("");
    $("#cpnName").val("");
    $("#cpnPdts").select2("val","");
    $("#cpnStDate").val("");
    $("#cpnStDate").datepicker('setDate',"+0d");
    $("#cpnEndDate").val("");
    $("#cpnEndDate").datepicker('setDate',"+0d");
}

//change able for the CouponModal modal
function changeCouponModal(disabled){
    $("#cpnMarket").attr("disabled",disabled);
    $("#cpnQuantity").attr("disabled",disabled);
    $("#cpnType").attr("disabled",disabled);
    $("#cpnValue").attr("disabled",disabled);
    $("#cpnName").attr("disabled",disabled);
    $("#cpnPdts").attr("disabled",disabled);
    $("#cpnStDate").attr("disabled",disabled);
    $("#cpnEndDate").attr("disabled",disabled);
}