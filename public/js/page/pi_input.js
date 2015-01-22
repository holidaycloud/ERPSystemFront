//下拉框格式化和选择事件
function formatSelect2(e) {
    selectedPdt = e.id;
    var d = $(e.element);
    selectPdtType = d.data('type');
    if (0 == selectPdtType) {
        $("#buttonGrp").show();
        $("#pii0").show();
        $("#pii3").hide();
        var st = new Date(d.data('std'));
        var ed = new Date(d.data('edd'));
        $("#piiStDate").datepicker("option", "minDate", st);
        $("#piiStDate").datepicker("option", "maxDate", ed);
        $("#piiStDate").datepicker('setDate', st);
        $("#piiEndDate").datepicker("option", "minDate", st);
        $("#piiEndDate").datepicker("option", "maxDate", ed);
        $("#piiEndDate").datepicker('setDate', ed);
    } else if (3 == selectPdtType) {
        $("#buttonGrp").hide();
        $("#pii3").html("");
        //get products spec
        $("#ldModal").modal({
            backdrop: false,
            keyboard: false
        });
        $.ajax({
            type: "GET",
            url: "/product/spec/list/" + selectedPdt,
            cache: false
        }).done(function (data, textStatus) {
            var h = "";
            if(data.specs.length>0){
                for (var e in data.specs) {
                    var obj = data.specs[e];
                    generatePriceInput3Chunk("pii3", obj, true);
                }
            }else{
                var obj = {};
                obj._id = new Date().getTime();
                generatePriceInput3Chunk("pii3", obj, false); //无规格价格录入
            }
            $("#ldModal").modal("hide");
        }).fail(function () {
            $("#ldModal").modal("hide");
            alert("网络异常，请重试！");
        });

        $("#pii0").hide();
        $("#pii3").show();
    }
    return e.text;
}

function generatePriceInput3Chunk(cavId, object, isSpec) {
    //规格名和ID
    var html = "";
    if(isSpec){
        html += "<section><div class=\"row\"><label class=\"label col col-2\">规格</label>";
        html += "<label class=\"label col col-10\">"+object.name+"</label></div></section>";
    }
    //成本价输入块
    html += "<section><div class=\"row\"><label class=\"label col col-2\">成本价</label>";
    html += "<div class=\"col col-10\"><label class=\"input\"><input type=\"text\" id=\"piiBasePrc_" + object._id + "\" placeholder=\"请输入成本价\">";
    html += "</label></div></div></section>";
    //结算价输入块
    html += "<section><div class=\"row\"><label class=\"label col col-2\">结算价</label>";
    html += "<div class=\"col col-10\"><label class=\"input\"><input type=\"text\" id=\"piiTradePrc_" + object._id + "\" placeholder=\"请输入结算价\">";
    html += "</label></div></div></section>";
    //卖价输入块
    html += "<section><div class=\"row\"><label class=\"label col col-2\">卖价</label>";
    html += "<div class=\"col col-10\"><label class=\"input\"><input type=\"text\" id=\"piiPrc_" + object._id + "\" placeholder=\"请输入卖价\">";
    html += "</label></div></div></section>";
    //库存输入块
    html += "<section><div class=\"row\"><label class=\"label col col-2\">库存</label>";
    html += "<div class=\"col col-10\"><label class=\"input\"><input type=\"text\" id=\"piiIvty_" + object._id + "\" placeholder=\"请输入库存\">";
    html += "</label></div></div></section>";
    //保存按钮
    html += "<section><div class=\"row\">";
    html += "<div class=\"col col-2\"><label class=\"input\"><input type=\"button\" class=\"btn btn-primary\" id=\"btnSave_" + object._id + "\" value=\"保存"+(isSpec?"规格-"+object.name:"")+"数据\">";
    html += "</label></div></div></section>";
    $("#" + cavId).append(html);
    $("#btnSave_" + object._id).bind("click", function (e) {
        e.preventDefault();
        if (!selectedPdt || selectedPdt.trim() === "") {
            alert("请选择需要录入价格库存的产品！");
            return false;
        }
        var params = {};
        params.product = selectedPdt;
        params.pType = selectPdtType;
        //clear params
        var flag = true;
        if(isSpec){
            params.specId = object._id;
        }
        var base = $("#piiBasePrc_" + object._id).val();
        var trade = $("#piiTradePrc_" + object._id).val();
        var price = $("#piiPrc_" + object._id).val();
        var inventory = $("#piiIvty_" + object._id).val();
        if (base === "" || isNaN(base)) {
            alert("请输入有效的成本价格！");
            flag = false;
        }
        if (trade === "" || isNaN(trade)) {
            alert("请输入有效的结算价格！");
            flag = false;
        }
        if (price === "" || isNaN(price)) {
            alert("请输入有效的卖格！");
            flag = false;
        }
        if (inventory === "" || isNaN(inventory)) {
            alert("请输入有效的库存！");
            flag = false;
        }
        if (flag) {
            params.basePrice = base;
            params.tradePrice = trade;
            params.price = price;
            params.inventory = inventory;
        } else {
            return false;
        }
        $("#ldModal").modal({
            backdrop: false,
            keyboard: false
        });
        $.ajax({
            type: "POST",
            url: "/pi/add",
            cache: false,
            data: params
        }).done(function (data, textStatus) {
            if (data.error != 0) {
                showMessage("error", "数据保存失败！" + data.errorMsg);
            } else {
                showMessage("success", "数据保存成功！");
            }
            $("#ldModal").modal("hide");
        }).fail(function () {
            $("#ldModal").modal("hide");
            alert("网络异常，请重试！");
        });
    });
}