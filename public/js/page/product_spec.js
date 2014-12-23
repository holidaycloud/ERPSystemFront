//下拉框格式化和选择事件
function formatSelect2(e){
    selectedPdt = e.id;
    $("#specList").html("无规格");
    //获取产品的所有规格
    $("#ldModal").modal({
        backdrop:false,
        keyboard:false
    });
    //get products spec
    $.ajax({
        type: "GET",
        url: "/product/spec/list/"+selectedPdt,
        cache:false
    }).done(function(data, textStatus){
        var h = "";
        if(data.specs.length>0){
            $("#specList").html("");
        }
        for(var e in data.specs){
            var obj = data.specs[e];
            generateSpecChunk("specList",obj);
        }
        $("#ldModal").modal("hide");
    }).fail(function(){
        $("#ldModal").modal("hide");
        alert("网络异常，请重试！");
    });
    return e.text;
}

//生成规格块
function generateSpecChunk(cavId,object){
    var h = "";
    h += "<section><div class=\"row\">";
    h += "<label class=\"label col col-1\">产品规格</label>";
    h += "<div class=\"col col-6\"><label class=\"input\">";
    if(object){
        h += "<input type=\"text\" name=\"psSp\" placeholder=\"请输入需要新增的规格\" sid=\""+object._id+"\" value=\""+object.name+"\">";
    }else{
        h += "<input type=\"text\" name=\"psSp\" placeholder=\"请输入需要新增的规格\" value=\"\">";
    }
    h += "</label></div>";
    h += "<div class=\"col col-5\">";
    h += "<button type=\"button\" class=\"btn btn-danger psDel\">删　除</button></div>";
    h += "</div></section>";
    $("#"+cavId).append(h);
    $(".psDel").unbind("click").bind("click",function(e){
        $(this).parent().parent().parent().remove();
        if(0==$("input[name='psSp']").length){
            $("#specList").html("无规格");
        }
    });
}