//onselect product
function formatSelect2(e){
    var d = $(e.element);
    selectedPdt = e.id;
    return e.text;
}

//刷新列表
function refreshData(sSource,aoData,fnCallback){
    var params = {};
    params.pid = selectedPdt;
    params.startDate = $("#olStDate").val();
    params.endDate = $("#olEndDate").val();
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
        url: "/order/list",
        cache:false,
        data:params
    }).done(function(data, textStatus){
        fnCallback(data);
    }).fail(function(){
        alert("网络异常，请重试！");
    });
}

//clear order detail modal
function clearOdModal(){
    $("#odid").html("");
    $("#odCTime").html("");
    $("#odName").html("");
    $("#odDate").html("");
    $("#odPrice").html("");
    $("#odQty").html("");
    $("#odCus").html("");
    $("#odRemark").val("");
    $("#odTotal").html("");
}

//generate customer input
function htmlOrderDetailCustomers(number,names,phones){
    var html = "";
    for(var i=0;i<number;i++){
        html +="<section><div class=\"row\"><label class=\"label col col-2\">使用人</label>";
        html +="<label class=\"label col col-2\">"+names[i]+"</label>";
        html +="<label class=\"label col col-2\">手机号</label>";
        html +="<label class=\"label col col-2\">"+phones[i]+"</label></div></section>";
    }
    $("#odCus").html(html);
}

//order detail click func
function btnDetail(orderId){
    $("#ldModal").modal({
        backdrop:false,
        keyboard:false
    });
    $.ajax({
        type: "POST",
        url: "/order/detail",
        cache:false,
        data:{oid:orderId}
    }).done(function(data, textStatus){
        data = data.data;
        clearOdModal();
        $("#odid").html(data.orderID);
        $("#odCTime").html(data.orderDate);
        $("#odName").html(data.product.name);
        $("#odDate").html(data.startDate);
        $("#odPrice").html(data.price.price);
        $("#odQty").html(data.quantity);
        $("#odRemark").val(data.remark);
        $("#odRemark").attr('disabled',true);
        $("#odTotal").html(data.totalPrice);
        var names = [];
        var phones = [];
        names.push(data.customer&&data.customer.name?data.customer.name:"");
        phones.push(data.customer&&data.customer.mobile?data.customer.mobile:"");
        htmlOrderDetailCustomers(1,names,phones);
        $("#ldModal").modal("hide");
        $("#btnOdSave").hide();
        $("#btnOdSave").attr("oid","");
        $("#odModal").modal();
    }).fail(function(){
        $("#ldModal").modal("hide");
        alert("网络异常，请重试！");
    });
}

//confirm click func
function btnConfrim(id){
    $("#btnConfrim_"+id).button("loading");
    $.ajax({
        type: "POST",
        url: "/order/confirm/"+id,
        cache:false
    }).done(function(data, textStatus){
        $("#btnConfrim_"+id).button("reset");
        if(data.error==0){
            showMessage("success","确认订单成功！");
            table.fnDraw();
        }else{
            showMessage("danger","确认订单异常！"+data.errorMsg);
        }
    }).fail(function(){
        $("#btnConfrim_"+id).button("reset");
        alert("网络异常，请重试！");
    });
}

//order edit click func
function btnEdit(orderId){
    $("#ldModal").modal({
        backdrop:false,
        keyboard:false
    });
    $.ajax({
        type: "POST",
        url: "/order/detail",
        cache:false,
        data:{oid:orderId}
    }).done(function(data, textStatus){
        data = data.data;
        clearOdModal();
        $("#odid").html(data.orderID);
        $("#odCTime").html(data.orderDate);
        $("#odName").html(data.product.name);
        $("#odDate").html(data.startDate);
        $("#odPrice").html(data.price.price);
        $("#odQty").html(data.quantity);
        $("#odRemark").val(data.remark);
        $("#odRemark").attr('disabled',false);
        $("#odTotal").html(data.totalPrice);
        var names = [];
        var phones = [];
        names.push(data.customer&&data.customer.name?data.customer.name:"");
        phones.push(data.customer&&data.customer.mobile?data.customer.mobile:"");
        htmlOrderDetailCustomers(1,names,phones);
        $("#btnOdSave").show();
        $("#btnOdSave").attr("oid",orderId);
        $("#ldModal").modal("hide");
        $("#odModal").modal();
    }).fail(function(){
        $("#ldModal").modal("hide");
        alert("网络异常，请重试！");
    });
}