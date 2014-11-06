//刷新列表数据
function refreshData(sSource,aoData,fnCallback){
    var params = {};
    params.mobile = $("#sMbrMobile").val();
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
        url: "/entMember/list",
        cache:false,
        data:params
    }).done(function(data, textStatus){
        fnCallback(data);
    }).fail(function(){
        alert("网络异常，请重试！");
    });
}

//show the editModal
function editMbr(id){
    saveType = "update/"+id;
    $("#btnEdit_"+id).button("loading");
    $.ajax({
        type: "GET",
        url: "/entMember/detail/"+id,
        cache:false
    }).done(function(data, textStatus){
        $("#btnEdit_"+id).button("reset");
        if(data.error==0){
            clearMbrModal();
            var o = data.data;
            $("#mbrName").val(o.loginName);
            $("#mbrMobile").val(o.mobile);
            $("#mbrEmail").val(o.email);
            $("#mbrPwd").val(o.passwd);
            $("#mbrPwd").attr('disabled',true);

            if(getCookie('ea')==="true"){
                $("#mbrEntRow").removeClass("hidden");
                initSelectEnts(data.ents);
                $("#mbrEnt").val(o.ent.name);
            }else{
                $("#mbrEntRow").addClass("hidden");
            }
            $("#btnMbrSave").html("更新");
            $("#mbrModal").modal();
        }else{
            showMessage("warning","没有查到数据！"+data.errorMsg);
        }
    }).fail(function(){
        $("#btnEdit_"+id).button("reset");
        alert("网络异常，请重试！");
    });
}


//clear the entModal form
function clearMbrModal(){
    $("#mbrEnt").val("");
    $("#mbrName").val("");
    $("#mbrMobile").val("");
    $("#mbrEmail").val("");
    $("#mbrPwd").val("");
}


//append select options for selectEnts
function initSelectEnts(data){
    entNames = [];
    tempEnts = data;
    for(var i in tempEnts){
        entNames.push(tempEnts[i].name);
    }
    $("#mbrEnt").autocomplete("option","source",entNames);
    $("#mbrEnt").autocomplete( "option", "appendTo", "#mbrModal" );
//        var h = "";
//        for(var e in data){
//            h +="<option value="+data[e]._id+">"+data[e].name+"</option>";
//        }
//        $("#selectEnts").html(h);
}