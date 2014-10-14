//初始化年月日
function initYMD(year,month,day,isSet){
    //init years
    var years = "";
    for(var i=1970;i<=now.getFullYear();i++){
        if(isSet&&year==i){
            years +="<option value='"+i+"' selected>"+i+"</option>";
        }else{
            years +="<option value='"+i+"'>"+i+"</option>";
        }

    }
    $("#cusYear").html(years);
    //init months
    var months = "";
    for(var i=1;i<=12;i++){
        if(isSet&&month==i){
            months +="<option value='"+i+"' selected>"+i+"</option>";
        }else{
            months +="<option value='"+i+"'>"+i+"</option>";
        }

    }
    $("#cusMonth").html(months);
    //init days
    getDayNumOfMonth(year,month,day,isSet);
}

//初始化指定年月的天数
function getDayNumOfMonth(year,month,setDay,isSet){
    var d = new Date(year,month,0);
    var days = "";
    for(var i=1;i<=d.getDate();i++){
        if(isSet&&setDay==i){
            days +="<option value='"+i+"' selected>"+i+"</option>";
        }else{
            days +="<option value='"+i+"'>"+i+"</option>";
        }

    }
    $("#cusDay").html(days);
}

//列表控件数据方法
function refreshData(sSource,aoData,fnCallback){
    var params = {};
    params.mobile = $("#sCusMobile").val();
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
        url: "/customer/list",
        cache:false,
        data:params
    }).done(function(data, textStatus){
            fnCallback(data);
        }).fail(function(){
            alert("网络异常，请重试！");
        });
}

//编辑按钮调用方法
function editCus(id){
    saveType = "update/"+id;
    $("#btnEdit_"+id).button("loading");
    $.ajax({
        type: "GET",
        url: "/customer/detail/"+id,
        cache:false
    }).done(function(data, textStatus){
            $("#btnEdit_"+id).button("reset");
            if(data.error==0){
                clearCusModal();
                var o = data.data;
                $("#cusMobile").val(o.mobile);
                $("#cusName").val(o.name);
                $("#cusLoginName").val(o.loginName);
                $("#cusEmail").val(o.email);
                $("#cusAddress").val(o.address);
                $("#cusPwd").val(o.passwd);
                $("#cusPwd").attr('disabled',true);
                if(o.isEnable){
                    $("#cusEnable")[0].checked = true;
                }else{
                    $("#cusEnable")[0].checked = false;
                }
                var birth = new Date(o.birthday);
                initYMD(birth.getFullYear(),birth.getMonth()+1,birth.getDate(),true);
                $("#btnCusSave").html("更新");
                $("#cusEnableSection").show();
                $("#cusModal").modal();
            }else{
                showMessage("warning","没有查到数据！"+data.errorMsg);
            }
        }).fail(function(){
            $("#btnEdit_"+id).button("reset");
            alert("网络异常，请重试！");
        });
}

//clear the cusModal form
function clearCusModal(){
    $("#cusMobile").val("");
    $("#cusName").val("");
    $("#cusLoginName").val("");
    $("#cusEmail").val("");
    $("#cusAddress").val("");
    $("#cusPwd").val("");
    $("#cusYear").val(1970);
    $("#cusMonth").val(1);
    $("#cusDay").val(1);
    $("#cusEnable")[0].checked = true;
}