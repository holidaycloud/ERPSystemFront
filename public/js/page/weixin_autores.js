function createTable(){
    $('#tblKeyResLst').dataTable({
        "bPaginite":true,
        "sPaginationType" : "bootstrap",
        "bFilter":false,
        "bSort" : false,// 排序
        "bLengthChange" : false,// 每行显示记录数
        "iDisplayLength" : 25,// 每页显示行数
        "bDestroy" : true,
        "bServerSide" : true,
        "sServerMethod": "POST",
        "sAjaxSource": "",
        "aoColumns":[
            {mData:"name"},
            {mData:"keys"},
            {mData:"autoRes"},
            {mData:"_id",
                mRender:function(data,type,full){
                    return "<button id='btnEdit_"+data+"' onclick='editKeyRes(\""+data+"\");' class='btn btn-primary btn-xs' data-loading-text='加载中...请稍候'>编辑</button>";
                }}
        ],
        "oLanguage": {
            "sProcessing" : "正在加载数据...",
            "sZeroRecords" : "没有符合条件的信息",
            "sLengthMenu" : "每页显示_MENU_条 ",
            "sInfo" : "当前数据从_START_ 到 _END_ 条记录——总记录数为 _TOTAL_ 条",
            "sInfoEmpty" : "没有符合条件的信息",
            "sInfoFiltered" : ""
        },
        fnServerData:refreshData
    });
}

//列表控件数据
function refreshData(sSource, aoData, fnCallback) {
    var params = {};
    var flag = 0;
    for (var aoD in aoData) {
        if (aoData[aoD].name === "iDisplayLength") {
            params.pageSize = aoData[aoD].value;
            flag++;
        } else if (aoData[aoD].name === "iDisplayStart") {
            params.page = aoData[aoD].value;
            flag++;
        }
        if (2 == flag) {
            break;
        }
    }

    $.ajax({
        type: "POST",
        url: "/wx/autoRes/keys",
        cache: false,
        data: params
    }).done(function (data, textStatus) {
        fnCallback(data);
        $("#ldModal").modal("hide");
    }).fail(function () {
        alert("网络异常，请重试！");
        $("#ldModal").modal("hide");
    });
}

//编辑关键字自动回复事件
function editKeyRes(id) {
    saveType = "update/" + id;
    $("#btnEdit_" + id).button("loading");
    $.ajax({
        type: "GET",
        url: "/wx/autoRes/key/detail?id="+id,
        cache: false
    }).done(function (data, textStatus) {
        $("#btnEdit_" + id).button("reset");
        if (data.error == 0) {
            clearAutoKeyResModal();
            var o = data.data;
            $("#akrName").val(o.name);
            $("#akrRes").val(o.autoRes);
            if (o.keys) {
                var tmp = "";
                for (var i in keys) {
                    if (i == 0) {
                        tmp = keys[i];
                    } else {
                        tmp += " " + keys[i];
                    }
                }
                $("#akrKeys").val(tmp);
            }
            $("#btnAKRSave").html("更新");
            $("#autoKeyResModal").modal();
        } else {
            showMessage("warning", "没有查到数据！" + data.errorMsg);
        }
    }).fail(function () {
        $("#btnEdit_" + id).button("reset");
        alert("网络异常，请重试！");
    });
}

//clear the autoKeyResModal modal
function clearAutoKeyResModal() {
    $("#akrName").val("");
    $("#akrKeys").val("");
    $("#akrRes").val("");
}